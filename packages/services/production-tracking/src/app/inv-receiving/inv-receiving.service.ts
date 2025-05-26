import { GlobalResponseObject, ProcessTypeEnum, INV_C_InvOutAllocIdRequest, PTS_C_InvIssuanceRefCreateRequest } from "@xpparel/shared-models";
import { ErrorResponse } from "@xpparel/backend-utils";
import { FgOpDepEntity } from "../entity/fg-op-dep.entity";
import { DataSource, In } from "typeorm";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { InvReceivingHelperService } from "./inv-receiving-helper.service";
import { InvReceivingEntity } from "../entity/inv-receiving.entity";
import { FgBundleRepository } from "../entity/repository/fg-bundle.repository";
import { InvReceivingRepository } from "../entity/repository/inv-receiving.repository";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InvReceivingPslEntity } from "../entity/inv-receiving-psl.entity";
import { InvReceivingPslRepository } from "../entity/repository/inv-receiving-psl.repository";
import { OpReportingHelperService } from "../op-reporting/op-reporting-helper.service";
import { OpSequenceOpgEntity } from "../entity/op-sequence-opg.entity";


@Injectable()
export class InvReceivingService {
    private ALLOCATE_INV_ONLY_FOR_CURR_PROC_TYPE = true;
    constructor(
        private dataSource: DataSource,
        private fgBunRepo: FgBundleRepository,
        private invRecHelperService: InvReceivingHelperService,
        private invReceivingRepo: InvReceivingRepository,
        private invReceivingPslRepo: InvReceivingPslRepository,
        @Inject(forwardRef(() => OpReportingHelperService)) private opRepHelperService: OpReportingHelperService
    ) {
        
    }

    // Called from INVS after the issuance of an allocation.
    async createInvIssuanceRef(req: PTS_C_InvIssuanceRefCreateRequest): Promise<GlobalResponseObject> {
        const { companyCode, unitCode, username, allocationId, issuedOn, toProcType } = req;
        const invRec = await this.invReceivingRepo.findOne({select: ['id', 'allocationReversed'], where: { companyCode, unitCode, extAllocationId: allocationId, toProcessType: toProcType }});
        if(invRec) {
            throw new ErrorResponse(0, `Inventory already received for the allocation id ${allocationId}`);
        }
        const invRecEnt = new InvReceivingEntity();
        invRecEnt.companyCode = companyCode;
        invRecEnt.unitCode = unitCode;
        invRecEnt.createdUser = username;
        invRecEnt.extAllocationId = allocationId;
        invRecEnt.allocationReversed = false;
        invRecEnt.processStatus = false;
        invRecEnt.toProcessType = toProcType;
        await this.invReceivingRepo.save(invRecEnt, {reload: false});
        const r1 = new INV_C_InvOutAllocIdRequest(username, unitCode, companyCode, 0, allocationId, issuedOn, null, true);
        // has to be sent to bull job
        await this.updateBundlesReceivedForAnAllocationId(r1);
        return new GlobalResponseObject(true, 0, `Inventory received for the allocation id : ${req.allocationId}`);
    }

    // ENDPOINT
    // Updates the bundles receiving status for the allocation id from the inventory system
    async updateBundlesReceivedForAnAllocationId(req: INV_C_InvOutAllocIdRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            const { companyCode, unitCode, username, allocationId } = req;
            if(!allocationId) {
                throw new ErrorResponse(0, `Allocation ID was not provided`);
            }
            // check if the allocation is already received 
            const allocRec = await this.invReceivingRepo.findOne({select: ['id', 'processStatus'], where: {companyCode: companyCode, unitCode: unitCode, extAllocationId: allocationId }});
            if(!allocRec) {
                throw new ErrorResponse(0, `Inventory ref was not received for the allocation id : ${allocationId}`);
            }
            if(allocRec.processStatus) {
                throw new ErrorResponse(0, `Inventory ref was already processed for the allocation id : ${allocationId}`);
            }
            const m1 = new INV_C_InvOutAllocIdRequest(username, unitCode, companyCode, 0, allocationId, null, null, true);
            const issuedBundlesInfo = await this.invRecHelperService.getBundlesIssuedForAnAllocationIdFromInvSystem(m1);
            console.log(issuedBundlesInfo);
            const bunMinIssuedQtyMap = new Map<string, {minIssQty: number, pslId: number }>();
            const pslIdFgsMap = new Map<number, number[]>();
            let randomPslId = 0;
            // first we have to construct the min issued qty from each process type for a bundle
            issuedBundlesInfo.bundles.forEach(b => {
                const preQty = bunMinIssuedQtyMap.get(b.bunBarcode)?.minIssQty ?? 99999;
                bunMinIssuedQtyMap.set(b.bunBarcode, { minIssQty: Math.min(b.iQty, preQty), pslId: b.pslId });
                randomPslId = b.pslId;
            });
            console.log(bunMinIssuedQtyMap);
            console.log('1');
            let allFgs = [];
            // iterate the bundles and update the fg op dep to issued
            for(const [bunBarcode, prop] of bunMinIssuedQtyMap) {
                // ************************************************* NOTE ************************************
                // Here we have to take only the issued quantity related FGs. i.e it could be also less than bundle quantity based on the rejections in a bundle. 
                // If this is based on FG level tracking and rejection, then this doesn't work and has to be changed by tight coupling with FG number and fetching only GOOD Fgs from the previous operation
                // Also , if there are 2 previous process types , we will the same bundle twice (1 for each process type). But the quantity the next process type will receive is the MIN(proc1, proc2, ..) for the bundle 
                // const fgsForBundle = await this.fgBunRepo.find({ select : ['fgNumber'], where: { oslId: prop.pslId, bundleBarcode: bunBarcode, procType: issuedBundlesInfo.toProcType }, order: {fgNumber: 'ASC'}, take: prop.minIssQty });
                // const fgNumbs = fgsForBundle.map(r => r.fgNumber);
                const fgNumbs = await this.fgBunRepo.getFgNumbersForProcTypeBundleNumberAndPslId(issuedBundlesInfo.toProcType, bunBarcode, prop.pslId, companyCode, unitCode, true);
                if(fgNumbs.length < prop.minIssQty) {
                    throw new ErrorResponse(0, `Only ${fgNumbs.length} FGs were found for the bundle. Issued min quantity of pre process types for a bundle is ${prop.minIssQty} `);
                }
                const preFgs = pslIdFgsMap.get(prop.pslId) ?? [];
                pslIdFgsMap.set(prop.pslId, [...preFgs, ...fgNumbs]);
                allFgs = [...allFgs, ...fgNumbs];
            }
            console.log(pslIdFgsMap);
            if(allFgs.length == 0) {
                throw new ErrorResponse(0, `Error while during the issuance to PTS. No FGs can be found in PTS for the incoming bundles from the inventory`);
            }
            const rgOpgRecs = await this.getAllProcTypesUnderRgForProcTypeAndPslId(randomPslId, issuedBundlesInfo.toProcType, companyCode, unitCode);
            const toProcessTypes = this.ALLOCATE_INV_ONLY_FOR_CURR_PROC_TYPE ? [issuedBundlesInfo.toProcType] : rgOpgRecs.map(r => r.procType);
            // now get the routing group of the "target process type" which we are issuing the bundles to
            await transManager.startTransaction();
            for(const [pslId, fgNums] of pslIdFgsMap) {
                await transManager.getRepository(FgOpDepEntity).update({oslId: pslId, fgNumber: In(fgNums), procType: In(toProcessTypes)}, {rFromInv: true});

                const invPslEnt = new InvReceivingPslEntity();
                invPslEnt.extAllocationId = allocationId;
                invPslEnt.pslId = pslId;
                invPslEnt.invMappedFgs = fgNums.toString();
                await transManager.getRepository(InvReceivingPslEntity).save(invPslEnt, {reload: false});
            }
            await transManager.getRepository(InvReceivingEntity).update({companyCode, unitCode, extAllocationId: allocationId}, {processStatus: true });
            await transManager.completeTransaction();
            return new GlobalResponseObject(true, 0, `Inventory received for the allocation id : ${req.allocationId}`);
        } catch (error) {
            throw error;
        }
    }

    async getAllProcTypesUnderRgForProcTypeAndPslId(randomPslId: number, procType: ProcessTypeEnum, companyCode: string, unitCode: string): Promise<OpSequenceOpgEntity[]> {
        const oslProps = await this.opRepHelperService.getPslPropsForPslId(randomPslId, companyCode, unitCode);
        const opgRecs = await this.opRepHelperService.getOpGroupRecsForMoProdColor(companyCode, unitCode, oslProps.moNo, oslProps.productCode, oslProps.color, [procType]);
        const routingGroup = opgRecs[0]?.routingGroup;
        if(!routingGroup) {
            throw new ErrorResponse(0, `Issuance problem in PTS. No routing groups found for the criteria.. random psl: ${randomPslId} , mo : ${oslProps.moNo}, product code : ${oslProps.productCode}`);
        }
        const rgOpgRecs = await this.opRepHelperService.getOpGroupRecsForMoProdColorAndRg(companyCode, unitCode, oslProps.moNo, oslProps.productCode, oslProps.color, routingGroup);
        return rgOpgRecs;
    }

    // ENDPOINT
    // Used for reversing an issuance in PTS
    async reverseBundlesReceivedForAnAllocationId(req: INV_C_InvOutAllocIdRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            const { companyCode, unitCode, username, allocationId } = req;
            // check if the allocation is already received 
            const allocRec = await this.invReceivingRepo.findOne({select: ['id', 'processStatus', 'toProcessType'], where: {companyCode: companyCode, unitCode: unitCode, extAllocationId: allocationId }});
            if(!allocRec) {
                throw new ErrorResponse(0, `Inventory not yet received for the allocation id ${allocationId}`);
            }
            if(!allocRec.processStatus) {
                throw new ErrorResponse(0, `Inventory received but still not mapped to the Fg Op Dep, allocation : ${allocationId}`);
            }
            // get the psl wise FGs from the inv receiving psl
            const invRecPslRecs = await this.invReceivingPslRepo.find({select: ['invMappedFgs', 'pslId'], where: { extAllocationId: allocationId }});
            const randomPslId = invRecPslRecs[0].pslId;
            const rgOpgRecs = await this.getAllProcTypesUnderRgForProcTypeAndPslId(randomPslId, allocRec.toProcessType, companyCode, unitCode);
            const toProcessTypes =  this.ALLOCATE_INV_ONLY_FOR_CURR_PROC_TYPE ? [allocRec.toProcessType] : rgOpgRecs.map(r => r.procType);
            await transManager.startTransaction();
            for(const rec of invRecPslRecs) {
                const fgs = rec.invMappedFgs.split(',');
                // Here we update the inv received only for the immediate process type. for the next process types in the sequence
                await transManager.getRepository(FgOpDepEntity).update({ oslId: rec.pslId, fgNumber: In(fgs), procType: In(toProcessTypes)}, {rFromInv: false});
            }
            await transManager.getRepository(InvReceivingEntity).update({companyCode: companyCode, unitCode: unitCode, extAllocationId: allocationId}, {allocationReversed: true, updatedUser: username});
            await transManager.completeTransaction();
            return new GlobalResponseObject(true, 0, `Inventory reversed for the allocation id : ${req.allocationId}`);
        } catch (error) {
            throw error;
        }
    }
}





