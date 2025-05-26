import { CPS_C_BundlingConfirmationIdRequest, GlobalResponseObject, KMS_C_KnitOrderBundlingConfirmationIdRequest, PoCutBundlingMoveToInvStatusEnum, PoKnitBundlingMoveToInvStatusEnum, ProcessTypeEnum } from "@xpparel/shared-models";
import { DataSource } from "typeorm";
import { InvInHelperService } from "./inv-in-helper.service";
import { InvInRequestItemRepository } from "../entity/repository/inv-in-request-item.repository";
import { InvInRequestRepository } from "../entity/repository/inv-in-request.repository";
import { InvInRequestBundleRepository } from "../entity/repository/inv-in-request-bundle.repository";
import { ErrorResponse } from "@xpparel/backend-utils";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { InvInRequestEntity, InvInRequestStatus } from "../entity/inv.in.request.entity";
import { InvInRequestItemEntity } from "../entity/inv.in.request.item.entity";
import { InvBarcodeLevelEnum, InvInRequestBundleEntity } from "../entity/inv.in.request.bundle.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CutInvCreationService {

    constructor(
        private dataSource: DataSource,
        private inHelperService: InvInHelperService,
        private invInReqRepo: InvInRequestRepository,
        private invInReqLine: InvInRequestItemRepository,
        private invInReqBarcode: InvInRequestBundleRepository
    ) {
        
    }

    // End Point
    // called from the backend service only
    // called from KMS after the bundling confirmation
    async createCutInvInRequestByConfirmationId(req: CPS_C_BundlingConfirmationIdRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            const {companyCode, unitCode, username,confirmationId } = req;
            const processType = ProcessTypeEnum.CUT;
            // first check if the inventory request created for the confirmation id
            const confirmedRec = await this.invInReqRepo.findOne({select: ['id'], where: { companyCode: companyCode, unitCode: unitCode, refId: confirmationId, refType: processType}});
            if(confirmedRec){
                throw new ErrorResponse(0, `Inventory already created for the confirmation id : ${confirmationId}`);
            }
            const confirmedBundles = await this.inHelperService.getCutConfirmedBundlesForConfirmationId(confirmationId, ProcessTypeEnum.CUT, companyCode, unitCode);
            // iterate the bundles and create the inventory
            const invInReqEnt = new InvInRequestEntity();
            invInReqEnt.companyCode = companyCode;
            invInReqEnt.unitCode = unitCode;
            invInReqEnt.createdUser = username;
            invInReqEnt.requestStatus = InvInRequestStatus.COMPLETELY_CAME_IN;
            invInReqEnt.refId = confirmationId;
            invInReqEnt.refType = processType;
            invInReqEnt.requestNumber = confirmationId.toString();


            const procSerial = confirmedBundles.procSerial;
            const procType = confirmedBundles.procType;
            await transManager.startTransaction();
            const savedInvInReq = await transManager.getRepository(InvInRequestEntity).save(invInReqEnt);
            for(const p of confirmedBundles.prodWiseBundles) {
                const invInReqItemEnt = new InvInRequestItemEntity();
                invInReqItemEnt.companyCode = companyCode;
                invInReqItemEnt.unitCode = unitCode;
                invInReqItemEnt.createdUser = username;
                invInReqItemEnt.processType = procType;
                invInReqItemEnt.processingSerial = procSerial;
                invInReqItemEnt.processType = procType;
                invInReqItemEnt.invInRequestId = savedInvInReq.id;
                invInReqItemEnt.itemSku = p.bundles[0]?.bomSku;

                const savedItem = await transManager.getRepository(InvInRequestItemEntity).save(invInReqItemEnt);
                const invBundles: InvInRequestBundleEntity[] = [];
                // now iterate the bundles and save the bundles
                for(const b of p.bundles) {
                    const e1 = new InvInRequestBundleEntity();
                    e1.companyCode = companyCode;
                    e1.unitCode = unitCode;
                    e1.createdUser = username;
                    e1.processType = procType;
                    e1.itemSku = b.bomSku;
                    e1.processingSerial = procSerial;
                    e1.invInRequestId = savedInvInReq.id;
                    e1.invInRequestItemId = savedItem.id;
                    e1.pslId = b.pslId;
                    e1.orgQty = b.qty;
                    e1.inQty = b.confirmedQty;
                    e1.bundleBarcode = b.abNumber;
                    e1.jobNumber = '';
                    e1.barcodeLevel = InvBarcodeLevelEnum.BUNDLE;
                    invBundles.push(e1);
                }
                await transManager.getRepository(InvInRequestBundleEntity).save(invBundles, {reload: false});
            }
            await transManager.completeTransaction();
            // call the KMS Api to update the inventory creation status
            await this.inHelperService.sendAckToCpsSystemForInvReceived(companyCode, unitCode, username, confirmationId, PoCutBundlingMoveToInvStatusEnum.MOVED_TO_INV);
            return new GlobalResponseObject(true, 0, 'Inventory created for the confirmation id');
        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }
    }

    // End Point
    // deletes the inventory for the confirmation id
    async deleteCutInvInRequestByConfirmationId(req: CPS_C_BundlingConfirmationIdRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            const {companyCode, unitCode, username, confirmationId } = req;
            const processType = ProcessTypeEnum.CUT;
            // first check if the inventory request created for the confirmation id
            const confirmedRec = await this.invInReqRepo.findOne({select: ['id'], where: { companyCode: companyCode, unitCode: unitCode, refId: confirmationId, refType: processType}});
            if(!confirmedRec){ 
                throw new ErrorResponse(0, `Inventory not created for the confirmation id : ${confirmationId}`);
            }
            await transManager.startTransaction();
            await transManager.getRepository(InvInRequestEntity).delete({companyCode: companyCode, unitCode: unitCode, refId: confirmationId, refType: processType});
            await transManager.getRepository(InvInRequestItemEntity).delete({companyCode: companyCode, unitCode: unitCode, invInRequestId: confirmedRec.id });
            await transManager.getRepository(InvInRequestBundleEntity).delete({companyCode: companyCode, unitCode: unitCode, invInRequestId: confirmedRec.id });
            await transManager.completeTransaction();
            await this.inHelperService.sendAckToCpsSystemForInvReceived(companyCode, unitCode, username, confirmationId, PoCutBundlingMoveToInvStatusEnum.OPEN);
            return new GlobalResponseObject(true, 0, `Inventory request deleted for the confirmation id : ${req.confirmationId}`);
        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }
    }

    
}



