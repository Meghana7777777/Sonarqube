import { GlobalResponseObject, OslRefIdRequest, ManufacturingOrderProductName, SI_MoNumberRequest, ProcessTypeEnum, FixedOpCodeEnum } from "@xpparel/shared-models";
import { OpSequenceOpgRepository } from "../entity/repository/op-sequence-opg.repository";
import { FgRepository } from "../entity/repository/fg.repository";
import { FgOpDepRepository } from "../entity/repository/fg-op-dep.repository";
import { FgCreationHelperService } from "./fg-creation-helper.service";
import { OslInfoEntity } from "../entity/osl-info.entity";
import { OslInfoRepository } from "../entity/repository/osl-info.repository";
import { ErrorResponse } from "@xpparel/backend-utils";
import { FgEntity } from "../entity/fg.entity";
import { FgOpDepEntity } from "../entity/fg-op-dep.entity";
import { In, Not } from "typeorm";
import { MoBundleRepository } from "../entity/repository/mo-bundle.repository";
import { FgBundleRepository } from "../entity/repository/fg-bundle.repository";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import  moment from 'moment';
import { OpSequenceService } from "./op-sequence.service";
import { BundleCreationService } from "./bundle-creation.service";
import { OpSequenceRefRepository } from "../entity/repository/op-sequence-ref.repository";
import { OpSequenceOpsRepository } from "../entity/repository/op-sequence-ops.repository";

@Injectable()
export class FgCreationService {

    constructor(
       private fgRepo: FgRepository,
       private fgOpDepRepo: FgOpDepRepository,
       private fgHelperService: FgCreationHelperService,
       private oslRepo: OslInfoRepository,
       private opSeqOpgRepo: OpSequenceOpgRepository,
       private moBundleRepo: MoBundleRepository,
       private bunFgRepo: FgBundleRepository,
       private opSeqOpsRepo: OpSequenceOpsRepository,
       private opSeqRefRepo: OpSequenceRefRepository,
       @Inject(forwardRef(() => OpSequenceService)) private opSeqInternalService: OpSequenceService,
       @Inject(forwardRef(() => BundleCreationService)) private bunCreationInternalService: BundleCreationService
    ) {
        
    }

    // Called after MO confirmation in OMS
    // Tested
    // ENDPOINT
    // Called after the MO confirmation in OMS
    async createOslRefIdsForMo(req: SI_MoNumberRequest): Promise<GlobalResponseObject> {
        try {
            const { companyCode, unitCode, username, moNumber } = req;
            const oslRecForMo = await this.oslRepo.findOne({select: ['oslId'], where: { companyCode: companyCode, unitCode: unitCode, moNo: req.moNumber}});
            if(oslRecForMo) {
                throw new ErrorResponse(0, `OSLs already created for the MO number : ${req.moNumber}`);
            }
            const lines = await this.fgHelperService.getOslPropsForMoNumber(req.moNumber, companyCode, unitCode);
            const oslEnts: OslInfoEntity[] = [];
            let fgNo = 0;
            lines.forEach(l => {
                l.moLineProducts.forEach(s => {
                    s.subLines.forEach(r => {
                        const oslInfo = r.moProdSubLineAttrs;
                        const oslInfoEnt = new OslInfoEntity();
                        oslInfoEnt.createdUser = username;
                        oslInfoEnt.buyerPo = oslInfo.buyerPo;
                        oslInfoEnt.co = oslInfo.co;
                        oslInfoEnt.color = r.color;
                        oslInfoEnt.companyCode = req.companyCode;
                        oslInfoEnt.unitCode = req.unitCode;
                        oslInfoEnt.delDate = moment(oslInfo.delDate).format('YYYY-MM-DD');
                        oslInfoEnt.destination = oslInfo.destination;
                        oslInfoEnt.refNumber = oslInfo.refNo;
                        oslInfoEnt.oqType = r.oqType;
                        oslInfoEnt.oslId = r.pk;
                        oslInfoEnt.pcd = oslInfo.pcd;
                        oslInfoEnt.productName = oslInfo.prodName;
                        oslInfoEnt.productCode = oslInfo.prodName;
                        oslInfoEnt.size = r.size;
                        oslInfoEnt.moLineNo = l.moLineNo;
                        oslInfoEnt.moNo = moNumber;
                        oslInfoEnt.style = oslInfo.style;
                        oslInfoEnt.vpo = oslInfo.vpo;
                        oslInfoEnt.quantity = oslInfo.qty;
                        oslInfoEnt.fgStartNo = fgNo+1;
                        fgNo += Number(oslInfo.qty);
                        oslInfoEnt.fgEndNo = fgNo;
                        oslEnts.push(oslInfoEnt);
                    });
                });
            });
            await this.oslRepo.createQueryBuilder().insert().values(oslEnts).updateEntity(false).execute();
            // trigger the fgs, fg op deps creation, mo bundles. Bull job
            await this.opSeqInternalService.createOpSequence(req);
            await this.triggerCreateFgsForMoNumber(req);
            await this.triggerCreateFgOpDepForForMoNumber(req);
            await this.bunCreationInternalService.triggerCreateBundlesForMo(req);
            return new GlobalResponseObject(true, 0, 'OSL info for the saved successfully');
        } catch (error) {
            throw error;
        }
    }

    // Called after MO de confirmation in OMS
    // Tested
    // ENDPOINT
    // called after the MO deletion in OMS
    async deleteOslRefIdsForMo(req: SI_MoNumberRequest): Promise<GlobalResponseObject> {
        try {
            const { companyCode, unitCode, username } = req;
            if(!req.moNumber) {
                throw new ErrorResponse(0, 'Mo number is not provided');
            }
            const oslInfoRecs = await this.oslRepo.find({select: ['id', 'oslId'], where: { companyCode: companyCode, unitCode: unitCode, moNo: req.moNumber }});
            if(oslInfoRecs.length == 0) {
                throw new ErrorResponse(0, `No osl refs found for the MO : ${req.moNumber}`);
            }
            const pslIds = oslInfoRecs.map(r => r.oslId);
            // pre validations to be in place
            await this.oslRepo.delete({ companyCode: companyCode, unitCode: unitCode, moNo: req.moNumber });
            // delete all the other tables as well
            await this.fgRepo.delete({ oslId: In(pslIds) });
            // await this.fgOpRepo.delete({ companyCode: companyCode, unitCode: unitCode, oslId: In(pslIds) });
            await this.fgOpDepRepo.delete({ oslId: In(pslIds) });
            await this.moBundleRepo.delete({ companyCode: companyCode, unitCode: unitCode, oslId: In(pslIds) });
            await this.opSeqOpgRepo.delete({companyCode, unitCode, moNo: req.moNumber});
            await this.opSeqOpsRepo.delete({companyCode, unitCode, moNo: req.moNumber});
            await this.opSeqRefRepo.delete({companyCode, unitCode, moNo: req.moNumber});
            await this.bunFgRepo.delete({ oslId: In(pslIds) });
            return new GlobalResponseObject(true, 0, 'OSL info deleted for the MO');
        } catch (error) {
            throw error;
        }
    }

    // TESTED
    // Called after MO confirmation in OMS
    // ENDPOINT
    // After mo related osl info is persisted, we have to call this function. This will again call individual FG creation for an OSL id
    async triggerCreateFgsForMoNumber(req: SI_MoNumberRequest, isDelete?: boolean): Promise<GlobalResponseObject> {
        const { companyCode, unitCode, moNumber } = req;
        if(!moNumber) {
            throw new ErrorResponse(0, `Mo number is not provided in the request`);
        }
        const fgPendingOslRefs = await this.oslRepo.find({select: ['oslId', 'refNumber', 'companyCode', 'unitCode'], where: { companyCode: companyCode, unitCode: unitCode, fgCreated: false, moNo: moNumber }});
        if(fgPendingOslRefs.length == 0){
            throw new ErrorResponse(0, `No pending PSLs found to create the FGs for the MO Number : ${moNumber}`);
        }
        for(const rec of fgPendingOslRefs) {
            const oslReq = new OslRefIdRequest(req.username, rec.unitCode, rec.companyCode, 0, [rec.oslId]);
            this.createFgsForOslRefId(oslReq);
        }
        return new GlobalResponseObject(true, 0, `FG mapping triggered for Mo : ${moNumber}`);
    }

    // ENDPOINT
    // After mo related osl info is persisted, we have to call this function. This will again call individual FG creation for an OSL id
    // async triggerCreateFgsOpsForMoNumber(req: SI_MoNumberRequest, isDelete?: boolean): Promise<GlobalResponseObject> {
    //     const { companyCode, unitCode, moNumber } = req;
    //     const fgPendingOslRefs = await this.oslRepo.find({select: ['oslId', 'refNumber', 'companyCode', 'unitCode'], where: { companyCode: companyCode, unitCode: unitCode, fgOpsCreated: false, moNo: moNumber }});
    //     for(const rec of fgPendingOslRefs) {
    //         const oslReq = new OslRefIdRequest(req.username, rec.unitCode, rec.companyCode, 0, [rec.oslId]);
    //         this.createFgOpsForOslRefId(oslReq);
    //     }
    //     return new GlobalResponseObject(true, 0, `FG Op mapping triggered for Mo : ${moNumber}`);
    // }

    // ENDPOINT
    // After mo related osl info is persisted, we have to call this function. This will again call individual FG creation for an OSL id
    async triggerCreateFgOpDepForForMoNumber(req: SI_MoNumberRequest, isDelete?: boolean): Promise<GlobalResponseObject> {
        const { companyCode, unitCode, moNumber } = req;
        const fgPendingOslRefs = await this.oslRepo.find({select: ['oslId', 'refNumber', 'companyCode', 'unitCode'], where: { companyCode: companyCode, unitCode: unitCode, fgDepCreated: false, moNo: moNumber }});
        if(fgPendingOslRefs.length == 0){
            throw new ErrorResponse(0, `No pending PSLs found to create the FG OP DEP for the MO Number : ${moNumber}`);
        }
        for(const rec of fgPendingOslRefs) {
            const oslReq = new OslRefIdRequest(req.username, rec.unitCode, rec.companyCode, 0, [rec.oslId]);
            await this.createFgOpDepForOslRefId(oslReq);
        }
        return new GlobalResponseObject(true, 0, `FG Op dep mapping triggered for Mo : ${moNumber}`);
    }
    
    // TESTED
    // ENDPOINT
    // create the FGs for the osl ref ids
    async createFgsForOslRefId(req: OslRefIdRequest): Promise<GlobalResponseObject> {
        const { companyCode, unitCode, username } = req;
        const oslId = req.oslRefId[0];
        const oslRec = await this.oslRepo.findOne({select: ['moLineNo', 'moNo', 'color', 'productCode', 'fgStartNo', 'fgEndNo', 'oqType'], where: { companyCode: companyCode, unitCode: unitCode, oslId: oslId, fgCreated: false } });
        if(!oslRec) {
            throw new ErrorResponse(0, `OSL record not found for the osl id : ${req.oslRefId}`);
        }
        let fgStartNo = oslRec.fgStartNo;
        const fgEndNo = oslRec.fgEndNo;
        const fgEnts: FgEntity[] = [];
        while(fgStartNo <= fgEndNo) {
            const fgEnt = new FgEntity();
            fgEnt.fgNumber = fgStartNo;
            fgEnt.oslId = oslId;
            fgEnt.oqType = oslRec.oqType;
            fgEnts.push(fgEnt);
            fgStartNo++;
        }
        // await this.fgRepo.createQueryBuilder().insert().values(fgEnts).updateEntity(false).execute();
        await this.fgRepo.save(fgEnts, {reload: false});
        await this.oslRepo.update({companyCode: companyCode, unitCode: unitCode, oslId: oslId}, { fgCreated: true });
        return new GlobalResponseObject(true, 0, `FGs created for the osl id : ${oslId}. Total Created : `);
    }

    // NOT USED. TO BE REMOVED
    // ENDPOINT
    // create the FGs OPs for the osl ref ids
    // async createFgOpsForOslRefId(req: OslRefIdRequest): Promise<GlobalResponseObject> {
    //     const { companyCode, unitCode, username } = req;
    //     const oslId = req.oslRefId[0];
    //     const oslRec = await this.oslRepo.findOne({select: ['moLineNo', 'moNo', 'color', 'productCode', 'fgStartNo', 'fgEndNo'], where: { companyCode: companyCode, unitCode: unitCode, oslId: oslId, fgOpsCreated: false } });
    //     if(!oslRec) {
    //         throw new ErrorResponse(0, `OSL record not found for the osl id : ${req.oslRefId}`);
    //     }
    //     // const ops = await this.opSeqOpgRepo.find({ where: {companyCode: companyCode, unitCode: unitCode, moNo: oslRec.moNo, prodCode: oslRec.productCode, fgColor: oslRec.color }});
    //     const ops = await this.opSeqOpgRepo.getOpGroupsLevelRecsForMo(companyCode, unitCode, oslRec.moNo, oslRec.productName, oslRec.color);
    //     // procType: Not(In([ProcessTypeEnum.KNIT]))
    //     if(ops.length == 0) {
    //         throw new ErrorResponse(0, `OSL operations not found for the osl id : ${req.oslRefId}`);
    //     }
    //     // TO DO. Restrict for duplicate creation of FGs if were already created for the osl ref id
    //     let fgStart = oslRec.fgStartNo;
    //     const fgEnd = oslRec.fgEndNo;
    //     const fgOpEnts: FgOpEntity[] = [];
    //     while(fgStart <= fgEnd) {
    //         ops.forEach(op => {
    //             Object.values(FixedOpCodeEnum).forEach(r => {
    //                 const fgOpEnt = new FgOpEntity();
    //                 fgOpEnt.fgNumber = fgStart;
    //                 fgOpEnt.procType = op.proc_type;
    //                 fgOpEnt.opCode = Number(r);
    //                 fgOpEnt.opGroup = op.op_group;
    //                 fgOpEnt.opOrder = 0;
    //                 fgOpEnt.opGroupOrder = op.op_group_order;
    //                 fgOpEnt.oslId = oslId;
    //                 fgOpEnt.companyCode = companyCode;
    //                 fgOpEnt.unitCode = unitCode;
    //                 fgOpEnt.createdUser = username;
    //                 fgOpEnts.push(fgOpEnt);
    //             });
    //         });
    //         fgStart++;
    //     }
    //     await this.fgOpRepo.save(fgOpEnts, {reload: false});
    //     return new GlobalResponseObject(true, 0, `FG Ops created for the osl id : ${oslId}`);
    // }

    // ENDPOINT
    // create the FG OP DEP for the osl ref ids
    // async createFgOpDepForOslRefId(req: OslRefIdRequest): Promise<GlobalResponseObject> {
    //     const { companyCode, unitCode, username } = req;
    //     const oslId = req.oslRefId[0];
    //     const oslRec = await this.oslRepo.findOne({select: ['moLineNo', 'moNo', 'color', 'productCode', 'fgStartNo', 'fgEndNo'], where: { companyCode: companyCode, unitCode: unitCode, oslId: oslId, fgDepCreated: false } });
    //     if(!oslRec) {
    //         throw new ErrorResponse(0, `OSL record not found for the osl id : ${req.oslRefId}`);
    //     }
    //     // const ops = await this.opSeqOpgRepo.find({ where: {companyCode: companyCode, unitCode: unitCode, moNo: oslRec.moNo, prodCode: oslRec.productCode, fgColor: oslRec.color, procType: Not(In([ProcessTypeEnum.KNIT])) }});
    //     const ops = await this.opSeqOpgRepo.getOpGroupsLevelRecsForMo(companyCode, unitCode, oslRec.moNo, oslRec.productName, oslRec.color);
    //     if(ops.length == 0) {
    //         throw new ErrorResponse(0, `OSL operations not found for the osl id : ${req.oslRefId}`);
    //     }
    //     // get the BOM SKUs for the MO
    //     const moBom = await this.opSeqBomRepo.find({select: ['bomSku', 'opGroup'], where: { companyCode: companyCode, unitCode: unitCode, moNo: oslRec.moNo, prodCode: oslRec. productCode, fgColor: oslRec.color }});
    //     const moOpBomMap = new Map<string, string[]>();
    //     moBom.forEach(r => {
    //         if(!moOpBomMap.has(r.opGroup)) {
    //             moOpBomMap.set(r.opGroup, []);
    //         }
    //         moOpBomMap.get(r.opGroup).push(r.bomSku);
    //     });
    //     // TO DO. Restrict for duplicate creation of FGs if were already created for the osl ref id
    //     let fgStart = oslRec.fgStartNo;
    //     const fgEnd = oslRec.fgEndNo;
    //     const ents: FgOpDepEntity[] = [];
    //     while(fgStart <= fgEnd) {
    //         ops.forEach(r => {
    //             const bomSkus = moOpBomMap.get(r.op_group) ?? ['NA'];
    //             bomSkus.forEach(bomSku => {
    //                 for( const opCode of [1, 99]) {
    //                     const ent = new FgOpDepEntity();
    //                     ent.oslId = oslId;
    //                     ent.fgNumber = fgStart;
    //                     ent.procSerial = 0;
    //                     ent.procType = r.proc_type;
    //                     ent.tranId = 0;
    //                     ent.opCode = opCode;
    //                     ent.opGroup = r.op_group;
    //                     ent.bomSku = bomSku;
    //                     ent.companyCode = companyCode;
    //                     ent.unitCode = unitCode;
    //                     ent.createdUser = username;
    //                     ents.push(ent);
    //                 }
    //             });
    //         });
    //         fgStart++;
    //     }
    //     await this.fgOpDepRepo.createQueryBuilder().insert().values(ents).updateEntity(false).execute();
    //     await this.oslRepo.update({companyCode: companyCode, unitCode: unitCode, oslId: oslId}, { fgDepCreated: true });
    //     return new GlobalResponseObject(true, 0, `FG OP Deps created for the osl id : ${oslId}`);
    // }

    async createFgOpDepForOslRefId(req: OslRefIdRequest): Promise<GlobalResponseObject> {
        const { companyCode, unitCode, username } = req;
        const oslId = req.oslRefId[0];
        const oslRec = await this.oslRepo.findOne({select: ['moLineNo', 'moNo', 'color', 'productCode', 'fgStartNo', 'fgEndNo'], where: { companyCode: companyCode, unitCode: unitCode, oslId: oslId, fgDepCreated: false } });
        if(!oslRec) {
            throw new ErrorResponse(0, `OSL record not found for the osl id : ${req.oslRefId}`);
        }
        const opSeqRefId = await this.fgHelperService.getOpSeqRefIdForMoProdColor(companyCode, unitCode, oslRec.moNo, oslRec.productCode, oslRec.color)
        const opGroups = await this.opSeqOpgRepo.find({where: { companyCode: companyCode, unitCode: unitCode, opSeqRefId: opSeqRefId}});
        if(opGroups.length == 0) {
            throw new ErrorResponse(0, `OSL operations not found for the osl id : ${req.oslRefId}`);
        }
        // TO DO. Restrict for duplicate creation of FGs if were already created for the osl ref id
        let fgStart = oslRec.fgStartNo;
        const fgEnd = oslRec.fgEndNo;
        const ents: FgOpDepEntity[] = [];
        while(fgStart <= fgEnd) {
            opGroups.forEach(r => {
                if(![ProcessTypeEnum.KNIT, ProcessTypeEnum.PACK, ProcessTypeEnum.CUT].includes(r.procType)) {
                    for( const opCode of [1, 99]) {
                        const ent = new FgOpDepEntity();
                        ent.oslId = oslId;
                        ent.fgNumber = fgStart;
                        ent.procSerial = 0;
                        ent.procType = r.procType;
                        ent.opCode = opCode;
                        ent.opGroup = r.opGroup;
                        ent.opSeqRefId = opSeqRefId;
                        ents.push(ent);
                    }
                }
            });
            fgStart++;
        }
        await this.fgOpDepRepo.save(ents, {reload: false});
        await this.oslRepo.update({companyCode: companyCode, unitCode: unitCode, oslId: oslId}, { fgDepCreated: true });
        return new GlobalResponseObject(true, 0, `FG OP Deps created for the osl id : ${oslId}`);
    }

}



