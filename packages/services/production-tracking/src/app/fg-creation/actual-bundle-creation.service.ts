import { GlobalResponseObject, OslRefIdRequest, ManufacturingOrderProductName, SI_MoNumberRequest, ProcessTypeEnum, CPS_C_BundlingConfirmationIdRequest, CPS_R_CutOrderConfirmedBundleModel, PoCutBundlingMoveToInvStatusEnum, KMS_C_KnitOrderBundlingConfirmationIdRequest, KMS_R_KnitOrderConfirmedBundleModel, PoKnitBundlingMoveToInvStatusEnum } from "@xpparel/shared-models";
import { FgRepository } from "../entity/repository/fg.repository";
import { FgOpDepRepository } from "../entity/repository/fg-op-dep.repository";
import { FgCreationHelperService } from "./fg-creation-helper.service";
import { OslInfoEntity } from "../entity/osl-info.entity";
import { OslInfoRepository } from "../entity/repository/osl-info.repository";
import { ErrorResponse } from "@xpparel/backend-utils";
import { FgOpDepEntity } from "../entity/fg-op-dep.entity";
import { MoBundleRepository } from "../entity/repository/mo-bundle.repository";
import { DataSource, In } from "typeorm";
import { FgBundleEntity } from "../entity/fg-bundle.entity";
import { FgBundleRepository } from "../entity/repository/fg-bundle.repository";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { Injectable } from "@nestjs/common";
import { MoActualBundleEntity } from "../entity/mo-actual-bundle.entity";
import { MoActualBundleRepository } from "../entity/repository/mo-actual-bundle.repository";
import { MoActualBundleParentRepository } from "../entity/repository/mo-actual-bundle-parent.repository";
import { MoActualBundleParentEntity } from "../entity/mo-actual-bundle-parent.entity";
import { MoActualBundleSProcEntity } from "../entity/mo-actual-bundle-sproc.entity";


@Injectable()
export class ActualBundleCreationService {
    constructor(
        private dataSource: DataSource,
        private fgRepo: FgRepository,
        private fgOpDepRepo: FgOpDepRepository,
        private fgHelperService: FgCreationHelperService,
        private oslRepo: OslInfoRepository,
        private moBundleRepo: MoBundleRepository,
        private moActBundleRepo: MoActualBundleRepository,
        private moActBundleParentRepo: MoActualBundleParentRepository,
        private fgBundleRepo: FgBundleRepository,
    ) {
        
    }

    // Called after the actual bundles generation in the KNIT
    async createActualBundlesForConfirmationIdCut(req: CPS_C_BundlingConfirmationIdRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            const {companyCode, unitCode, username,confirmationId } = req;
            if(!confirmationId) {
                throw new ErrorResponse(0, 'Confirmation id not provided');
            }
            const confRec = await this.moActBundleParentRepo.findOne({select: ['id'], where: {companyCode, unitCode, confirmationId: confirmationId, procType: ProcessTypeEnum.CUT }});
            if(confRec) {
                throw new ErrorResponse(0, `The actual bundles already created for the confirmation id : ${confirmationId}`);
            }
            const cutBundlesInfo = await this.fgHelperService.getCutConfirmedBundlesForConfirmationId(confirmationId, ProcessTypeEnum.CUT, companyCode, unitCode);
            
            const pslIds = new Set<number>();
            cutBundlesInfo.prodWiseBundles.forEach(r => {
                r.bundles.forEach(b => {
                    if(b.qty <= 0) {
                        throw new ErrorResponse(0, `Error: 0 quantity received as bundles quantity for the confirmation id : ${confirmationId} and barcode : ${b.abNumber}`);
                    }
                    pslIds.add(Number(b.pslId));
                });
            });
            if(pslIds.size <= 0) {
                throw new ErrorResponse(0, `No bundles found after receiving response from CPS`);
            }
            const oslProps = await this.oslRepo.find({where: {companyCode, unitCode, oslId: In([...pslIds])}});
            const pslPropsMap = new Map<number, OslInfoEntity>();
            oslProps.forEach(r => { pslPropsMap.set(Number(r.oslId), r);});

            const moWiseBundles = new Map<string, CPS_R_CutOrderConfirmedBundleModel[]>();
            cutBundlesInfo.prodWiseBundles.forEach(r => {
                r.bundles.forEach(b => {
                    const pslProps = pslPropsMap.get(Number(b.pslId));
                    if(!moWiseBundles.has(pslProps.moNo)) {
                        moWiseBundles.set(pslProps.moNo, []);
                    }
                    moWiseBundles.get(pslProps.moNo).push(b);
                });
            });

            const e1 = new MoActualBundleParentEntity();
            e1.companyCode = companyCode;
            e1.unitCode = unitCode;
            e1.createdUser = username;
            e1.procSerial = cutBundlesInfo.procSerial;
            e1.procType = ProcessTypeEnum.CUT;
            e1.confirmationId = confirmationId;

            const bEnts: MoActualBundleEntity[] = [];
            const bSubProcEnts: MoActualBundleSProcEntity[] = [];
            // 1 confirmation can have only 1 product and 1 color. so reading the first one
            const prodColorInfo = cutBundlesInfo.prodWiseBundles[0];
            for(const [mo, bundles] of moWiseBundles) {
                const opSeqRefId = await this.fgHelperService.getOpSeqRefIdForMoProdColor(companyCode, unitCode, mo, prodColorInfo.pCode, prodColorInfo.bundles[0].color);
                const opgRecs = await this.fgHelperService.getOpgInfoForOpSeqRefId(companyCode, unitCode, opSeqRefId);
                const procTypes =  new Set<ProcessTypeEnum>();
                opgRecs.forEach(r => procTypes.add(r.procType));

                for(const p of procTypes) {
                    if([ProcessTypeEnum.CUT, ProcessTypeEnum.PACK, ProcessTypeEnum.KNIT].includes(p)) {
                        continue;
                    }
                    for(const b of bundles) {
                        const b1 = new MoActualBundleEntity();
                        b1.companyCode = companyCode;
                        b1.unitCode = unitCode;
                        b1.createdUser = username;
                        b1.pbBarcode = b.pbNumber;
                        b1.abBarcode = b.abNumber;
                        b1.procSerial = cutBundlesInfo.procSerial;
                        b1.pslId = b.pslId;
                        b1.confirmationId = confirmationId;
                        b1.procType = p;
                        b1.quantity = b.qty;
                        bEnts.push(b1);
                    }
                }

                // DONT REMOVE THIS COMMENTED CODE
                // Ignoring this for now. These bundles to sewing job mapping will be created during the sewing job population
                // const PROC_SUB_PROC_COMBIS = new Set<string>();
                // for(const r of opgRecs) {
                //     // If a sub proc + process type combination is already handled, then skip it. Here we can get multiple records because of op groups
                //     if(PROC_SUB_PROC_COMBIS.has(r.procType+''+r.subProcName)) {
                //         continue;
                //     }
                //     for(const b of bundles) {
                //         const b2 = new MoActualBundleSProcEntity();
                //         b2.abBarcode = b.abNumber;
                //         b2.pslId = b.pslId;
                //         b2.procType = r.procType;
                //         b2.subProc = r.subProcName;
                //         b2.jobNumber = '';
                //         bSubProcEnts.push(b2);
                //     }
                // }
            }
            await transManager.startTransaction();
            await transManager.getRepository(MoActualBundleParentEntity).save(e1, {reload: false});
            await transManager.getRepository(MoActualBundleEntity).save(bEnts, {reload: false});
            // await transManager.getRepository(MoActualBundleSProcEntity).save(bSubProcEnts, {reload: false});
            await transManager.completeTransaction();
            this.mapActualBundlesToFgForAConfirmationIdCut(req);
            await this.fgHelperService.sendAckToCpsSystemForInvReceived(companyCode, unitCode, username, confirmationId, PoCutBundlingMoveToInvStatusEnum.MOVED_TO_INV);
            return new GlobalResponseObject(true, 0, `Actual bundles created successfully for confirmation id : ${confirmationId}`);
        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }
    }

    // This functions maps the FGs for the actual bundles. Will be called after the execution of createActualBundlesForConfirmationIdCut
    async mapActualBundlesToFgForAConfirmationIdCut(req: CPS_C_BundlingConfirmationIdRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try{
            const {companyCode, unitCode, username, confirmationId } = req;
            if(!confirmationId) {
                throw new ErrorResponse(0, 'Confirmation id not provided');
            }
            const confRec = await this.moActBundleParentRepo.findOne({select: ['id'], where: {companyCode, unitCode, confirmationId: confirmationId, procType: ProcessTypeEnum.CUT }});
            if(!confRec) {
                throw new ErrorResponse(0, `The actual bundle confirmation record not found for id : ${confirmationId}`);
            }
            const randomActualBunRec = await this.moActBundleRepo.findOne({select: ['abBarcode', 'pbBarcode', 'quantity', 'pslId', 'procSerial', 'procType'], where: {companyCode, unitCode, confirmationId: confirmationId}});
            if(!randomActualBunRec) {
                throw new ErrorResponse(0, `No actual bundles found in the pts  for confirmation id : ${confirmationId}`)
            }
            
            // Get only bundles for a single process type.
            const abRecs = await this.moActBundleRepo.find({select: ['abBarcode', 'pbBarcode', 'quantity', 'pslId', 'procSerial', 'procType'], where: {companyCode, unitCode, confirmationId: confirmationId, procType: randomActualBunRec.procType}});

            await transManager.startTransaction();
            // NOTE: IMPORTANT TO CONSIDER
            // for now since we are maintaining a single bundle for all process types, so we will iterate only 1 process type and map the same FG to the bundle for the remaining process types
            for(const b of abRecs) {
                // check and skip if the actual bundles already mapped for the FG numbers
                const bunRec = await this.fgBundleRepo.count({ select: ['id'], where: { oslId: b.pslId, abBarcode: b.abBarcode, procType: b.procType } });
                if(bunRec) {
                    continue;
                }
                // get the open FGs which are yet to be mapped
                const fgs = await this.fgBundleRepo.find({select: ['fgNumber', 'oslId'], where: { bundleBarcode: b.pbBarcode, oslId: b.pslId, abBarcode: '', procType: b.procType }});
                if(fgs.length == 0) {
                    throw new ErrorResponse(0, `Unmapped FGs not found for the planned bundle : ${b.pbBarcode} and process type : ${b.procType}`);
                }
                const openFgs = fgs.map(r => Number(r.fgNumber));
                const reqFgs = openFgs.splice(0, Number(b.quantity));
                if(reqFgs.length < b.quantity) {
                    throw new ErrorResponse(0, `Bundle : ${b.abBarcode} has ${b.quantity} quantity. But only ${reqFgs.length} is available for mapping in PTS. MORE INFO : Planned bundle : ${b.pbBarcode} and process type : ${b.procType}`);
                }
                await transManager.getRepository(FgBundleEntity).update({oslId: b.pslId, bundleBarcode: b.pbBarcode, fgNumber: In(reqFgs), }, {abBarcode: b.abBarcode});
            }
            await transManager.getRepository(MoActualBundleParentEntity).update({companyCode, unitCode, confirmationId}, {fgsMapped: true});
            await transManager.completeTransaction();
            return new GlobalResponseObject(true, 0, `Actual bundles mapped to FGs successfully for confirmation id : ${confirmationId}`);
        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }
    }

    // this is called after actual bundling reversal in  CPS
    async deleteActualBundlesForConfirmationIdCut(req: CPS_C_BundlingConfirmationIdRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try{
            const {companyCode, unitCode, username, confirmationId } = req;
            if(!confirmationId) {
                throw new ErrorResponse(0, 'Confirmation id not provided');
            }
            const confRec = await this.moActBundleParentRepo.findOne({select: ['id'], where: {companyCode, unitCode, confirmationId: confirmationId, procType: ProcessTypeEnum.CUT }});
            if(!confRec) {
                throw new ErrorResponse(0, `The actual bundle confirmation record not found for id : ${confirmationId}`);
            }
            const abRecs = await this.moActBundleRepo.find({select: ['abBarcode', 'pslId'], where: {companyCode, unitCode, confirmationId: confirmationId}});
            if(abRecs.length == 0) {
                throw new ErrorResponse(0, `No actual bundles found in the pts  for confirmation id : ${confirmationId}`)
            }
            const abBarcodes = abRecs.map(r => r.abBarcode);
            const pslIdsSet = new Set<number>();
            abRecs.forEach(r => pslIdsSet.add(r.pslId));
            await transManager.startTransaction();
            await transManager.getRepository(MoActualBundleEntity).delete({companyCode, unitCode, confirmationId});
            await transManager.getRepository(MoActualBundleParentEntity).delete({companyCode, unitCode, confirmationId});
            await transManager.getRepository(FgBundleEntity).update({abBarcode: In(abBarcodes), oslId: In([...pslIdsSet]) }, {abBarcode: ''});
            await transManager.completeTransaction();
            await this.fgHelperService.sendAckToCpsSystemForInvReceived(companyCode, unitCode, username, confirmationId, PoCutBundlingMoveToInvStatusEnum.OPEN);
            return new GlobalResponseObject(true, 0, `Actual bundles deleted successfully for confirmation id : ${confirmationId}`);
        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }
    }


    // -------------------------------------------------------KNIT---------------------------------------------------------------


    // Called after the actual bundles generation in the KNIT
    async createActualBundlesForConfirmationIdKnit(req: KMS_C_KnitOrderBundlingConfirmationIdRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            const {companyCode, unitCode, username,confirmationId } = req;
            if(!confirmationId) {
                throw new ErrorResponse(0, 'Confirmation id not provided');
            }
            const confRec = await this.moActBundleParentRepo.findOne({select: ['id'], where: {companyCode, unitCode, confirmationId: confirmationId, procType: ProcessTypeEnum.KNIT }});
            if(confRec) {
                throw new ErrorResponse(0, `The actual bundles already created for the confirmation id : ${confirmationId}`);
            }
            const cutBundlesInfo = await this.fgHelperService.getKnitConfirmedBundlesForConfirmationId(confirmationId, ProcessTypeEnum.KNIT, companyCode, unitCode);
            const pslIds = new Set<number>();
            cutBundlesInfo.prodWiseBundles.forEach(r => {
                r.bundles.forEach(b => {
                    if(b.qty <= 0) {
                        throw new ErrorResponse(0, `Error: 0 quantity received as bundles quantity for the confirmation id : ${confirmationId} and barcode : ${b.abNumber}`);
                    }
                    pslIds.add(Number(b.pslId));
                });
            });
            if(pslIds.size <= 0) {
                throw new ErrorResponse(0, `No bundles found after receiving response from CPS`);
            }
            const oslProps = await this.oslRepo.find({where: {companyCode, unitCode, oslId: In([...pslIds])}});
            const pslPropsMap = new Map<number, OslInfoEntity>();
            oslProps.forEach(r => { pslPropsMap.set(Number(r.oslId), r);});

            const moWiseBundles = new Map<string, KMS_R_KnitOrderConfirmedBundleModel[]>();
            cutBundlesInfo.prodWiseBundles.forEach(r => {
                r.bundles.forEach(b => {
                    const pslProps = pslPropsMap.get(Number(b.pslId));
                    if(!moWiseBundles.has(pslProps.moNo)) {
                        moWiseBundles.set(pslProps.moNo, []);
                    }
                    moWiseBundles.get(pslProps.moNo).push(b);
                });
            });

            const e1 = new MoActualBundleParentEntity();
            e1.companyCode = companyCode;
            e1.unitCode = unitCode;
            e1.createdUser = username;
            e1.procSerial = cutBundlesInfo.procSerial;
            e1.procType = ProcessTypeEnum.KNIT;
            e1.confirmationId = confirmationId;

            const bEnts: MoActualBundleEntity[] = [];
            const bSubProcEnts: MoActualBundleSProcEntity[] = [];
            // 1 confirmation can have only 1 product and 1 color. so reading the first one
            const prodColorInfo = cutBundlesInfo.prodWiseBundles[0];
            for(const [mo, bundles] of moWiseBundles) {
                const opSeqRefId = await this.fgHelperService.getOpSeqRefIdForMoProdColor(companyCode, unitCode, mo, prodColorInfo.pCode, prodColorInfo.bundles[0].color);
                const opgRecs = await this.fgHelperService.getOpgInfoForOpSeqRefId(companyCode, unitCode, opSeqRefId);
                const procTypes =  new Set<ProcessTypeEnum>();
                opgRecs.forEach(r => procTypes.add(r.procType));

                for(const p of procTypes) {
                    if([ProcessTypeEnum.CUT, ProcessTypeEnum.PACK, ProcessTypeEnum.KNIT].includes(p)) {
                        continue;
                    }
                    for(const b of bundles) {
                        const b1 = new MoActualBundleEntity();
                        b1.companyCode = companyCode;
                        b1.unitCode = unitCode;
                        b1.createdUser = username;
                        b1.pbBarcode = b.pbNumber;
                        b1.abBarcode = b.abNumber;
                        b1.procSerial = cutBundlesInfo.procSerial;
                        b1.pslId = b.pslId;
                        b1.confirmationId = confirmationId;
                        b1.procType = p;
                        b1.quantity = b.qty;
                        bEnts.push(b1);
                    }
                }
            }
            await transManager.startTransaction();
            await transManager.getRepository(MoActualBundleParentEntity).save(e1, {reload: false});
            await transManager.getRepository(MoActualBundleEntity).save(bEnts, {reload: false});
            // await transManager.getRepository(MoActualBundleSProcEntity).save(bSubProcEnts, {reload: false});
            await transManager.completeTransaction();
            this.mapActualBundlesToFgForAConfirmationIdKnit(req);
            await this.fgHelperService.sendAckToKnitSystemForInvReceived(companyCode, unitCode, username, confirmationId, PoKnitBundlingMoveToInvStatusEnum.MOVED_TO_INV);
            return new GlobalResponseObject(true, 0, `Actual bundles created successfully for confirmation id : ${confirmationId}`);
        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }
    }


    // This functions maps the FGs for the actual bundles. Will be called after the execution of createActualBundlesForConfirmationIdCut
    async mapActualBundlesToFgForAConfirmationIdKnit(req: KMS_C_KnitOrderBundlingConfirmationIdRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try{
            const {companyCode, unitCode, username, confirmationId } = req;
            if(!confirmationId) {
                throw new ErrorResponse(0, 'Confirmation id not provided');
            }
            const confRec = await this.moActBundleParentRepo.findOne({select: ['id'], where: {companyCode, unitCode, confirmationId: confirmationId, procType: ProcessTypeEnum.KNIT }});
            if(!confRec) {
                throw new ErrorResponse(0, `The actual bundle confirmation record not found for id : ${confirmationId}`);
            }
            const randomActualBunRec = await this.moActBundleRepo.findOne({select: ['abBarcode', 'pbBarcode', 'quantity', 'pslId', 'procSerial', 'procType'], where: {companyCode, unitCode, confirmationId: confirmationId}});
            if(!randomActualBunRec) {
                throw new ErrorResponse(0, `No actual bundles found in the pts  for confirmation id : ${confirmationId}`)
            }
            
            // Get only bundles for a single process type.
            const abRecs = await this.moActBundleRepo.find({select: ['abBarcode', 'pbBarcode', 'quantity', 'pslId', 'procSerial', 'procType'], where: {companyCode, unitCode, confirmationId: confirmationId, procType: randomActualBunRec.procType}});

            await transManager.startTransaction();
            // NOTE: IMPORTANT TO CONSIDER
            // for now since we are maintaining a single bundle for all process types, so we will iterate only 1 process type and map the same FG to the bundle for the remaining process types
            for(const b of abRecs) {
                // check and skip if the actual bundles already mapped for the FG numbers
                const bunRec = await this.fgBundleRepo.count({ select: ['id'], where: { oslId: b.pslId, abBarcode: b.abBarcode, procType: b.procType } });
                if(bunRec) {
                    continue;
                }
                // get the open FGs which are yet to be mapped
                const fgs = await this.fgBundleRepo.find({select: ['fgNumber', 'oslId'], where: { bundleBarcode: b.pbBarcode, oslId: b.pslId, abBarcode: '', procType: b.procType }});
                if(fgs.length == 0) {
                    throw new ErrorResponse(0, `Unmapped FGs not found for the planned bundle : ${b.pbBarcode} and process type : ${b.procType}`);
                }
                const openFgs = fgs.map(r => Number(r.fgNumber));
                const reqFgs = openFgs.splice(0, Number(b.quantity));
                if(reqFgs.length < b.quantity) {
                    throw new ErrorResponse(0, `Bundle : ${b.abBarcode} has ${b.quantity} quantity. But only ${reqFgs.length} is available for mapping in PTS. MORE INFO : Planned bundle : ${b.pbBarcode} and process type : ${b.procType}`);
                }
                await transManager.getRepository(FgBundleEntity).update({oslId: b.pslId, bundleBarcode: b.pbBarcode, fgNumber: In(reqFgs), }, {abBarcode: b.abBarcode});
            }
            await transManager.getRepository(MoActualBundleParentEntity).update({companyCode, unitCode, confirmationId}, {fgsMapped: true});
            await transManager.completeTransaction();
            return new GlobalResponseObject(true, 0, `Actual bundles mapped to FGs successfully for confirmation id : ${confirmationId}`);
        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }
    }


    // this is called after actual bundling reversal in  CPS
    async deleteActualBundlesForConfirmationIdKnit(req: KMS_C_KnitOrderBundlingConfirmationIdRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try{
            const {companyCode, unitCode, username, confirmationId } = req;
            if(!confirmationId) {
                throw new ErrorResponse(0, 'Confirmation id not provided');
            }
            const confRec = await this.moActBundleParentRepo.findOne({select: ['id'], where: {companyCode, unitCode, confirmationId: confirmationId, procType: ProcessTypeEnum.KNIT }});
            if(!confRec) {
                throw new ErrorResponse(0, `The actual bundle confirmation record not found for id : ${confirmationId}`);
            }
            const abRecs = await this.moActBundleRepo.find({select: ['abBarcode', 'pslId'], where: {companyCode, unitCode, confirmationId: confirmationId}});
            if(abRecs.length == 0) {
                throw new ErrorResponse(0, `No actual bundles found in the pts  for confirmation id : ${confirmationId}`)
            }
            const abBarcodes = abRecs.map(r => r.abBarcode);
            const pslIdsSet = new Set<number>();
            abRecs.forEach(r => pslIdsSet.add(r.pslId));
            await transManager.startTransaction();
            await transManager.getRepository(MoActualBundleEntity).delete({companyCode, unitCode, confirmationId});
            await transManager.getRepository(MoActualBundleParentEntity).delete({companyCode, unitCode, confirmationId});
            await transManager.getRepository(FgBundleEntity).update({abBarcode: In(abBarcodes), oslId: In([...pslIdsSet]) }, {abBarcode: ''});
            await transManager.completeTransaction();
            await this.fgHelperService.sendAckToKnitSystemForInvReceived(companyCode, unitCode, username, confirmationId, PoKnitBundlingMoveToInvStatusEnum.OPEN);
            return new GlobalResponseObject(true, 0, `Actual bundles deleted successfully for confirmation id : ${confirmationId}`);
        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }
    }
}
