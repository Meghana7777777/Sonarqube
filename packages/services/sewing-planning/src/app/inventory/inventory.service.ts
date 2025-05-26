import { Injectable } from '@nestjs/common';
import {  CPS_C_BundlingConfirmationIdRequest, DowntimeData, DowntimeRequest, DowntimeResponseModel, DowntimeUpdateRequest, GlobalResponseObject, ProcessTypeEnum, PTS_C_ProcTypeBundleBarcodeModel, PTS_R_BundleBarcodeOutputQtyModel, PTS_R_ProcTypeBundleBarcodeCompletedQtyModel, SPS_C_BundleInvConfirmationIdRequest, SPS_C_ProdColorEligibleBundlesForMoveToInvRequest, SPS_C_ProdColorEligibleBundlesMovingToInvRequest, SPS_ELGBUN_C_SewProcSerialRequest, SPS_R_ProdColorEligibleBundlesForMoveToInvModel, SPS_R_ProdColorEligibleBundlesForMoveToInvResponse, SpsBundleInventoryMoveToInvStatusEnum, WsDowntimeStatusEnum } from '@xpparel/shared-models';
import { DataSource, In, IsNull } from 'typeorm';
import { GenericTransactionManager } from '../../database/typeorm-transactions';
import { WsDowntimeEntity } from '../entities/ws-downtime';
import { WsDownTimeRepo } from '../entities/repository/ws-downtime.repository';
import { elementAt } from 'rxjs';
import { ErrorResponse } from '@xpparel/backend-utils';
import { InventoryHelperService } from './invnentory-helper.service';
import { SJobBundleRepository } from '../entities/repository/s-job-bundle.repository';
import { InventoryBundleEntity, SpsOrderProductBundleStateEnum } from '../entities/inventory-bundle.entity';
import { InventoryConfirmationRepository } from '../entities/repository/inventory-confirmation.repo';
import { InventoryBundleRepository } from '../entities/repository/inventory-bundle.repo';
import { InventoryConfirmationEntity } from '../entities/inventory-confirmation.entity';
import { SJobBundleEntity } from '../entities/s-job-bundle.entity';


@Injectable()
@Injectable()
export class InventoryService {
    constructor(
        private dataSource: DataSource,
        private helperService: InventoryHelperService,
        private invConfRepo: InventoryConfirmationRepository,
        private invBunRepo: InventoryBundleRepository

    ) {

    }

    // called from the SPS UI - to move the output done FGs to inventory
    async moveOutputCompletedProcTypeBundlesToInventory(req: SPS_C_ProdColorEligibleBundlesMovingToInvRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            const { companyCode, unitCode, username, procSerial, processType, fgColor, prodName, movingBundles } = req;
            if(!procSerial || !processType || !prodName || !fgColor) {
                throw new ErrorResponse(0, 'Product name, color, process type are mandatory. Few are not provided');
            }
            // TODO: Have to verify if the incoming bundles actually belong to the proc serial

            const consumedBundles = new Set<string>();
            const confirmationId = Date.now();
            const actualBarcodes = movingBundles.map(b => b.bunBarcode);
            // check if any bundle is already in the inventory
            const avlRecs = await this.invBunRepo.find({select: ['abBarcode', 'confirmationId', 'createdAt'], where: {poSerial: procSerial, abBarcode: In(actualBarcodes)}});
            if(avlRecs.length > 0) {
                throw new ErrorResponse(0, `Something wrong. Bundle ${avlRecs[0].abBarcode} is already moved to inventory by confirmation id : ${avlRecs[0].confirmationId} on ${avlRecs[0].createdAt}.`);
            }
            let totalBundlesConf = 0;
            let totalConfQty = 0;
            const bunEnts: InventoryBundleEntity[] = [];
            for(const b of movingBundles) {
                if(consumedBundles.has(b.bunBarcode)) {
                    return;
                }
                consumedBundles.add(b.bunBarcode);
                const e = new InventoryBundleEntity();
                e.companyCode = companyCode;
                e.unitCode = unitCode;
                e.createdUser = username;
                e.poSerial = procSerial;
                e.abBarcode = b.bunBarcode;
                e.pQty = b.orgQty;
                e.aQty = b.opQty;
                e.pslId = b.pslId;
                e.confirmationId = confirmationId;
                e.bundleState = SpsOrderProductBundleStateEnum.FORMED;
                e.processType = processType;
                bunEnts.push(e);

                totalBundlesConf++;
                totalConfQty += b.opQty;
            }
            const invConfEnt = new InventoryConfirmationEntity();
            invConfEnt.color = fgColor;
            invConfEnt.processType = processType;
            invConfEnt.processingSerial = procSerial;
            invConfEnt.productName = prodName;
            invConfEnt.confirmationId = confirmationId;
            invConfEnt.companyCode = companyCode;
            invConfEnt.unitCode = unitCode;
            invConfEnt.createdUser = username;
            invConfEnt.confirmedBy = username;
            invConfEnt.totalBundlesConfirmed = totalBundlesConf;
            invConfEnt.totalMovedQuantity = totalConfQty;

            await transManager.startTransaction();
            await transManager.getRepository(InventoryConfirmationEntity).save(invConfEnt, {reload: false});
            await transManager.getRepository(InventoryBundleEntity).save(bunEnts, {reload: false});
            await transManager.getRepository(SJobBundleEntity).update({companyCode, unitCode, bundleNumber: In([...consumedBundles]), processingSerial: procSerial, processType: processType }, {movedToInv: true});
            await transManager.completeTransaction();
            // send an ack to inventory service, so it will create the inventory out there
            await this.helperService.createSpsInvInRequestByConfirmationId(confirmationId, processType, companyCode, unitCode, username);
            return new GlobalResponseObject(true, 0, 'Bundles moved to inventory successfully');
        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }
    }

    // Called from INVS
    async updateExtSystemAckForInventoryConfirmation(req: SPS_C_BundleInvConfirmationIdRequest): Promise<GlobalResponseObject> {
        const { companyCode, unitCode, confirmationId, username, processType } = req;
        if(!confirmationId || !processType) {
            throw new ErrorResponse(0, `Confirmation id and process type are required. But not provided in the request`);
        }
        const invConfRec = await this.invConfRepo.findOne({select: ['id', 'invStatus'], where: { companyCode, unitCode, confirmationId: confirmationId, processType: processType }});
        if(!invConfRec) {
            throw new ErrorResponse(0, `Confirmation record not found for the confirmation id : ${confirmationId} and process type : ${processType}`);
        }
        if(req.ackStatus == SpsBundleInventoryMoveToInvStatusEnum.MOVED_TO_INV) {
            if(invConfRec.invStatus == SpsBundleInventoryMoveToInvStatusEnum.MOVED_TO_INV) {
                throw new ErrorResponse(0, `Confirmation record for confirmation id ${confirmationId} was already confirmed by the inventory`);
            }
        } else {
            if(invConfRec.invStatus == SpsBundleInventoryMoveToInvStatusEnum.OPEN) {
                throw new ErrorResponse(0, `Confirmation record for confirmation id ${confirmationId} was already in open state`);
            }
        }
        await this.invConfRepo.update({companyCode, unitCode, confirmationId}, {invStatus: req.ackStatus});
        return new GlobalResponseObject(true, 0, `Confirmation status updated for confirmation id : ${confirmationId}`);
    }

    async deleteBundleInventoryMovedConfirmation(req: SPS_C_BundleInvConfirmationIdRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            const { companyCode, unitCode, confirmationId, username, processType } = req;
            if(!confirmationId || !processType) {
                throw new ErrorResponse(0, `Confirmation id and process type are required. But not provided in the request`);
            }
            const invConfRec = await this.invConfRepo.findOne({select: ['id', 'invStatus', 'processingSerial'], where: { companyCode, unitCode, confirmationId: confirmationId, isActive: true, processType: processType }});
            if(!invConfRec) {
                throw new ErrorResponse(0, `Confirmation record not found for the confirmation id : ${confirmationId} and process type : ${processType}`);
            }
            // get the confirmed bundles for the confirmation id
            const confBundles = await this.invBunRepo.find({select: ['abBarcode'], where: { companyCode, unitCode, confirmationId: confirmationId, poSerial: invConfRec.processingSerial }});
            const bunBarcodes = confBundles.map(r => r.abBarcode);
            await transManager.startTransaction();
            await transManager.getRepository(InventoryConfirmationEntity).update({companyCode, unitCode, confirmationId: confirmationId, isActive: true, processType: processType},{isActive: false});
            await transManager.getRepository(InventoryBundleEntity).delete({companyCode, unitCode, confirmationId: confirmationId, processType: processType, poSerial: invConfRec.processingSerial});
            // revert the moved to inventory status to false for the bundles
            await transManager.getRepository(SJobBundleEntity).update({companyCode, unitCode, bundleNumber: In(bunBarcodes)}, {movedToInv: false});
            await transManager.completeTransaction();
            // send this ack to the inspection
            await this.helperService.deleteSpsInvInRequestByConfirmationId(confirmationId, processType, companyCode, unitCode, username);
            return new GlobalResponseObject(true, 0, 'Inventory confirmation reverted successfully');
        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }
    }
}