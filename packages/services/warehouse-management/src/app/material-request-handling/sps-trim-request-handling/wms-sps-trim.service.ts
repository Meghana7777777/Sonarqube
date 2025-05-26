import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { ErrorResponse } from "@xpparel/backend-utils";
import { SPS_C_JobTrimReqIdRequest, WMS_TRIM_R_JobRequestedTrimResponse, WMS_C_WhTrimRequestIdRequest, GlobalResponseObject, WMS_C_STrimIssuanceRequest, WMS_TRIM_R_JobRequestedTrimModel, WMS_TRIM_R_JobRequestedTrimItemsModel, FabIssuingEntityEnum, RequestTypeEnum, WhReqByObjectISSEnum, WhReqByObjectEnum, PhItemCategoryEnum, WhMatReqLineStatusEnum, MaterialDestinationTypeEnum, WhMatReqLineItemStatusEnum, SPS_R_JobRequestedTrimsResponse, SPS_R_JobRequestedTrimsModel, WMS_C_IssuanceIdRequest, Rm_C_OutExtRefIdToGetAllocationsRequest, Rm_R_OutAllocationInfoAndBundlesResponse, Rm_issuanceInfoModel, Rm_R_OutAllocationInfoAndBundlesModel, WhMatReqLineStatusDisplayValue, WhFabReqStatusRequest, WMS_R_IssuanceIdItemsResponse, WMS_R_IssuanceIdItemsModel, MaterialReqStatusEnum } from "@xpparel/shared-models";
import { DataSource, Like } from "typeorm";
import { PackingListActualInfoService } from "../../packing-list/packing-list-actuals-info.service";
import { PhItemIssuanceRepo } from "../../packing-list/repository/ph-item-issuance.repository";
import { FabricRequestCreationHelperService } from "../fabric-request-creation/fabric-request-creation-helper.service";
import { WhMatIssLogHeaderRepo } from "../repositories/wh-mat-issuance-header.repository";
import { WhRequestHeaderRepo } from "../repositories/wh-request-header.repository";
import { WhRequestLineItemRepo } from "../repositories/wh-request-line-item.repository";
import moment from "moment";
import { dynamicRedlock } from "../../../config/redis/redlock.config";
import { GenericTransactionManager } from "../../../database/typeorm-transactions";
import { PhItemIssuanceEntity } from "../../packing-list/entities/ph-item-issuance.entity";
import { WhMatIssLogHeaderEntity } from "../entities/wh-mat-issuance-header.entity";
import { PackingListInfoService } from "../../packing-list/packing-list-info.service";
import { WhMatRequestHeaderEntity } from "../entities/wh-mat-request-header.entity";
import { WhMatRequestLineEntity } from "../entities/wh-mat-request-line.entity";
import { WhMatRequestLineItemEntity } from "../entities/wh-mat-request-line-item.entity";
import { ProcessingJobsService } from "@xpparel/shared-services";
import { WhRequestLineRepo } from "../repositories/wh-request-line.repository";

@Injectable()
export class WmsSpsTrimRequestService {
    constructor(
        private dataSource: DataSource,
        private whHeaderRepo: WhRequestHeaderRepo,
        private whLineItemRepo: WhRequestLineItemRepo,
        private whLineRepo: WhRequestLineRepo,
        private whMatIssHeadRepo: WhMatIssLogHeaderRepo,
        private phItemIssuance: PhItemIssuanceRepo,
        private processingJobsService: ProcessingJobsService,
        private helperService: FabricRequestCreationHelperService,
        @Inject(forwardRef(() => PackingListActualInfoService)) private packListActualInfoSerive: PackingListActualInfoService,
        @Inject(forwardRef(() => PackingListInfoService)) private packingListInfoService: PackingListInfoService,

    ) {

    }

    async issueSTrimForWhReqId(req: WMS_C_STrimIssuanceRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        let lockAlreadyReleased = false;
        let lock = null;
        // Need to check the material is in lock state or not
        try {
            const whReqData = await this.whHeaderRepo.findOne({ where: { id: req.whReqId } });
            if (!whReqData) {
                throw new ErrorResponse(212, `Request doesn't exist with given details`)
            }

            const lockPoMaterial = `ISS-${req.companyCode}-${req.unitCode}-${whReqData.moNumber}`;
            const ttl = 120000;
            lock = await dynamicRedlock.lock(lockPoMaterial, ttl).catch(error => {
                throw new ErrorResponse(16095, 'Someone already doing issuance for the same mo number. Please try again');
            });
            await transManager.startTransaction();
            const issuanceEntity = new WhMatIssLogHeaderEntity();
            issuanceEntity.issuedBy = req.issuedBy;
            issuanceEntity.issuedOn = req.issuedOn;
            issuanceEntity.companyCode = req.companyCode;
            issuanceEntity.createdUser = req.username;
            issuanceEntity.unitCode = req.unitCode;
            const now = moment();
            const datePart = now.format('MMDDYY');
            const prefix = `${WhReqByObjectISSEnum.SEWING}-${datePart}-`;
            const todayIssuances = await transManager.getRepository(WhMatIssLogHeaderEntity).count({
                where: {
                    issuanceNo: Like(`${prefix}%`)
                }
            });
            const sequence = String(todayIssuances + 1).padStart(3, '0');
            const issuanceNo = `${prefix}${sequence}`;
            issuanceEntity.issuanceNo = issuanceNo;
            const savedIssuanceEntity = await transManager.getRepository(WhMatIssLogHeaderEntity).save(issuanceEntity);
            const issuanceItems: PhItemIssuanceEntity[] = []
            for (const item of req.issuingItems) {
                const issuanceItem = new PhItemIssuanceEntity();
                issuanceItem.companyCode = req.companyCode;
                issuanceItem.createdUser = req.username;
                issuanceItem.unitCode = req.unitCode;
                issuanceItem.phItemLineId = item.phItemLineId;
                issuanceItem.issuedQuantity = item.issuingQty;
                issuanceItem.remarks = '';
                issuanceItem.issuingEntity = FabIssuingEntityEnum.PROCESS;
                issuanceItem.extRequestNo = whReqData.extReqNo;
                issuanceItem.requestType = RequestTypeEnum.NORMAL;
                issuanceItem.issuanceId = savedIssuanceEntity.id;
                issuanceItem.whReqId = req.whReqId;
                issuanceItems.push(issuanceItem);
                await this.packListActualInfoSerive.updateIssuedQuantity(req.unitCode, req.companyCode, req.username, item.phItemLineId, item.issuingQty, '', transManager);
            }
            await transManager.getRepository(PhItemIssuanceEntity).save(issuanceItems);
            await transManager.getRepository(WhMatRequestHeaderEntity).update({ id: whReqData.id, companyCode: req.companyCode, unitCode: req.unitCode }, { matRequestStatus: MaterialReqStatusEnum.MATERIAL_ISSUED });
            await transManager.getRepository(WhMatRequestLineEntity).update({ whRequestHeaderId: whReqData.id, companyCode: req.companyCode, unitCode: req.unitCode }, { reqLineStatus: WhMatReqLineStatusEnum.MATERIAL_ISSUED });
            await transManager.completeTransaction();
            await lock.unlock();
            //TODO: trigger a bull job for issuance
            await this.processingJobsService.updateIssuedMaterialFromWms(new WMS_C_IssuanceIdRequest(req.username, req.unitCode, req.companyCode, req.userId, savedIssuanceEntity.id));
            return new GlobalResponseObject(true, 3213, 'Successfully issued')
        } catch (err) {
            console.log(err);
            (lock && !lockAlreadyReleased) ? await lock.unlock() : null;
            await transManager.releaseTransaction();
            throw err;
        }
    }
    // IN wms
    async allocateSTrimsForAJobByRequestId(req: SPS_C_JobTrimReqIdRequest): Promise<GlobalResponseObject> {
        let transManager = new GenericTransactionManager(this.dataSource);
        try {
            const { companyCode, unitCode, username } = req;
            // Make an API call to KMS getRequestedKnitMaterialForReqId
            const materialRes: SPS_R_JobRequestedTrimsResponse = await this.processingJobsService.getRequestedTrimMaterialForReqId(req);
            if (!materialRes.status)
                throw new ErrorResponse(materialRes.errorCode, materialRes.internalMessage);
            await transManager.startTransaction();

            const requestData: SPS_R_JobRequestedTrimsModel = materialRes.data[0]
            console.log(requestData, 'requestData');

            // create the WH req and lines and line items
            const whHeaderEnt = new WhMatRequestHeaderEntity();
            whHeaderEnt.companyCode = companyCode;
            whHeaderEnt.unitCode = unitCode;
            whHeaderEnt.createdUser = username;
            whHeaderEnt.fulfillWithin = moment(requestData.expectedFulFillMentDate).format('YYYY-MM-DD HH:mm:ss');
            whHeaderEnt.extRefEntityType = WhReqByObjectEnum.SEWING;
            whHeaderEnt.reqMaterialType = PhItemCategoryEnum.TRIM;
            whHeaderEnt.extRefId = req.reqId; // PK of the po-material-request
            whHeaderEnt.extReqNo = requestData.requestNo;
            whHeaderEnt.materialReqOn = moment(requestData.materialRequestedOn).format('YYYY-MM-DD HH:mm:ss');//requestData.materialRequestedOn;
            whHeaderEnt.materialReqBy = requestData.requestedBy;
            // lock and generate the request number
            whHeaderEnt.whReqNo = requestData.requestNo;
            whHeaderEnt.moNumber = requestData.moNumber;
            const savedWhHeader = await transManager.getRepository(WhMatRequestHeaderEntity).save(whHeaderEnt);
            const whHeaderId = savedWhHeader.id;

            for (const line of materialRes.data) {
                const whLineEnt = new WhMatRequestLineEntity();
                whLineEnt.companyCode = companyCode;
                whLineEnt.unitCode = unitCode;
                whLineEnt.createdUser = username;
                whLineEnt.jobNumber = line.jobNumber;
                // whLineEnt.extRefLineId = line.id;
                whLineEnt.reqLineStatus = WhMatReqLineStatusEnum.OPEN;
                whLineEnt.matDestinationType = MaterialDestinationTypeEnum.SEWING_LINE;
                // whLineEnt.matDestinationId = req.requestedResourceId;
                // whLineEnt.matDestinationDesc = req.requestedResourceDesc;
                whLineEnt.whRequestHeaderId = whHeaderId; // assing the Rek key
                const savedWhLine = await transManager.getRepository(WhMatRequestLineEntity).save(whLineEnt);
                const whLineId = savedWhLine.id;

                const whItemEntities: WhMatRequestLineItemEntity[] = [];
                const itemCodeToIDMap = await this.packingListInfoService.getRollIdBarcodesMap(line.items.map(i => i.barcode), unitCode, companyCode);
                for (const item of line.items) {
                    const whItemEnt = new WhMatRequestLineItemEntity();
                    whItemEnt.companyCode = companyCode;
                    whItemEnt.unitCode = unitCode;
                    whItemEnt.createdUser = username;
                    whItemEnt.itemBarcode = item.barcode;
                    whItemEnt.itemId = itemCodeToIDMap.get(item.barcode);
                    whItemEnt.reqLineItemStatus = WhMatReqLineItemStatusEnum.OPEN;
                    whItemEnt.reqQuantity = item.requestingQty;
                    whItemEnt.issuedQuantity = 0;
                    whItemEnt.whRequestHeaderId = whHeaderId;
                    whItemEnt.whRequestLineId = whLineId;
                    whItemEntities.push(whItemEnt);
                }
                await transManager.getRepository(WhMatRequestLineItemEntity).save(whItemEntities, { reload: false });
            }
            await transManager.completeTransaction();
            return new GlobalResponseObject(true, 6203, 'WH request created');
        } catch (err) {
            await transManager.releaseTransaction();
            throw err;
        }
    }

    // IN wms
    async getAllocatedMaterialForWhSTrimsRequestId(req: WMS_C_WhTrimRequestIdRequest): Promise<WMS_TRIM_R_JobRequestedTrimResponse> {
        const itemDetails: WMS_TRIM_R_JobRequestedTrimItemsModel[] = [];
        const { companyCode, unitCode } = req;
        const whHeaderData = await this.whHeaderRepo.findOne({ where: { id: req.whReqId, companyCode, unitCode } });
        if (!whHeaderData)
            throw new ErrorResponse(1213, 'Details not found with given criteria');
        const whLines = await this.whLineItemRepo.find({ where: { whRequestHeaderId: req.whReqId, companyCode, unitCode } });
        for (const line of whLines) {
            const items = await this.whLineItemRepo.find({ where: { whRequestLineId: line.id, whRequestHeaderId: req.whReqId, companyCode, unitCode } })
            const itemDetailsRes = await this.helperService.getRollDetailsForRollBarcodes(items.map(item => item.itemBarcode), companyCode, unitCode);
            const itemDetailsMap = new Map(itemDetailsRes.map(item => [item.barcode, item]));
            for (const item of items) {
                itemDetails.push(new WMS_TRIM_R_JobRequestedTrimItemsModel(item.itemBarcode, itemDetailsMap.get(item.itemBarcode).relaxWidth, itemDetailsMap.get(item.itemBarcode).itemCode, itemDetailsMap.get(item.itemBarcode).itemDesc, item.reqQuantity, line.id, item.issuedQuantity));
            }
        }
        return new WMS_TRIM_R_JobRequestedTrimResponse(true, 2131, 'Data retrieved successfully', [new WMS_TRIM_R_JobRequestedTrimModel(req.whReqId.toString(), itemDetails)])
    }

    // IN wms
    async getAllocatedSTrimMaterialForExtRefId(req: SPS_C_JobTrimReqIdRequest): Promise<WMS_TRIM_R_JobRequestedTrimResponse> {
        const { companyCode, unitCode } = req;
        const whHeaderData = await this.whHeaderRepo.findOne({ where: { extRefId: req.reqId, companyCode, unitCode } });
        if (!whHeaderData)
            throw new ErrorResponse(1213, 'Details not found with given criteria');
        return this.getAllocatedMaterialForWhSTrimsRequestId(new WMS_C_WhTrimRequestIdRequest(req.username, unitCode, companyCode, req.userId, whHeaderData.id));
    }

    async changeWhSTrimReqStatus(req: WhFabReqStatusRequest): Promise<GlobalResponseObject> {
        let manager = new GenericTransactionManager(this.dataSource);
        try {
            // TODO: do all the pre validations
            const whFabReq = await this.whHeaderRepo.findOne({ where: { companyCode: req.companyCode, unitCode: req.unitCode, isActive: true, extReqNo: req.materialRequestNo, reqMaterialType: PhItemCategoryEnum.TRIM } });
            if (!whFabReq) {
                throw new ErrorResponse(6211, `The given request no : ${req.materialRequestNo} does not exist`);
            }
            const whReqLine = await this.whLineRepo.findOne({ select: ['id', 'reqLineStatus', 'jobNumber'], where: { whRequestHeaderId: whFabReq.id, companyCode: req.companyCode, unitCode: req.unitCode } });
            if (!whReqLine) {
                throw new ErrorResponse(6212, `The given request no : ${req.materialRequestNo} is not mapped to any docket`);
            }
            if (whReqLine.reqLineStatus == req.status) {
                throw new ErrorResponse(6213, `Material is already set to ${WhMatReqLineStatusDisplayValue[req.status]} for this request`);
            }
            await manager.startTransaction();
            await manager.getRepository(WhMatRequestLineEntity).update({ whRequestHeaderId: whFabReq.id, companyCode: req.companyCode, unitCode: req.unitCode }, { reqLineStatus: req.status });
            await manager.getRepository(WhMatRequestHeaderEntity).update({ id: whFabReq.id, companyCode: req.companyCode, unitCode: req.unitCode }, { matRequestStatus: req.status as any });
            // now update the status in the CPS also against to the request
            await manager.completeTransaction();
            // TODO: trigger a bull job to update at knit level
            return new GlobalResponseObject(true, 6214, `${WhMatReqLineStatusDisplayValue[req.status]} cutting table`);
        } catch (error) {
            await manager.releaseTransaction();
            throw error;
        }
    }

    // common for all knit, sps, pack trims
    async getIssuedItemsUnderIssuanceId(req: WMS_C_IssuanceIdRequest): Promise<WMS_R_IssuanceIdItemsResponse> {
        const issuanceLog = await this.whMatIssHeadRepo.count({ where: { id: req.issuanceId } });
        if (!issuanceLog) {
            throw new ErrorResponse(212, `Request doesn't exist with given details`)
        }
        const issuanceItemsModel: WMS_R_IssuanceIdItemsModel[] = [];
        const issuanceItems = await this.phItemIssuance.getIssuedItemsUnderIssuanceId(req.issuanceId, req.unitCode, req.companyCode);
        for (const itemsModel of issuanceItems) {
            issuanceItemsModel.push(new WMS_R_IssuanceIdItemsModel(itemsModel.ext_ref_id, itemsModel.item_code, itemsModel.ph_item_line_id, itemsModel.issued_quantity, itemsModel.barcode));
        }
        return new WMS_R_IssuanceIdItemsResponse(true, 1234, 'Data retrieved successfully', issuanceItemsModel);
    }

    async getRmAllocatedMaterialForRequestRefId(req: Rm_C_OutExtRefIdToGetAllocationsRequest): Promise<Rm_R_OutAllocationInfoAndBundlesResponse> {
        console.log(req, 'req')
        try {
            const whHeaderData = await this.whHeaderRepo.getRmAllocatedMaterialForAllocationId(req.extReqId, req.unitCode, req.companyCode);
            if (!whHeaderData || whHeaderData.length === 0) {
                throw new ErrorResponse(1213, 'extReqId not found in WMS');
            }

            const externalReqNo = whHeaderData[0].extReqNo;
            const plIssuanceData = await this.phItemIssuance.getDistinctIssuanceIdsByExtRefNo(externalReqNo, req.unitCode, req.companyCode);

            let issuanceInfo: Rm_issuanceInfoModel | null = null;
            const isIssued = plIssuanceData.length > 0;

            if (isIssued) {
                const issuanceId = plIssuanceData[0].issuanceId;
                issuanceInfo = await this.whMatIssHeadRepo.getIssuanceDateAndIssuedByByIssuanceNo(issuanceId, req.unitCode, req.companyCode);

            }
            const groupedByAllocation = new Map<number, Rm_R_OutAllocationInfoAndBundlesModel>();
            const distinctBarcodesByAllocation = new Map<number, Set<string>>();
            for (const item of whHeaderData) {
                let allocationModel = groupedByAllocation.get(item.allocationId);
                if (!allocationModel) {
                    allocationModel = {
                        allocationId: item.allocationId,
                        allocatedBy: issuanceInfo?.issuedBy || '',
                        allocatedDate: issuanceInfo?.issuanceDate || '',
                        issued: isIssued,
                        issuedBy: issuanceInfo?.issuedBy || '',
                        issuedDate: issuanceInfo?.issuanceDate || '',
                        forcedPartialAllocation: false,
                        refId: item.exReqId,
                        bundles: []
                    };
                    groupedByAllocation.set(item.allocationId, allocationModel);
                    distinctBarcodesByAllocation.set(item.allocationId, new Set<string>());
                }
                const uniqueKey = `${item.itemSku}__${item.bunBarcode}`;
                const distinctSet = distinctBarcodesByAllocation.get(item.allocationId)!;
                if (!distinctSet.has(uniqueKey)) {
                    allocationModel.bundles.push({ itemSku: item.itemSku, bunBarcode: item.bunBarcode, aQty: item.aQty, rQty: item.rQty, iQty: item.iQty, issued: isIssued });
                    distinctSet.add(uniqueKey);
                }
            }
            const finalResponseData = Array.from(groupedByAllocation.values());
            return new Rm_R_OutAllocationInfoAndBundlesResponse(true, 2131, 'Data retrieved successfully', finalResponseData);
        } catch (error) {
            console.error('Error in getRmAllocatedMaterialForAllocationId:', error);
            throw new ErrorResponse(500, error.message);
        }
    }

}