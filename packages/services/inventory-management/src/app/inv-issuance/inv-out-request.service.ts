import { GlobalResponseObject, INV_C_InvOutAllocExtRefIdRequest, KMS_C_KnitOrderBundlingConfirmationIdRequest, ProcessTypeEnum, SPS_C_InvOutConfirmationRequest, SPS_R_InvOutItemsForConfirmationIdModel } from "@xpparel/shared-models";
import { DataSource, In } from "typeorm";
import { InvInHelperService } from "../inv-creation/inv-in-helper.service";
import { InvInRequestItemRepository } from "../entity/repository/inv-in-request-item.repository";
import { InvInRequestRepository } from "../entity/repository/inv-in-request.repository";
import { InvInRequestBundleRepository } from "../entity/repository/inv-in-request-bundle.repository";
import { ErrorResponse } from "@xpparel/backend-utils";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { InvInRequestEntity, InvInRequestStatus } from "../entity/inv.in.request.entity";
import { InvInRequestItemEntity } from "../entity/inv.in.request.item.entity";
import { BundleConsumptionStatusEnum, InvBarcodeLevelEnum, InvInRequestBundleEntity } from "../entity/inv.in.request.bundle.entity";
import { InvOutRequestEntity } from "../entity/inv.out.req.entity";
import { InvOutRequestItemRepository } from "../entity/repository/inv-out-request-item.repository";
import { InvOutRequestBundleRepository } from "../entity/repository/inv-out-request-barcode.repository";
import { InvOutRequestRepository } from "../entity/repository/inv-out-request.repository";
import { InvOutRequestItemEntity } from "../entity/inv.out.request.item.entity";
import { InvOutRequestBundleEntity } from "../entity/inv.out.request.bundle.entity";
import { InvOutAllocRepository } from "../entity/repository/inv-out-alloc.repository";
import { InvOutAllocBundleRepository } from "../entity/repository/inv-out-alloc-bundle.repository";
import { InvIssuanceHelperService } from "./inv-issuance-helper.service";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import moment from 'moment';
import { InvIssuanceService } from "./inv-issuance.service";

@Injectable()
export class InvOutRequestService {

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
        @Inject(forwardRef(() => InvIssuanceService)) private invIssuanceService: InvIssuanceService
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


    // END Point
    // called from the IPS dashboard -> SPS -> INVS
    async createInvOutRequestForOutConfirmationId(req: SPS_C_InvOutConfirmationRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            const {companyCode, unitCode, username, reqId, fulfillmentExpectedBy, requestedBy, processType } = req;
            // check if the inv out is already created for the confirmation id and process type
            const invOutReq = await this.invOutReqRepo.findOne({select: ['id'], where: { companyCode: companyCode, unitCode: unitCode, refId: reqId, processType: processType }});
            if(invOutReq) {
                throw new ErrorResponse(0, `Inventory out request already created for the id : ${reqId} and process type : ${processType}`);
            }
            let invOutItems: SPS_R_InvOutItemsForConfirmationIdModel = null;
            // now get the inv out items using the request id from the SPS or KMS
            if(processType == ProcessTypeEnum.KNIT) {
                invOutItems = null;
            } else {
                invOutItems = await this.outHelperService.getRequestedSFGBundlesForConfirmationId(reqId, processType, companyCode, unitCode);
            }
            console.log(invOutItems);
            const actualBarcodes = [];
            let depProcType = invOutItems.itemWiseBundles[0]?.depProcType;
            let itemSku = invOutItems.itemWiseBundles[0]?.itemSku;
            invOutItems.itemWiseBundles.map(r => {
                r.bundles.forEach(b => {
                    actualBarcodes.push(b.bundleNo);
                });
            });
            // check if all the requested bundles are present in the INV
            const invBundles = await this.invInReqBarcode.find({select: ['id', 'bundleBarcode'], where: {companyCode, unitCode, processingSerial: invOutItems.procSerial, processType: depProcType, bundleBarcode: In(actualBarcodes), bundleState: BundleConsumptionStatusEnum.OPEN, itemSku: itemSku}});
            if(invBundles.length != actualBarcodes.length) {
                throw new ErrorResponse(0, `Requesting for ${actualBarcodes.length} bundle. But ${invBundles.length} are found in the inventory`);
            }
            // now construct the out req, req items and req bundles
            await transManager.startTransaction();

            const ivoEnt = new InvOutRequestEntity();
            ivoEnt.companyCode = companyCode;
            ivoEnt.unitCode = unitCode;
            ivoEnt.createdUser = username;
            ivoEnt.processType = processType;
            ivoEnt.refId = reqId;
            ivoEnt.requestNumber = processType+reqId;
            const savedOutEnt = await transManager.getRepository(InvOutRequestEntity).save(ivoEnt);

            for(const item of invOutItems.itemWiseBundles) {
                const ivoLineEnt = new InvOutRequestItemEntity();
                ivoLineEnt.companyCode = companyCode;
                ivoLineEnt.unitCode = unitCode;
                ivoLineEnt.createdUser = username;
                ivoLineEnt.processType = invOutItems.processType;
                ivoLineEnt.depProcType = item.depProcType;
                ivoLineEnt.processingSerial = invOutItems.procSerial;
                ivoLineEnt.invOutRequestId = savedOutEnt.id;
                ivoLineEnt.itemSku = item.itemSku;
                const savedIvoLineEnt = await transManager.getRepository(InvOutRequestItemEntity).save(ivoLineEnt);

                const bunEnts: InvOutRequestBundleEntity[] = [];
                for(const b of item.bundles) {
                    const bunEnt = new InvOutRequestBundleEntity();
                    bunEnt.companyCode = companyCode;
                    bunEnt.unitCode = unitCode;
                    bunEnt.createdUser = username;
                    bunEnt.itemSku = item.itemSku;
                    bunEnt.invOutRequestId = savedOutEnt.id;
                    bunEnt.invOutRequestItemId = savedIvoLineEnt.id;
                    bunEnt.processingSerial = invOutItems.procSerial;
                    bunEnt.processType = invOutItems.processType;
                    bunEnt.barcodeLevel = InvBarcodeLevelEnum.BUNDLE;
                    bunEnt.bundleBarcode = b.bundleNo;
                    bunEnt.pslId = b.pslId;
                    bunEnt.orgQty = b.orgQty;
                    bunEnt.reqQty = b.reqQty;
                    bunEnts.push(bunEnt);
                }
                await transManager.getRepository(InvOutRequestBundleEntity).save(bunEnts, {reload: false});
            }
            // update the bundle consumption status to allocated for the bundles in the inv
            await transManager.getRepository(InvInRequestBundleEntity).update({companyCode, unitCode, processingSerial: invOutItems.procSerial, processType: depProcType, bundleBarcode: In(actualBarcodes), bundleState: BundleConsumptionStatusEnum.OPEN, itemSku: itemSku}, {bundleState: BundleConsumptionStatusEnum.ALLOCATED});
            // after saving all the info commit the transaction
            await transManager.completeTransaction();
            const currDate = moment().format('YYYY-MM-DD');
            const m1 = new INV_C_InvOutAllocExtRefIdRequest(username, unitCode, companyCode, 0, reqId, true, currDate, null, processType, false);
            // Bull job
            await this.invIssuanceService.allocateInventoryForInvOutRequest(m1);
            // call the sps api / kms api to say the request is created successfully
            return new GlobalResponseObject(true, 0, `Inventory out successfully request created for the id : ${reqId} and process type : ${processType}`);
        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }
    }

    // END Point
    // called from the TRIMS dashboard -> SPS -> INVS
    async deleteInvOutRequestForOutConfirmationId(req: SPS_C_InvOutConfirmationRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            const {companyCode, unitCode, username, reqId, fulfillmentExpectedBy, requestedBy, processType } = req;
            // check if the inv out is already created for the confirmation id and process type
            const invOutReq = await this.invOutReqRepo.findOne({select: ['id'], where: { companyCode: companyCode, unitCode: unitCode, refId: reqId, processType: processType }});
            if(!invOutReq) {
                throw new ErrorResponse(0, `Inventory out request not found for the id : ${reqId} and process type : ${processType}`);
            }
            // check if any allocations are made, then don't delete
            const allocations = await this.invOutAllocRepo.findOne({select: ['id'], where: { companyCode: companyCode, unitCode: unitCode, invOutRequestId: invOutReq.id }});
            if(allocations) {
                throw new ErrorResponse(0, `Allocation is already done for the request id : ${reqId} and process type : ${processType}`);
            }

            const invOutReqItemRecs = await this.invOutReqLine.find({select: ['depProcType'], where: {companyCode, unitCode, invOutRequestId: invOutReq.id}});
            const depProcTypes = invOutReqItemRecs.map(r => r.depProcType);
            const bundles = await this.invOutReqBarcode.find({ select: ['processingSerial', 'processType', 'pslId', 'itemSku', 'bundleBarcode'], where: { companyCode, unitCode, invOutRequestId: invOutReq.id }});
            // now delete all the request , items and bundles
            await transManager.startTransaction();
            await transManager.getRepository(InvOutRequestEntity).delete({companyCode: companyCode, unitCode: unitCode, id: invOutReq.id});
            await transManager.getRepository(InvOutRequestItemEntity).delete({companyCode: companyCode, unitCode: unitCode, id: invOutReq.id});
            await transManager.getRepository(InvOutRequestBundleEntity).delete({companyCode: companyCode, unitCode: unitCode, id: invOutReq.id});
            // Remember, we have to make the bundle state for the previous process type as the inventory will be for the pre process type
            for(const b of bundles) {
                await transManager.getRepository(InvInRequestBundleEntity).update({ companyCode, unitCode, processType: In(depProcTypes), bundleBarcode: b.bundleBarcode, itemSku: b.itemSku, pslId: b.pslId, processingSerial: b.processingSerial  }, {bundleState: BundleConsumptionStatusEnum.OPEN});
            }
            await transManager.completeTransaction();

            return new GlobalResponseObject(true, 0, `Inventory out successfully request deleted for the id : ${reqId} and process type : ${processType}`);
        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }
    }

}


