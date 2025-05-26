import { Injectable } from "@nestjs/common";
import { ErrorResponse } from "@xpparel/backend-utils";
import { BundlesBarcodeResponse, GlobalResponseObject, INV_C_InvCheckForProcTypeAndBundlesRequest, INV_C_InvOutAllocExtRefIdRequest, INV_C_InvOutAllocIdRequest, INV_C_InvOutExtRefIdToGetAllocationsRequest, INV_R_InvCheckForBundlesModel, INV_R_InvCheckForProcTypeBundlesModel, INV_R_InvCheckForProcTypeBundlesResponse, INV_R_InvOutAllocationBundleModel, INV_R_InvOutAllocationInfoAndBundlesModel, INV_R_InvOutAllocationInfoAndBundlesResponse, KC_KnitJobBarcodeFeatureModel, KC_KnitJobBarcodeModel, ProcessTypeEnum, INV_C_PslIdsRequest } from "@xpparel/shared-models";
import { DataSource, In } from "typeorm";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { BundleConsumptionStatusEnum, InvInRequestBundleEntity } from "../entity/inv.in.request.bundle.entity";
import { InvOutAllocBundleEntity } from "../entity/inv.out.alloc.bundle.entity";
import { InvOutAllocEntity } from "../entity/inv.out.alloc.entity";
import { InvOutRequestAllocationStatusEnum, InvOutRequestIssuanceStatusEnum } from "../entity/inv.out.req.entity";
import { InvOutRequestActivityEntity } from "../entity/inv.out.request.activity.entity";
import { InvInRequestBundleRepository } from "../entity/repository/inv-in-request-bundle.repository";
import { InvInRequestItemRepository } from "../entity/repository/inv-in-request-item.repository";
import { InvInRequestRepository } from "../entity/repository/inv-in-request.repository";
import { InvOutAllocBundleRepository } from "../entity/repository/inv-out-alloc-bundle.repository";
import { InvOutAllocRepository } from "../entity/repository/inv-out-alloc.repository";
import { InvOutRequestBundleRepository } from "../entity/repository/inv-out-request-barcode.repository";
import { InvOutRequestItemRepository } from "../entity/repository/inv-out-request-item.repository";
import { InvOutRequestRepository } from "../entity/repository/inv-out-request.repository";
import { PslInfoRepository } from "../entity/repository/psl-info.repository";
import { InvIssuanceHelperService } from "./inv-issuance-helper.service";

@Injectable()
export class InvIssuanceService {

    constructor(
        private dataSource: DataSource,
        private outHelperService: InvIssuanceHelperService,
        private invInReqRepo: InvInRequestRepository,
        private invInReqLine: InvInRequestItemRepository,
        private invInReqBarcode: InvInRequestBundleRepository,
        private invOutReqRepo: InvOutRequestRepository,
        private invOutReqLine: InvOutRequestItemRepository,
        private invOutReqBarcode: InvOutRequestBundleRepository,
        private invOutAllocRepo: InvOutAllocRepository,
        private invOutAllocBarcode: InvOutAllocBundleRepository,
        private invIssHelperService: InvIssuanceHelperService,
        private pslInfoRepository:PslInfoRepository,
    ) {
        
    }

    /**
     * 
     * Inv out request will be only created against a job only.
     * We will get the bundles associated with the job from the KNIT / SPS and we will create the inv out request items
     * Once we try to allocate the inventory for a job, currently we will check whether the same bundle has came into inventory for the previous process type. If all the bundles are available, then we will issue the bundles.
     * NOTE: We don't follow WIP process for now. i.e the same bundle is tightly coupled for all processing types until the next bundling operation
     * 
     */

    // End Point
    // Called from SPS Trims Dashboard UI
    async allocateInventoryForInvOutRequest(req: INV_C_InvOutAllocExtRefIdRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try  {
            const {companyCode, unitCode, username, extReqId, processType, allocateWithBalances, allocatingDate } = req; 
            const invOutReq = await this.invOutReqRepo.findOne({select: ['id'], where: { companyCode: companyCode, unitCode: unitCode, refId: extReqId, processType: processType }});
            if(!invOutReq) {
                throw new ErrorResponse(0, `Inventory out request not found for the ext ref id : ${extReqId} and process type : ${processType}`);
            }
            // check if there is already an allocation for the inv out request.
            const allocations = await this.invOutAllocRepo.findOne({select: ['id'], where: { companyCode: companyCode, unitCode: unitCode, invOutRequestId: invOutReq.id }});
            if(allocations) {
                throw new ErrorResponse(0, `Allocation is already done for the ext ref id : ${extReqId} and process type : ${processType}`);
            }
            const fromProcTypes = new Set<ProcessTypeEnum>();
            const toProcTypes = new Set<ProcessTypeEnum>();
            const procTypeWiseAllocatedBundles = new Map<string, {aBrcd: string, pBrcd: string, issQty: number, pslId: number, orgQty: number, reqQty: number, itemSku: string}[]>();
            const reqItems = await this.invOutReqLine.find({ select: ['id', 'itemSku', 'depProcType', 'processType'], where: { companyCode: companyCode, unitCode: unitCode, invOutRequestId: invOutReq.id }});
            for(const item of reqItems) {
                const preProcType = item.depProcType;
                fromProcTypes.add(preProcType);
                toProcTypes.add(item.processType);
                const itemSku = item.itemSku;
                if(!procTypeWiseAllocatedBundles.has(preProcType)) {
                    procTypeWiseAllocatedBundles.set(preProcType, []);
                }
                // get the bundles and check if the inventory exist
                const bundlesRequested = await this.invOutReqBarcode.find({ select: ['bundleBarcode', 'pslId', 'reqQty', 'orgQty'], where: {companyCode: companyCode, unitCode: unitCode, invOutRequestId: invOutReq.id, invOutRequestItemId: item.id, itemSku: itemSku }});
                const bunBarcodes = bundlesRequested.map(r => r.bundleBarcode);

                // now check if all the requested bundles are present in the previous proc type
                const bundlesInInventory = await this.invInReqBarcode.find({select: ['bundleBarcode', 'inQty'], where: { processType: preProcType, bundleBarcode: In(bunBarcodes), companyCode: companyCode, unitCode: unitCode, itemSku: itemSku }});
                const inInvBunMap = new Map<string, InvInRequestBundleEntity>(); // map of bundle => avl qty in inventory
                bundlesInInventory.forEach(r => { inInvBunMap.set(r.bundleBarcode, r)});

                // iterate the required bundles and check if all bundles are present in the pre proc type
                bundlesRequested.forEach(b => {
                    const invBunInfo = inInvBunMap.get(b.bundleBarcode);
                    const balToFulFill = invBunInfo ? b.reqQty - invBunInfo.inQty : 0;
                    if(!invBunInfo || balToFulFill) {
                        if(!allocateWithBalances) {
                            throw new ErrorResponse(0, `Bundle : ${b.bundleBarcode} required qty is ${b.reqQty}. But available from previous process type ${preProcType} is only ${balToFulFill}`);
                        }
                    }
                    // now this bundle can be allocated
                    procTypeWiseAllocatedBundles.get(preProcType).push({aBrcd: b.bundleBarcode, pBrcd: b.bundleBarcode, orgQty: b.orgQty, reqQty: b.reqQty, issQty: invBunInfo.inQty, pslId: b.pslId, itemSku: itemSku});
                });
            }
            // now save the allocation record
            const invOutReqAllocEnt = new InvOutAllocEntity();
            invOutReqAllocEnt.companyCode = companyCode;
            invOutReqAllocEnt.unitCode = unitCode;
            invOutReqAllocEnt.createdUser = username;
            invOutReqAllocEnt.allocatedBy = username;
            invOutReqAllocEnt.forcedAllocation = allocateWithBalances;
            invOutReqAllocEnt.invOutRequestId = invOutReq.id;
            invOutReqAllocEnt.allocatedDate = allocatingDate;
            invOutReqAllocEnt.fromProcTypes = [...fromProcTypes]?.toString();
            invOutReqAllocEnt.toProcType =  [...toProcTypes][0];
            invOutReqAllocEnt.issuanceStatus = InvOutRequestIssuanceStatusEnum.OPEN;

            const allocBunEnts: InvOutAllocBundleEntity[] = [];
            await transManager.startTransaction();
            const savedAllocEnt = await transManager.getRepository(InvOutAllocEntity).save(invOutReqAllocEnt);
            procTypeWiseAllocatedBundles.forEach(preProcBundles => {
                preProcBundles.forEach(b => {
                    const bunEnt = new InvOutAllocBundleEntity();
                    bunEnt.companyCode = companyCode;
                    bunEnt.unitCode = unitCode;
                    bunEnt.createdUser = username;
                    bunEnt.invOutAllocId = savedAllocEnt.id;
                    bunEnt.invOutRequestId = invOutReq.id;
                    bunEnt.orgQty = b.orgQty;
                    bunEnt.reqQty = b.reqQty;
                    bunEnt.issQty = b.issQty;
                    bunEnt.orgQty = b.orgQty;
                    bunEnt.pslId = b.pslId;
                    bunEnt.bundleBarcode = b.pBrcd;
                    bunEnt.itemSku = b.itemSku;
                    allocBunEnts.push(bunEnt);
                });
            });
            await transManager.getRepository(InvOutAllocBundleEntity).save(allocBunEnts, {reload: false});

            const iorActivityEnt = new InvOutRequestActivityEntity();
            iorActivityEnt.companyCode = companyCode;
            iorActivityEnt.unitCode = unitCode;
            iorActivityEnt.createdUser = username;
            iorActivityEnt.invOutRequestId = invOutReq.id;
            iorActivityEnt.allocationStatus = InvOutRequestAllocationStatusEnum.ALLOCATED;
            await transManager.getRepository(InvOutRequestActivityEntity).save(iorActivityEnt, {reload: false});

            await transManager.completeTransaction();
            // send an API call to SPS saying the allocation has been done
            await this.outHelperService.updateAllocationStatusToSps(savedAllocEnt.id, extReqId, companyCode, unitCode);
            return new GlobalResponseObject(true, 0, `Inventory out request allocated for ext ref id  : ${extReqId} and process type : ${processType}`);
        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }
    }

    // End Point
    // End point. Called from SPS trims dashboard to issue the allocated trims.
    async issueInvOutAllocation(req: INV_C_InvOutAllocIdRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            const {companyCode, unitCode, username, issuedBy, issuedDate, allocationId } = req;
            if(!allocationId) {
                throw new ErrorResponse(0, `Allocation ID not provided`);
            }
            const allocation = await this.invOutAllocRepo.findOne({select: ['id', 'invOutRequestId', 'issuanceStatus', 'issuedDate', 'fromProcTypes', 'toProcType'], where: { companyCode: companyCode, unitCode: unitCode, id: allocationId }});
            if(!allocation) {
                throw new ErrorResponse(0, `Allocation is not found for the id : ${allocationId}`);
            }
            console.log(allocation);
            if(allocation.issuanceStatus == InvOutRequestIssuanceStatusEnum.ISSUED) {
                throw new ErrorResponse(0, `Allocation is already issued for the id : ${allocationId} on date : ${allocation.issuedDate}`);
            }
            const invOutReq = await this.invOutReqRepo.findOne({select: ['id'], where: { companyCode: companyCode, unitCode: unitCode, id: allocation.invOutRequestId }});
            if(!invOutReq) {
                throw new ErrorResponse(0, `Inventory out request not found for the PK : ${allocation.invOutRequestId}`);
            }

            // Get all the barcodes for the allocation id 
            const abAllocBarcodeRecs = await this.invOutAllocBarcode.find({select: ['bundleBarcode', 'itemSku', 'pslId'], where: { companyCode: companyCode, unitCode: unitCode, invOutAllocId: allocation.id }});

            await transManager.startTransaction();
            await transManager.getRepository(InvOutAllocEntity).update({companyCode: companyCode, unitCode: unitCode, id: allocation.id}, { issuanceStatus: InvOutRequestIssuanceStatusEnum.ISSUED, issuedDate: issuedDate, issuedBy: issuedBy });
            await transManager.getRepository(InvOutAllocBundleEntity).update({companyCode: companyCode, unitCode: unitCode, invOutAllocId: allocation.id}, { issued: true });
            const iorActivityEnt = new InvOutRequestActivityEntity();
            iorActivityEnt.companyCode = companyCode;
            iorActivityEnt.unitCode = unitCode;
            iorActivityEnt.createdUser = username;
            iorActivityEnt.invOutRequestId = allocation.invOutRequestId;
            iorActivityEnt.issuanceStatus = InvOutRequestIssuanceStatusEnum.ISSUED;
            await transManager.getRepository(InvOutRequestActivityEntity).save(iorActivityEnt, {reload: false});

            const fromProcTypes: ProcessTypeEnum[] = allocation.fromProcTypes.split(',')?.map((r: ProcessTypeEnum) => r);
            for(const b of abAllocBarcodeRecs) {
                await transManager.getRepository(InvInRequestBundleEntity).update({ companyCode, unitCode, processType: In(fromProcTypes), bundleBarcode: b.bundleBarcode, itemSku: b.itemSku, pslId: b.pslId  }, {bundleState: BundleConsumptionStatusEnum.ISSUED});
            }
            
            await transManager.completeTransaction();

            // YOU ONLY HAVE TO SEND THE ALLOCATION ID
            // call the PTS API and SPS API to update the issued qtys against to the bundles
            await this.outHelperService.updateIssuanceStatusToSps(invOutReq.refId, allocation.id, issuedDate, issuedBy, companyCode, unitCode, username);
            await this.outHelperService.updateIssuanceStatusToPts(invOutReq.refId, allocation.id, issuedDate, issuedBy, fromProcTypes, allocation.toProcType, companyCode, unitCode, username);
            return new GlobalResponseObject(true, 0, `Inventory allocation is successfully issued for allocation id : ${allocationId}`);
        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }
    }

    // End Point
    // End point. Called from SPS trims/IPS UI to check whether the inventory is available for the given bundles and the pre processing types
    async getInventoryForGivenBundlesAndProcessTypes(req: INV_C_InvCheckForProcTypeAndBundlesRequest): Promise<INV_R_InvCheckForProcTypeBundlesResponse> {
        const {companyCode, unitCode, username, procTypeBundles } = req;
        // for every proc type, check if the bundles are avl in the inventory
        const procWiseBundlesModels: INV_R_InvCheckForProcTypeBundlesModel[] = [];
        for(const r of procTypeBundles) {
            const procType = r.processType;
            const bundles = r.bundles;
            const bunBarcodes = bundles.map(b => b.bunBarcode);

            const bundlesInInventory = await this.invInReqBarcode.find({select: ['bundleBarcode', 'inQty', 'orgQty', 'pslId'], where: { processType: procType, bundleBarcode: In(bunBarcodes), companyCode: companyCode, unitCode: unitCode, itemSku: r.itemSku }});
            const bundlesALreadyAllocated = await this.invOutAllocBarcode.find({select: ['bundleBarcode', 'reqQty', 'issQty'], where: { companyCode, unitCode, bundleBarcode: In(bunBarcodes), itemSku: r.itemSku}});

            const invConsMap = new Map<string, InvOutAllocBundleEntity>();
            const inInvBunMap = new Map<string, InvInRequestBundleEntity>(); // map of bundle => avl qty in inventory
            bundlesInInventory.forEach(r => { inInvBunMap.set(r.bundleBarcode, r)});
            bundlesALreadyAllocated.forEach(r => { invConsMap.set(r.bundleBarcode, r)});
            const bunModels: INV_R_InvCheckForBundlesModel[] = [];
            // now iterate all the incoming bundles and construct the avl qty for the bundle
            bundles.forEach(b => {
                const invBunInfo = inInvBunMap?.get(b.bunBarcode);
                const allocatedInfo = invConsMap?.get(b.bunBarcode);
                const avlQty = Number(invBunInfo?.inQty ?? 0) - Number(allocatedInfo?.reqQty ?? 0);
                const bunModel = new INV_R_InvCheckForBundlesModel(b.bunBarcode, b.rQty, avlQty ?? 0, Number(invBunInfo?.pslId ?? 0));
                bunModels.push(bunModel);
            });
            const procWiseBundlesModel = new INV_R_InvCheckForProcTypeBundlesModel(procType, bunModels);
            procWiseBundlesModels.push(procWiseBundlesModel);
        }
        return new INV_R_InvCheckForProcTypeBundlesResponse(true, 0, 'Inv for the given bundles retrieved', procWiseBundlesModels);
    }

    // End Point
    // called from SPS / PTS to get the allocated / issued inventories against to a allocation id
    async getAllocatedInventoryForAllocationId(req: INV_C_InvOutAllocIdRequest ): Promise<INV_R_InvOutAllocationInfoAndBundlesResponse> {
        const {companyCode, unitCode, username, issuedBy, issuedDate, allocationId } = req; 
        const allocation = await this.invOutAllocRepo.findOne({ where: { companyCode: companyCode, unitCode: unitCode, id: allocationId }});
        if(!allocation) {
            throw new ErrorResponse(0, `Allocation is not found for the id : ${allocationId}`);
        }
        if(allocation.issuanceStatus != InvOutRequestIssuanceStatusEnum.ISSUED) {
            throw new ErrorResponse(0, `Allocation is not yet issued for the id : ${allocationId}`);
        }
        // get the req out record
        const outReqRecord = await this.invOutReqRepo.findOne({select: ['refId'], where: { companyCode, unitCode, id: allocation.invOutRequestId }});
        if(!outReqRecord) {
            throw new ErrorResponse(0, `Out request is not found for the out req id : ${allocation.invOutRequestId}`);
        }
        // get the allocated items
        const allocBundles = await this.invOutAllocBarcode.find({select: ['bundleBarcode', 'orgQty', 'reqQty', 'issQty', 'pslId', 'itemSku', 'issued'], where: { companyCode: companyCode, unitCode: unitCode, invOutAllocId: allocation.id}});
        const allocBundlesModels: INV_R_InvOutAllocationBundleModel[] = [];
        allocBundles.forEach(r => {
            const m1 = new INV_R_InvOutAllocationBundleModel();
            m1.aQty = Number(r.issQty);
            m1.bunBarcode = r.bundleBarcode;
            m1.iQty = Number(r.issQty);
            m1.itemSku = r.itemSku;
            m1.pslId = Number(r.pslId);
            m1.rQty = Number(r.reqQty);
            m1.itemSku = r.itemSku;
            m1.issued = r.issued;
            allocBundlesModels.push(m1);
        });
        const allocModel = new INV_R_InvOutAllocationInfoAndBundlesModel();
        allocModel.allocatedBy = allocation.allocatedBy;
        allocModel.allocatedDate = allocation.allocatedDate;
        allocModel.allocationId = allocation.id;
        allocModel.forcedPartialAllocation = allocation.forcedAllocation;
        allocModel.issued = allocation.issuanceStatus == InvOutRequestIssuanceStatusEnum.ISSUED;
        allocModel.issuedBy = allocation.issuedBy;
        allocModel.issuedDate = allocation.issuedDate;
        allocModel.bundles = allocBundlesModels;
        allocModel.toProcType = allocation.toProcType;
        allocModel.refId = Number(outReqRecord.refId);
        return new INV_R_InvOutAllocationInfoAndBundlesResponse(true, 0, `Allocated bundles retrieved for the allocation id : ${allocationId}`, [allocModel]);
    }

    // End Point
    // called from SPS/ IPS/SPS trims dashboard by giving the request id and this will get the allocations against to the material request id
    async getAllocationsForInvOutRequestRefId(req: INV_C_InvOutExtRefIdToGetAllocationsRequest): Promise<INV_R_InvOutAllocationInfoAndBundlesResponse> {
        const {companyCode, unitCode, username, extReqId, processType } = req; 
        const invOutReq = await this.invOutReqRepo.findOne({select: ['id'], where: { companyCode: companyCode, unitCode: unitCode, refId: extReqId, processType: processType }});
        if(!invOutReq) {
            throw new ErrorResponse(0, `Inventory out request not found for the ext ref id : ${extReqId} and process type : ${processType}`);
        }
        // check if there is already an allocation for the inv out request.
        const allocations = await this.invOutAllocRepo.find({ where: { companyCode: companyCode, unitCode: unitCode, invOutRequestId: invOutReq.id }});
        if(allocations.length == 0) {
            throw new ErrorResponse(0, `Allocation not found for the ext ref id : ${extReqId} and process type : ${processType}`);
        }
        const allocModels: INV_R_InvOutAllocationInfoAndBundlesModel[] = [];
        allocations.forEach(allocation => {
            const allocModel = new INV_R_InvOutAllocationInfoAndBundlesModel();
            allocModel.allocatedBy = allocation.allocatedBy;
            allocModel.allocatedDate = allocation.allocatedDate;
            allocModel.allocationId = allocation.id;
            allocModel.forcedPartialAllocation = allocation.forcedAllocation;
            allocModel.issued = allocation.issuanceStatus == InvOutRequestIssuanceStatusEnum.ISSUED;
            allocModel.issuedBy = allocation.issuedBy;
            allocModel.issuedDate = allocation.issuedDate;
            allocModels.push(allocModel);
        });
        return new INV_R_InvOutAllocationInfoAndBundlesResponse(true, 0, `Allocated bundles retrieved for the ext req id : ${extReqId}`, allocModels);
    }


    // End Point
    // Called from SPS after the allocation is updated on SPS side
    async updateInvAckForAllocationIdSPS(req: INV_C_InvOutAllocIdRequest): Promise<GlobalResponseObject> {
        const {companyCode, unitCode, username, issuedBy, issuedDate, allocationId } = req; 
        const allocation = await this.invOutAllocRepo.findOne({ where: { companyCode: companyCode, unitCode: unitCode, id: allocationId }});
        if(!allocation) {
            throw new ErrorResponse(0, `Allocation is not found for the id : ${allocationId}`);
        }
        await this.invOutAllocRepo.update({companyCode: companyCode, unitCode: unitCode, id: allocationId}, { invSpsAllocAck: true });
        return new GlobalResponseObject(true, 0, ``);
    }

    // End Point
    // Called from SPS after the allocation is updated on SPS side
    async updateInvIssAckForAllocationIdSPS(req: INV_C_InvOutAllocIdRequest): Promise<GlobalResponseObject> {
        const {companyCode, unitCode, username, issuedBy, issuedDate, allocationId } = req; 
        const allocation = await this.invOutAllocRepo.findOne({ where: { companyCode: companyCode, unitCode: unitCode, id: allocationId }});
        if(!allocation) {
            throw new ErrorResponse(0, `Allocation is not found for the id : ${allocationId}`);
        }
        await this.invOutAllocRepo.update({companyCode: companyCode, unitCode: unitCode, id: allocationId}, { invSpsIssAck: true });
        return new GlobalResponseObject(true, 0, ``);
    }

    // End Point
    // Called from PTS after the allocation is updated on SPS side
    async updateInvIssAckForAllocationIdPTS(req: INV_C_InvOutAllocIdRequest): Promise<GlobalResponseObject> {
        const {companyCode, unitCode, username, issuedBy, issuedDate, allocationId } = req; 
        const allocation = await this.invOutAllocRepo.findOne({ where: { companyCode: companyCode, unitCode: unitCode, id: allocationId }});
        if(!allocation) {
            throw new ErrorResponse(0, `Allocation is not found for the id : ${allocationId}`);
        }
        await this.invOutAllocRepo.update({companyCode: companyCode, unitCode: unitCode, id: allocationId}, { invPtsIssAck: true });
        return new GlobalResponseObject(true, 0, ``);
    }

    async getBundlesBarcodeDetails(req: INV_C_PslIdsRequest): Promise<BundlesBarcodeResponse> {
        const data: KC_KnitJobBarcodeModel[] = [];
        const pslInfo = await this.pslInfoRepository.find({where: { pslId: In(req.pslIds) }});
        for (const rec of pslInfo) {
            const features = new KC_KnitJobBarcodeFeatureModel([rec.moNo],[rec.moLineNo],[],[rec.co],'','',[rec.delDate],[],[],[rec.style],[]);
            const model = new KC_KnitJobBarcodeModel('','',rec.color || '',rec.size || '',rec.quantity || 0,'',features,rec.pslId?.toString());
            data.push(model);
        }
        if(data.length>0)
        {
            return new BundlesBarcodeResponse(true, 9865, 'success', data);
        }
        return new BundlesBarcodeResponse(false, 34554, 'No Data Found!', data);
    }
}

