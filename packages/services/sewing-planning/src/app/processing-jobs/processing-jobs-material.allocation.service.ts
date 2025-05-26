import { Injectable } from "@nestjs/common";
import { ErrorResponse } from "@xpparel/backend-utils";
import { GlobalResponseObject, MaterialRequestTypeEnum, ProcessTypeEnum, PhItemCategoryEnum, SPS_C_JobTrimReqIdRequest, SPS_C_JobTrimRequest, SPS_R_JobRequestedTrimItemsModel, SPS_R_JobRequestedTrimsModel, SPS_R_JobRequestedTrimsResponse, StockCodesRequest, StockObjectInfoModel, SPS_C_ProcJobNumberRequest, SPS_RequestDetailsModelResponse, SPS_RequestDetailsModel, TrimStatusEnum, KMS_C_JobMainMaterialReqIdRequest, SPS_C_InvOutConfirmationRequest, SPS_R_InvOutItemsForConfirmationIdResponse, SPS_R_InvOutItemsForConfirmationIdModel, SPS_R_InvOutItemsForConfirmationIdItemModel, SPS_R_InvOutItemsForConfirmationIdIdBundleModel, SPS_R_JobInfoDetailedResponse, INV_C_InvCheckForProcTypeAndBundlesRequest, INV_C_InvCheckBundleModel, INV_C_InvCheckForProcTypeAndBundlesModel, INV_R_InvCheckForProcTypeBundlesResponse, INV_R_InvCheckForProcTypeBundlesModel, INV_R_InvCheckForBundlesModel, INV_C_InvOutAllocIdRequest, INV_R_InvOutAllocationInfoAndBundlesResponse, WhRequestStatusEnum, INV_R_InvOutAllocationBundleModel, WMS_C_IssuanceIdRequest, WMS_R_IssuanceIdItemsResponse, WMS_R_IssuanceIdItemsModel, PTS_C_ProductionJobNumberRequest } from "@xpparel/shared-models";
import { FgCreationService, InvIssuanceService, PackingListService, WmsKnitItemRequestService, WmsSpsTrimRequestService } from "@xpparel/shared-services";
import { DataSource, In } from "typeorm";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { PoWhJobMaterialEntity } from "../entities/po-wh-job-material-entity";
import { PoWhRequestEntity } from "../entities/po-wh-request-entity";
import { PoWhRequestHistoryEntity } from "../entities/po-wh-request-history.entity";
import { PoWhRequestLineEntity } from "../entities/po-wh-request-line-entity";
import { PoWhRequestMaterialItemEntity } from "../entities/po-wh-request-material-item-entity";
import { PoWhJobMaterialRepository } from "../entities/repository/po-wh-job-material-repo";
import { PoWhRequestRepository } from "../entities/repository/po-wh-request.repo";
import { ProductSubLineFeaturesRepository } from "../entities/repository/product-sub-line-features.repo";
import { PoWhRequestLineRepository } from "../entities/repository/po-wh-request-line.repo";
import { PoWhRequestMaterialItemRepository } from "../entities/repository/po-wh-request-item.repo";
import { PoSubLineBundleRepository } from "../entities/repository/po-sub-line-bundle.repo";
import moment from "moment";
import { SJobLinePlanEntity } from "../entities/s-job-line-plan";
import { SJobLinePlanRepo } from "../entities/repository/s-job-line-plan.repository";
import { SJobLineRepo } from "../entities/repository/s-job-line.repository";
import { SJobSubLineRepo } from "../entities/repository/s-job-sub-line.repository";
import { ProcessingJobsService } from "./processing-jobs.service";
import { PoWhRequestIssuanceRepository } from "../entities/repository/po-wh-issuance-repo";
import { PoWhIssuanceEntity } from "../entities/po-wh-issuance-entity";
import { PoWhRequestMaterialItemHistoryEntity } from "../entities/po-wh-request-material-item-history-entity";
import { PoWhJobMaterialIssuanceEntity } from "../entities/po-wh-job-material-issuance-entity";
import { SJobBundleRepository } from "../entities/repository/s-job-bundle.repository";
import { ProcessingOrderRepository } from "../entities/repository/processing-order.repo";
import { SJobPslRepository } from "../entities/repository/s-job-psl.repository";
import { SJobBundleEntity } from "../entities/s-job-bundle.entity";
import { SJobPslEntity } from "../entities/s-job-psl-entity";
import { SJobLineOperationsEntity } from "../entities/s-job-line-operations";
import { SJobLineOperationsRepo } from "../entities/repository/s-job-line-operations";
import { SJobLineEntity } from "../entities/s-job-line.entity";
const util = require('util');
@Injectable()
export class PJMaterialAllocationService {
    constructor(
        private dataSource: DataSource,
        private jobWhMaterialRepo: PoWhJobMaterialRepository,
        private poSubLineFeaturesRepo: ProductSubLineFeaturesRepository,
        private poWhRequestRepo: PoWhRequestRepository,
        private poWhReqLineRepo: PoWhRequestLineRepository,
        private poWhReqMaterialRepo: PoWhRequestMaterialItemRepository,
        private packListService: PackingListService,
        private poSubLineBundle: PoSubLineBundleRepository,
        private wmsService: WmsSpsTrimRequestService,
        private jobPlanRepo: SJobLinePlanRepo,
        private jobLineRepo: SJobLineRepo,
        private processJObService: ProcessingJobsService,
        private inventoryService: InvIssuanceService,
        private issuanceRepo: PoWhRequestIssuanceRepository,
        private sJobBundleRepo: SJobBundleRepository,
        private poRepo: ProcessingOrderRepository,
        private jobPslMap: SJobPslRepository,
        private jobLineOpRepo: SJobLineOperationsRepo,
        private fgCreationService: FgCreationService
    ) { }

    /**
     * TODO: items , VPO AND supplier also should integrate with masters
     * @param req 
     * @returns 
     */
    async saveTrimReqForSewingJob(req: SPS_C_JobTrimRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        const { unitCode, companyCode, username, jobNumber, userId } = req;
        try {
            let processingSerial: number = null;
            let processType: ProcessTypeEnum = null;
            const processingJobInfo = await this.jobWhMaterialRepo.find({ where: { jobNumber, unitCode, companyCode, isActive: true, isRequestNeeded: true, itemType: PhItemCategoryEnum.TRIM } });
            if (processingJobInfo.length === 0) {
                throw new ErrorResponse(0, 'Processing jobs information not found. Please check and try again');
            }
            const jobPlanInfo = await this.jobPlanRepo.findOne({ where: { jobNumber, unitCode, companyCode }, select: ['rawMaterialStatus'] });
            if (jobPlanInfo.rawMaterialStatus != TrimStatusEnum.OPEN) {
                throw new ErrorResponse(0, 'BOM Not required / Already been requested for this job. Please check and try again');
            };
            processingSerial = processingJobInfo[0].processingSerial;
            processType = processingJobInfo[0].processType;
            // Material requested vs required quantity validation
            const materialObj = new Map<string, { requiredQty: number, allocatedQty: number, issuedQty: number, totalPerPieceConsumption: number }>();
            const itemSizesMap = new Map<string, PoWhJobMaterialEntity[]>();
            for (const processingJobObj of processingJobInfo) {
                if (!materialObj.has(processingJobObj.itemCode)) {
                    materialObj.set(processingJobObj.itemCode, { requiredQty: 0, allocatedQty: 0, issuedQty: 0, totalPerPieceConsumption: 0 });
                    itemSizesMap.set(processingJobObj.itemCode, []);
                }
                const obj = materialObj.get(processingJobObj.itemCode);
                materialObj.set(processingJobObj.itemCode, { requiredQty: obj.requiredQty + processingJobObj.requiredQty, allocatedQty: obj.allocatedQty + processingJobObj.allocatedQty, issuedQty: obj.issuedQty + processingJobObj.issuedQty, totalPerPieceConsumption: obj.totalPerPieceConsumption + processingJobObj.consumption });
                itemSizesMap.get(processingJobObj.itemCode).push(processingJobObj);
            }
            // summing item wise requested quantity
            const itemAndQuantityMap = new Map<string, number>();
            req.items.forEach(item => {
                if (!itemAndQuantityMap.has(item.itemCode)) {
                    itemAndQuantityMap.set(item.itemCode, item.requestingQty);
                } else {
                    itemAndQuantityMap.set(item.itemCode, itemAndQuantityMap.get(item.itemCode) + item.requestingQty);
                }
            });

            // checking original required quantity vs requested quantity
            for (const [itemCode, quantity] of itemAndQuantityMap) {
                if (!materialObj.has(itemCode)) {
                    throw new ErrorResponse(0, `Material ${itemCode} information not found. Please check and try again`);
                }
                if (quantity > materialObj.get(itemCode).requiredQty) {
                    throw new ErrorResponse(0, `Material ${itemCode} requested quantity is more than required quantity. Please check and try again`);
                } else {
                    if (quantity > materialObj.get(itemCode).requiredQty - materialObj.get(itemCode).allocatedQty) {
                        throw new ErrorResponse(0, `Material ${itemCode} requested quantity is more than allocated quantity. Please check and try again`);
                    }
                }
            }

            //checking inventory for given item with OMS
            const wmsLeftOverQtyMap = new Map<string, number>()
            const wmsInventoryMap = new Map<string, StockObjectInfoModel[]>()

            //get MO numbers to call WMS
            const moNumbersForJobs = await this.getMoNumbersForJobNumber([req.jobNumber], unitCode, companyCode);
            if (moNumbersForJobs.size == 0) {
                throw new ErrorResponse(0, `Problem while finding the associated MO Numbers for the sewing job. Please check with the support team`);
            }
            //group all ph item lines of particular item code and validate wms quantity
            const itemCodeDetailMap = new Map<string, { itemName: string, itemDescription: string, itemColor: string, itemType: string }>();
            for (const [itemCode, quantity] of itemAndQuantityMap) {
                const stockCodesRequest = new StockCodesRequest(req.username, req.unitCode, req.companyCode, req.userId, itemCode, [], [], Array.from(moNumbersForJobs));
                const inventoryDetails = await this.packListService.getInStockObjectsForItemCode(stockCodesRequest);
                if (!inventoryDetails.status) {
                    throw new ErrorResponse(inventoryDetails.errorCode, inventoryDetails.internalMessage);
                }
                let isFinalItemAdded = false;
                for (const phItemDat of inventoryDetails.data) {
                    if (!wmsLeftOverQtyMap.has(phItemDat.itemCode)) {
                        wmsInventoryMap.set(phItemDat.itemCode, []);
                        wmsLeftOverQtyMap.set(phItemDat.itemCode, 0);
                        itemCodeDetailMap.set(phItemDat.itemCode, { itemName: phItemDat.itemName, itemDescription: phItemDat.itemDesc, itemColor: phItemDat.itemColor, itemType: phItemDat.objectType });
                    }
                    wmsLeftOverQtyMap.set(phItemDat.itemCode, wmsLeftOverQtyMap.get(phItemDat.itemCode) + phItemDat.leftOverQuantity);
                    if (wmsLeftOverQtyMap.get(phItemDat.itemCode) < quantity) {
                        wmsInventoryMap.get(phItemDat.itemCode).push(phItemDat);
                    } else {
                        if (!isFinalItemAdded) {
                            wmsInventoryMap.get(phItemDat.itemCode).push(phItemDat);
                            isFinalItemAdded = true;
                            break;
                        }
                    }
                };
                if (wmsLeftOverQtyMap.get(itemCode) < quantity) {
                    throw new ErrorResponse(0, `Material ${itemCode} requested quantity is more than available quantity. Please check and try again`);
                }
            }
            const existingJobs: number = await this.poWhRequestRepo.count({ where: { processingSerial, unitCode, companyCode, processType, isActive: true } });
            // insert a new records into wh_mat_request ** dummy
            await transManager.startTransaction();
            const materialReqHead = new PoWhRequestEntity();
            materialReqHead.companyCode = companyCode;
            materialReqHead.createdUser = username;
            materialReqHead.requestType = MaterialRequestTypeEnum.RM;
            materialReqHead.processType = processType;
            materialReqHead.processingSerial = processingSerial;
            materialReqHead.planCloseDate = req.expectedFulFillMentDate;
            materialReqHead.sla = 0;
            materialReqHead.requestCode = `WR-${ProcessTypeEnum.SEW}-${processingSerial}-${existingJobs + 1}`;
            materialReqHead.requestedBy = username;
            materialReqHead.unitCode = unitCode;
            const materialReqInfo = await transManager.getRepository(PoWhRequestEntity).save(materialReqHead);
            // insert a new records into wh_mat_request_history
            const materialReqHeadHistory = new PoWhRequestHistoryEntity();
            materialReqHeadHistory.companyCode = companyCode;
            materialReqHeadHistory.createdUser = username;
            materialReqHeadHistory.requestType = MaterialRequestTypeEnum.RM;
            materialReqHeadHistory.processType = processType;
            materialReqHeadHistory.processingSerial = processingSerial;
            materialReqHeadHistory.planCloseDate = req.expectedFulFillMentDate;
            materialReqHeadHistory.sla = 0;
            materialReqHeadHistory.requestCode = `WR-${ProcessTypeEnum.SEW}-${processingSerial}-${existingJobs + 1}`;
            materialReqHeadHistory.requestedBy = username;
            materialReqHeadHistory.unitCode = unitCode;
            // await transManager.getRepository(PoWhRequestHistoryEntity).save(materialReqHeadHistory);
            for (const [itemCode, wmsInventory] of wmsInventoryMap) {
                for (const sizeWiseQty of itemSizesMap.get(itemCode)) {
                    //insert wh_mat_request_line for size color and item combination
                    const whRequestLineEntity = new PoWhRequestLineEntity();
                    whRequestLineEntity.companyCode = companyCode;
                    whRequestLineEntity.createdUser = username;
                    whRequestLineEntity.itemCode = itemCode;
                    whRequestLineEntity.itemColor = 'NA';
                    whRequestLineEntity.itemDescription = 'NA';
                    whRequestLineEntity.itemName = 'NA';
                    whRequestLineEntity.itemType = PhItemCategoryEnum.TRIM;
                    whRequestLineEntity.jobNumber = jobNumber;
                    whRequestLineEntity.processType = processType;
                    whRequestLineEntity.fgColor = sizeWiseQty.fgColor;
                    whRequestLineEntity.productRef = sizeWiseQty.productRef;
                    whRequestLineEntity.size = sizeWiseQty.size;
                    whRequestLineEntity.itemCode = itemCode;
                    whRequestLineEntity.processingSerial = processingSerial;
                    whRequestLineEntity.requiredQty = sizeWiseQty.requiredQty;
                    whRequestLineEntity.poWhRequestId = materialReqInfo.id;
                    whRequestLineEntity.unitCode = unitCode;
                    whRequestLineEntity.companyCode = companyCode;
                    whRequestLineEntity.subProcessName = sizeWiseQty.subProcessName;
                    whRequestLineEntity.processType = sizeWiseQty.processType;
                    whRequestLineEntity.bomItemType = sizeWiseQty.bomItemType;

                    const whMatItemEntities: PoWhRequestMaterialItemEntity[] = [];
                    let allocatedQty = 0;
                    for (const eachObject of wmsInventory) {
                        if (eachObject.leftOverQuantity > 0) {
                            const allowableQty = Math.min(eachObject.leftOverQuantity, sizeWiseQty.requiredQty);
                            allocatedQty += allowableQty;
                            const whReqLineItem = new PoWhRequestMaterialItemEntity();
                            whReqLineItem.allocatedQty = allowableQty;
                            whReqLineItem.companyCode = companyCode;
                            whReqLineItem.createdUser = username;
                            whReqLineItem.issuedQty = 0;
                            whReqLineItem.itemCode = itemCode;
                            whReqLineItem.itemColor = sizeWiseQty.itemColor;
                            whReqLineItem.itemDescription = sizeWiseQty.itemDescription;
                            whReqLineItem.itemName = sizeWiseQty.itemName;
                            whReqLineItem.itemType = sizeWiseQty.itemType;
                            whReqLineItem.locationCode = eachObject.locationCode;
                            whReqLineItem.objectCode = eachObject.barcode;
                            whReqLineItem.objectType = eachObject.objectType;
                            whReqLineItem.supplierCode = eachObject.supplierCode;
                            whReqLineItem.unitCode = unitCode;
                            whReqLineItem.vpo = eachObject.vpo;
                            whReqLineItem.poWhRequestId = materialReqInfo.id;
                            whReqLineItem.bomItemType = sizeWiseQty.bomItemType;
                            whReqLineItem.locationCode = 'NA';
                            whReqLineItem.vpo = 'NA';
                            whReqLineItem.requiredQty = allowableQty;
                            eachObject.leftOverQuantity -= allowableQty;
                            whMatItemEntities.push(whReqLineItem);
                        }
                    };
                    if (allocatedQty > 0) {
                        whRequestLineEntity.allocatedQty = allocatedQty;
                        const phReqLines = await transManager.getRepository(PoWhRequestLineEntity).save(whRequestLineEntity);
                        for (const eachObj of whMatItemEntities) {
                            eachObj.poWhRequestLineId = phReqLines.id;
                        }
                        await transManager.getRepository(PoWhRequestMaterialItemEntity).save(whMatItemEntities, { reload: false });
                        await transManager.getRepository(PoWhJobMaterialEntity).update({ id: sizeWiseQty.id }, { allocatedQty: Number(sizeWiseQty.allocatedQty) + Number(allocatedQty) });
                    }
                }
            }
            await transManager.getRepository(SJobLinePlanEntity).update({ jobNumber: req.jobNumber, unitCode, companyCode }, { rawMaterialStatus: TrimStatusEnum.REQUESTED, updatedUser: username });
            await transManager.completeTransaction();
            // Need to send the request details to WMS
            const reqIdObj = new SPS_C_JobTrimReqIdRequest(username, unitCode, companyCode, userId, materialReqInfo.id);
            await this.wmsService.allocateSTrimsForAJobByRequestId(reqIdObj);
            return new GlobalResponseObject(true, 0, 'Material Requested Successfully');
        } catch (err) {
            console.log(err);
            await transManager.releaseTransaction();
            throw err;
        }
    }


    async getMoNumbersForJobNumber(jobNumbers: string[], unitCode: string, companyCode: string): Promise<Set<string>> {
        const moNumberSet = new Set<string>();
        const jobLineRecs = await this.jobLineRepo.find({ select: ['id'], where: { companyCode, unitCode, jobNumber: In(jobNumbers) } });
        const jobLineIds = jobLineRecs.map(r => r.id);
        if (jobLineIds.length > 0) {
            const moProductSubLineDetails = await this.jobPslMap.find({ where: { jobNumber: In(jobNumbers), unitCode, companyCode }, select: ['moProductSubLineId', 'processingSerial'] });
            if (!moProductSubLineDetails.length) {
                throw new ErrorResponse(0, 'Product sub line details not found for the given jobs ')
            }
            const moProductSubLineIds = new Set<number>();
            moProductSubLineDetails.forEach(id => moProductSubLineIds.add(id.moProductSubLineId));
            const processingSerial = moProductSubLineDetails[0].processingSerial;
            const subLineDetails = await this.poSubLineFeaturesRepo.find({ where: { moProductSubLineId: In(Array.from(moProductSubLineIds)), unitCode, companyCode, processingSerial }, select: ['moNumber'] });
            for (const eachSubLine of subLineDetails) {
                moNumberSet.add(eachSubLine.moNumber);
            }
        }
        return moNumberSet;
    }

    async getRequestedTrimMaterialForReqId(req: SPS_C_JobTrimReqIdRequest): Promise<SPS_R_JobRequestedTrimsResponse> {
        const { companyCode, unitCode } = req;
        const materialReqInfo = await this.poWhRequestRepo.findOne({ where: { id: req.reqId, companyCode, unitCode } });
        if (!materialReqInfo) {
            throw new ErrorResponse(1213, 'Details not found with given criteria');
        }
        const jobsWhResp: SPS_R_JobRequestedTrimsModel[] = [];
        const whLines = await this.poWhReqLineRepo.find({ where: { poWhRequestId: materialReqInfo.id } });
        for (const line of whLines) {
            const items = await this.poWhReqMaterialRepo.find({ where: { poWhRequestLineId: line.id } });
            const moNumbers = await this.getMoNumbersForJobNumber([line.jobNumber], unitCode, companyCode);
            if (!moNumbers.size) {
                throw new ErrorResponse(0, `Mo Not found for the job ${line.jobNumber}`)
            };
            const lineItems = await this.poWhReqMaterialRepo.find({ where: { poWhRequestLineId: line.id, unitCode, companyCode }, select: ['objectCode', 'allocatedQty', 'itemCode'] });
            jobsWhResp.push(new SPS_R_JobRequestedTrimsModel(line.jobNumber, Array.from(moNumbers)[0], materialReqInfo.planCloseDate, materialReqInfo.createdUser, materialReqInfo.requestCode, materialReqInfo.createdAt, lineItems.map(rec => new SPS_R_JobRequestedTrimItemsModel(rec.itemCode, rec.objectCode, rec.allocatedQty))));
        }
        return new SPS_R_JobRequestedTrimsResponse(true, 0, 'Date retrieved successfully', jobsWhResp);
    }

    // Called from INVS to get the requested material(bundles) under a request id
    async getRequestedSFGItemsForReqId(req: SPS_C_InvOutConfirmationRequest): Promise<SPS_R_InvOutItemsForConfirmationIdResponse> {
        const { companyCode, unitCode, reqId } = req;
        const materialReqInfo = await this.poWhRequestRepo.findOne({ select: ['id', 'processType', 'processingSerial'], where: { id: req.reqId, companyCode, unitCode, requestType: MaterialRequestTypeEnum.ITEM_SKU } });
        if (!materialReqInfo) {
            throw new ErrorResponse(1213, `No Panel requests found for the given id : ${reqId} and type : ${MaterialRequestTypeEnum.ITEM_SKU}`);
        }
        const m2s: SPS_R_InvOutItemsForConfirmationIdItemModel[] = [];
        const items = await this.poWhReqLineRepo.find({ select: ['id', 'itemCode', 'itemName', 'bomItemType', 'processType', 'jobNumber'], where: { poWhRequestId: materialReqInfo.id, companyCode, unitCode } });
        for (const item of items) {
            const bundles = await this.poWhReqMaterialRepo.find({ select: ['requiredQty', 'objectCode'], where: { poWhRequestLineId: item.id, companyCode, unitCode } });
            if (bundles.length == 0) {
                throw new ErrorResponse(0, `No bundles requested for the item : $${item.itemCode} and request id : ${materialReqInfo.id}`);
            }
            const bundleBrcds = bundles.map(r => r.objectCode);

            // const bundleRecs = await this.poSubLineBundle.find({ select: ['moProductSubLineId', 'bundleNumber', 'quantity'], where: { companyCode, unitCode, bundleNumber: In(bundleBrcds) } });
            const sJobRec = await this.jobLineRepo.findOne({select: ['id'], where: {companyCode, unitCode, jobNumber: item.jobNumber}});
            const bundleRecs = await this.sJobBundleRepo.find({select: ['moProductSubLineId', 'qty', 'bundleNumber'], where: {companyCode, unitCode, sJobLineId: sJobRec.id }});
            const bunOslMap = new Map<string, { pslId: number, qty: number }>();
            bundleRecs.forEach(r => bunOslMap.set(r.bundleNumber, { pslId: r.moProductSubLineId, qty: Number(r.qty) }));
            const m3s: SPS_R_InvOutItemsForConfirmationIdIdBundleModel[] = [];
            bundles.forEach(r => {
                const inf = bunOslMap.get(r.objectCode);
                if (!inf) {
                    throw new ErrorResponse(0, `Error: Bundle: ${r.objectCode} requested for this job is not actually mapped to the job : ${item.jobNumber}`);
                }
                const m3 = new SPS_R_InvOutItemsForConfirmationIdIdBundleModel(inf.pslId, inf.qty, r.requiredQty, r.objectCode);
                m3s.push(m3);
            });
            const m2 = new SPS_R_InvOutItemsForConfirmationIdItemModel(item.itemCode, item.processType, m3s);
            m2s.push(m2);
        }
        const m1 = new SPS_R_InvOutItemsForConfirmationIdModel(materialReqInfo.processingSerial, materialReqInfo.processType, m2s);
        return new SPS_R_InvOutItemsForConfirmationIdResponse(true, 0, 'Requested bundles retrieved', m1);
    }

    async saveBankReqForSewingJob(req: SPS_C_JobTrimRequest): Promise<GlobalResponseObject> {
        const { jobNumber, unitCode, companyCode, userId, username } = req;
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            const jobLineInfo = await this.jobLineRepo.findOne({ where: { jobNumber, unitCode, companyCode }, select: ['id', 'processingSerial', 'processType'] });
            if (!jobLineInfo) {
                throw new ErrorResponse(0, 'Job Details not found. Please check and try again')
            };
            const processingSerial = jobLineInfo.processingSerial;
            const processingSerialInfo = await this.poRepo.findOne({ where: { processingSerial, unitCode, companyCode, isActive: true } });
            if (!processingSerialInfo) {
                throw new ErrorResponse(0, 'Processing Serial Info not found please check and try again');
            }
            const isActual = processingSerialInfo.isActualTracking;
            const processType = jobLineInfo.processType;
            const dependentBankItems = await this.jobWhMaterialRepo.find({ where: { jobNumber, unitCode, companyCode, isRequestNeeded: true } });
            if (!dependentBankItems.length) {
                throw new ErrorResponse(0, 'BOM details not found for the given job. Please check and try again');
            }
            const jobPlanInfo = await this.jobPlanRepo.findOne({ where: { jobNumber, unitCode, companyCode } });
            if (jobPlanInfo.itemSkuStatus != TrimStatusEnum.OPEN) {
                // throw new ErrorResponse(0, 'BOM Not required / Already been requested for this job. Please check and try again');
            };
            const processJobReq = new SPS_C_ProcJobNumberRequest(username, unitCode, companyCode, userId, jobNumber, false, true, true, true, true, true);
            const jobInfoWithBundles: SPS_R_JobInfoDetailedResponse = await this.processJObService.getJobInfoByJobNumber(processJobReq);
            const pslToColorSizeMap = new Map<number, { color: string; size: string }>();

            const bundleMap: Record<number, INV_C_InvCheckBundleModel[]> = {};
            const _jobData = jobInfoWithBundles.data[0];

            // PSLB
            const pslWiseRequiredQty = new Map<number, number>();
            const pslWiseAllocatedQty = new Map<number, number>()
            const jobPslInfo = await this.jobPslMap.find({ where: { jobNumber, unitCode, companyCode, isActive: true } });
            for (const eachPsl of jobPslInfo) {
                if (!pslWiseRequiredQty.has(eachPsl.moProductSubLineId)) {
                    pslWiseRequiredQty.set(eachPsl.moProductSubLineId, 0);
                    pslWiseAllocatedQty.set(eachPsl.moProductSubLineId, 0);
                }
                const preReqQty = pslWiseRequiredQty.get(eachPsl.moProductSubLineId);
                pslWiseRequiredQty.set(eachPsl.moProductSubLineId, preReqQty + Number(eachPsl.quantity) - (Number(eachPsl.cancelledQuantity) - Number(eachPsl.reJobGenQty)));
            }
            if (isActual) {
                for (const bundle of req.requestingBundlesInfo) {
                    if (!bundleMap[bundle.pslId]) {
                        bundleMap[bundle.pslId] = [];
                        const plsDetails = await this.poSubLineFeaturesRepo.findOne({ where: { processingSerial, moProductSubLineId: bundle.pslId, unitCode, companyCode } });
                        pslToColorSizeMap.set(Number(bundle.pslId), { color: plsDetails.fgColor, size: plsDetails.size });
                    }
                    const bundleModel = new INV_C_InvCheckBundleModel();
                    bundleModel.bunBarcode = bundle.bunBarcode;
                    bundleModel.rQty = bundle.rQty;
                    bundleMap[Number(bundle.pslId)].push(bundleModel);
                }
            } else {
                _jobData.bundlesInfo.forEach(bundle => {
                    if (!bundleMap[bundle.pslId]) bundleMap[bundle.pslId] = [];
                    const bundleModel = new INV_C_InvCheckBundleModel();
                    bundleModel.bunBarcode = bundle.bunBrcd;
                    bundleModel.rQty = bundle.qty;
                    bundleMap[Number(bundle.pslId)].push(bundleModel);
                });
                _jobData.colorSizeQty.forEach(entry => {
                    entry.pslIds.forEach(pslId => {
                        pslToColorSizeMap.set(Number(pslId), { color: entry.color, size: entry.size });
                    });
                });
            };

            // Calculate current requesting quantity for each PSLB. to verify that it matches with the PSLB requred quantity or not. If both are equal then its ok. other wise we need to cut down the sewing job quantity for each PSLB
            Object.entries(bundleMap).map(([pslIdStr, bundles]) => {
                const pslId = Number(pslIdStr);
                if (!pslWiseAllocatedQty.has(pslId)) {
                    throw new ErrorResponse(0, `Job PSL does not matches with requested bundle PSL. Not matched pls is ${pslId}`);
                }
                for (const eachBundle of bundles) {
                    const pslAllocatedQtyInfo = pslWiseAllocatedQty.get(pslId);
                    pslWiseAllocatedQty.set(pslId, pslAllocatedQtyInfo + eachBundle.rQty);
                }
            });

            // Need to get the remaining qty to fill that psl id and in the case of remaining qty we have to consider those as cancelled qty and need to update accordingly

            const pslRemainingQtyMap = new Map<number, number>();
            for (const [pslId, requiredQty] of pslWiseRequiredQty) {
                const allocatedQtyOfPsl = pslWiseAllocatedQty.get(pslId);
                if (requiredQty > allocatedQtyOfPsl) {
                    pslRemainingQtyMap.set(pslId, (requiredQty - allocatedQtyOfPsl));
                }
            }
            const procTypeBundles: INV_C_InvCheckForProcTypeAndBundlesModel[] = [];
            if (!isActual) {
                Object.entries(bundleMap).map(([pslIdStr, bundles]) => {
                    const pslId = Number(pslIdStr);
                    const colorSizeMatch = _jobData.colorSizeQty.find(cs => cs.pslIds.includes(pslId));
                    if (colorSizeMatch) {
                        const skuInfo = _jobData.jobDepSkuInfo.forEach(sku => {
                            if (sku.color === colorSizeMatch.color && sku.size === colorSizeMatch.size) {
                                procTypeBundles.push({ processType: sku.depProcType, itemSku: sku.itemSku, bundles: bundles });
                            }
                        })
                    }
                });
            } else {
                Object.entries(bundleMap).map(([pslIdStr, bundles]) => {
                    _jobData.jobDepSkuInfo.forEach(sku => {
                        procTypeBundles.push({ processType: sku.depProcType, itemSku: sku.itemSku, bundles: [...bundles] });
                    });
                });
            };
            const request = new INV_C_InvCheckForProcTypeAndBundlesRequest(username, unitCode, companyCode, userId, procTypeBundles, true);
            // console.log(request);
            const response: INV_R_InvCheckForProcTypeBundlesResponse = await this.inventoryService.getInventoryForGivenBundlesAndProcessTypes(request);
            if (!response.status) {
                throw new ErrorResponse(response.errorCode, `IMS Says ${response.internalMessage}`);
            };
            const actInventoryInfo: INV_R_InvCheckForProcTypeBundlesModel[] = response.data;
            const colorSizeWiseBundlesMap = new Map<string, Map<string, INV_R_InvCheckForBundlesModel[]>>()
            for (const eachProcessTypeBundle of procTypeBundles) {
                // console.log(util.inspect(eachProcessTypeBundle, false, null, true));
                const processTypeInv = actInventoryInfo.filter(inv => inv.processType == eachProcessTypeBundle.processType);
                if (!processTypeInv) {
                    throw new ErrorResponse(0, `Dependent Process Type ${eachProcessTypeBundle.processType} is not found in the inventory`)
                };
                const allProcessTypeInvBundles: INV_R_InvCheckForBundlesModel[] = [];
                for (const eachObj of processTypeInv) {
                    allProcessTypeInvBundles.push(...eachObj.bundles);
                }
                for (const eachBundle of eachProcessTypeBundle.bundles) {
                    const bundleInfo = allProcessTypeInvBundles.find(bun => bun.bunBarcode == eachBundle.bunBarcode);
                    if (!bundleInfo) {
                        throw new ErrorResponse(0, `Dependent Process Type ${eachProcessTypeBundle.processType} and bundle ${eachBundle.bunBarcode} is not found in the inventory`)
                    }
                    if (eachBundle.rQty != bundleInfo.avlQty) {
                        throw new ErrorResponse(0, `Dependent Process Type ${eachProcessTypeBundle.processType} and bundle ${eachBundle.bunBarcode} is not having enough inventory`)
                    };
                    // const bundleActInfo = await this.poSubLineBundle.findOne({ where: { bundleNumber: eachBundle.bunBarcode, unitCode, companyCode } });
                    // const pslInfoOfBarode = 
                    const poSubLineFeatures = await this.poSubLineFeaturesRepo.findOne({ where: { moProductSubLineId: bundleInfo.pslId, unitCode, companyCode } });
                    if (!colorSizeWiseBundlesMap.has(poSubLineFeatures.fgColor)) {
                        colorSizeWiseBundlesMap.set(poSubLineFeatures.fgColor, new Map<string, INV_R_InvCheckForBundlesModel[]>());
                    }
                    if (!colorSizeWiseBundlesMap.get(poSubLineFeatures.fgColor).has(poSubLineFeatures.size)) {
                        colorSizeWiseBundlesMap.get(poSubLineFeatures.fgColor).set(poSubLineFeatures.size, [])
                    };
                    colorSizeWiseBundlesMap.get(poSubLineFeatures.fgColor).get(poSubLineFeatures.size).push(bundleInfo);
                }
            };
            const existingJobs: number = await this.poWhRequestRepo.count({ where: { processingSerial, unitCode, companyCode, processType, isActive: true } });
            // insert a new records into wh_mat_request ** dummy
            await transManager.startTransaction();
            const materialReqHead = new PoWhRequestEntity();
            materialReqHead.companyCode = companyCode;
            materialReqHead.createdUser = username;
            materialReqHead.requestType = MaterialRequestTypeEnum.ITEM_SKU;
            materialReqHead.processType = processType;
            materialReqHead.processingSerial = processingSerial;
            materialReqHead.planCloseDate = req.expectedFulFillMentDate;
            materialReqHead.sla = 0;
            materialReqHead.requestCode = `WR-${processingSerial}-${existingJobs + 1}`;
            materialReqHead.requestedBy = username;
            materialReqHead.unitCode = unitCode;
            const materialReqInfo = await transManager.getRepository(PoWhRequestEntity).save(materialReqHead);
            for (const eachProcessTypeBundle of actInventoryInfo) {
                const depProcessTypeInfoOfJob = dependentBankItems.filter(pt => (pt.depProcessType == eachProcessTypeBundle.processType));
                if (!depProcessTypeInfoOfJob.length) {
                    throw new ErrorResponse(0, `Process type ${eachProcessTypeBundle.processType} is not actually the dependency for the given job. Please check and try again`)
                }
                for (const eachSizeInfo of depProcessTypeInfoOfJob) {
                    const colorSizeWiseBundles: INV_R_InvCheckForBundlesModel[] = colorSizeWiseBundlesMap.get(eachSizeInfo.fgColor)?.get(eachSizeInfo.size);
                    const whRequestLineEntity = new PoWhRequestLineEntity();
                    whRequestLineEntity.companyCode = companyCode;
                    whRequestLineEntity.createdUser = username;
                    whRequestLineEntity.itemCode = eachSizeInfo.itemCode;
                    whRequestLineEntity.itemColor = eachSizeInfo.itemCode;
                    whRequestLineEntity.itemDescription = eachSizeInfo.itemCode;
                    whRequestLineEntity.itemName = eachSizeInfo.itemCode;
                    whRequestLineEntity.itemType = PhItemCategoryEnum.TRIM;
                    whRequestLineEntity.jobNumber = jobNumber;
                    whRequestLineEntity.processType = processType;
                    whRequestLineEntity.fgColor = eachSizeInfo.fgColor;
                    whRequestLineEntity.productRef = eachSizeInfo.productRef;
                    whRequestLineEntity.size = eachSizeInfo.size;
                    whRequestLineEntity.itemCode = eachSizeInfo.itemCode;
                    whRequestLineEntity.processingSerial = processingSerial;
                    whRequestLineEntity.requiredQty = eachSizeInfo.requiredQty;
                    whRequestLineEntity.poWhRequestId = materialReqInfo.id;
                    whRequestLineEntity.unitCode = unitCode;
                    whRequestLineEntity.companyCode = companyCode;
                    whRequestLineEntity.subProcessName = eachSizeInfo.depSubProcessName;
                    whRequestLineEntity.processType = eachSizeInfo.depProcessType;
                    whRequestLineEntity.bomItemType = eachSizeInfo.bomItemType;
                    const whMatItemEntities: PoWhRequestMaterialItemEntity[] = [];
                    let allocatedQty = 0;
                    for (const eachBundle of colorSizeWiseBundles) {
                        if (eachBundle.avlQty > 0) {
                            allocatedQty += eachBundle.avlQty;
                            const whReqLineItem = new PoWhRequestMaterialItemEntity();
                            whReqLineItem.allocatedQty = eachBundle.avlQty;
                            whReqLineItem.companyCode = companyCode;
                            whReqLineItem.createdUser = username;
                            whReqLineItem.issuedQty = 0;
                            whReqLineItem.itemCode = eachSizeInfo.itemCode;
                            whReqLineItem.itemColor = eachSizeInfo.itemColor;
                            whReqLineItem.itemDescription = eachSizeInfo.itemDescription;
                            whReqLineItem.itemName = eachSizeInfo.itemName;
                            whReqLineItem.itemType = eachSizeInfo.itemType;
                            whReqLineItem.locationCode = 'NA';
                            whReqLineItem.objectCode = eachBundle.bunBarcode;
                            whReqLineItem.objectType = eachSizeInfo.itemType;
                            whReqLineItem.supplierCode = 'NA';
                            whReqLineItem.unitCode = unitCode;
                            whReqLineItem.vpo = 'NA';
                            whReqLineItem.poWhRequestId = materialReqInfo.id;
                            whReqLineItem.bomItemType = eachSizeInfo.bomItemType;
                            whReqLineItem.locationCode = 'NA';
                            whReqLineItem.vpo = 'NA';
                            whReqLineItem.requiredQty = eachBundle.avlQty;
                            eachBundle.avlQty -= eachBundle.avlQty;
                            whMatItemEntities.push(whReqLineItem);
                        }
                        whRequestLineEntity.allocatedQty = allocatedQty;
                    };
                    whRequestLineEntity.allocatedQty = allocatedQty;
                    if (allocatedQty > 0) {
                        const phReqLines = await transManager.getRepository(PoWhRequestLineEntity).save(whRequestLineEntity);
                        whMatItemEntities.forEach((eachItem) => {
                            eachItem.poWhRequestLineId = phReqLines.id;
                        });
                        const updatableAllocatedQty = Number(eachSizeInfo.allocatedQty) + Number(allocatedQty);
                        const updateResult = await transManager.getRepository(PoWhJobMaterialEntity).update({ id: eachSizeInfo.id }, { allocatedQty: updatableAllocatedQty });
                        if (!updateResult.affected) {
                            throw new ErrorResponse(0, `Updating allocated quantity failed for id` + eachSizeInfo.id);
                        }
                    }
                    await transManager.getRepository(PoWhRequestMaterialItemEntity).save(whMatItemEntities, { reload: false });

                };
            };
            await transManager.getRepository(SJobLinePlanEntity).update({ jobNumber: req.jobNumber, unitCode, companyCode }, { itemSkuStatus: TrimStatusEnum.REQUESTED, updatedUser: username });

            // We need to insert the bundles for a job in the case of actual while material allocation it self 
            // Need to cut down the job quantities as well
            const jobBundlesObj: SJobBundleEntity[] = [];
            if (isActual) {
                Object.entries(bundleMap).forEach(async ([pslIdStr, bundles]) => {
                    for (const eachBundle of bundles) {
                        const colorInfo = pslToColorSizeMap.get(Number(pslIdStr))
                        const jobSubLineObj = new SJobBundleEntity();
                        jobSubLineObj.companyCode = companyCode;
                        jobSubLineObj.color = colorInfo.color;
                        jobSubLineObj.createdUser = username;
                        jobSubLineObj.qty = eachBundle.rQty;
                        jobSubLineObj.sJobLineId = jobLineInfo.id;
                        jobSubLineObj.size = colorInfo.size;
                        jobSubLineObj.unitCode = unitCode;
                        jobSubLineObj.bundleNumber = eachBundle.bunBarcode;
                        jobSubLineObj.moProductSubLineId = Number(pslIdStr);
                        jobSubLineObj.processingSerial = processingSerial;
                        jobSubLineObj.processType = processType;
                        jobBundlesObj.push(jobSubLineObj);
                    }
                });
                await this.cutDownTheJobQty(jobNumber, pslRemainingQtyMap, unitCode, companyCode, transManager, jobBundlesObj)
            };
            await transManager.completeTransaction();
            // TODO: BULL JOB
            if (jobBundlesObj.length > 0) {
                const jobHeaderInfo = await this.jobLineRepo.findOne({ where: { jobNumber, unitCode, companyCode }, select: ['sJobHeaderId'] });
                if (!jobHeaderInfo) {
                    throw new ErrorResponse(0, 'Job header information not found . Please check and try again')
                }
                const jobsRelatedToJobHeader: SJobLineEntity[] = await this.jobLineRepo.find({ where: { sJobHeaderId: jobHeaderInfo.sJobHeaderId, unitCode, companyCode } });
                for (const eachJobNumber of jobsRelatedToJobHeader) {
                    const jobNumReq = new PTS_C_ProductionJobNumberRequest(username, unitCode, companyCode, userId, eachJobNumber.jobNumber, processingSerial, processType);
                    this.fgCreationService.mapActualBundlesForJob(jobNumReq)
                }
            }
            // Need to send the request details to INVENTORY MANAGEMENT
            const reqIdObj = new SPS_C_InvOutConfirmationRequest(username, unitCode, companyCode, userId, materialReqInfo.id, processType, moment(req.expectedFulFillMentDate)?.format('YYYY-MM-DD HH:MM'), username);
            const responseFromInsp = await this.inventoryService.createInvOutRequestForOutConfirmationId(reqIdObj);
            if (!responseFromInsp.status) {
                throw new ErrorResponse(0, `INVS Says ${responseFromInsp.internalMessage}. Please contact support team.`)
            }
            return new GlobalResponseObject(true, 0, 'Request Saved Successfully')
        } catch (err) {
            await transManager.releaseTransaction();
            throw err;
        }
    }


    /**
     * Helper method to cut Down the job quantity because of un availability of bundles while allocation 
     * Need to cut down the quantities based on the psl qty
     * @param jobNumber 
     * @param plsQtyMap 
     * @param unitCode 
     * @param companyCode 
     * @param manager 
    */
    async cutDownTheJobQty(jobNumber: string, plsQtyMap: Map<number, number>, unitCode: string, companyCode: string, manager: GenericTransactionManager, jobBundles: SJobBundleEntity[]) {
        let totalCancelledQty = 0;
        // Have to update the cancelled quantity for all the sewing jobs related to this particular header since the material will be requested only for the first sub process of the process type
        const jobHeaderInfo = await this.jobLineRepo.findOne({ where: { jobNumber, unitCode, companyCode }, select: ['sJobHeaderId'] });
        if (!jobHeaderInfo) {
            throw new ErrorResponse(0, 'Job header information not found . Please check and try again')
        }
        const jobsRelatedToJobHeader: SJobLineEntity[] = await this.jobLineRepo.find({ where: { sJobHeaderId: jobHeaderInfo.sJobHeaderId, unitCode, companyCode } });
        const allActBundles = [];
        for (const eachJobNumber of jobsRelatedToJobHeader) {
            for (const [pslId, remainingQty] of plsQtyMap) {
                const jobPslInfo = await this.jobPslMap.findOne({ where: { jobNumber: eachJobNumber.jobNumber, moProductSubLineId: pslId, unitCode, companyCode } });
                if (!jobPslInfo) {
                    throw new ErrorResponse(0, `PSL ${pslId} Not found for the job ${eachJobNumber.jobNumber}`);
                };
                totalCancelledQty += remainingQty;
                const currentCancelledQty = jobPslInfo.cancelledQuantity;
                await manager.getRepository(SJobPslEntity).update({ id: jobPslInfo.id }, { cancelledQuantity: (currentCancelledQty + remainingQty) })
            };
            // Need to update this quantity in job line operations 
            const jobOperationsInfo = await this.jobLineOpRepo.findOne({ where: { jobNumber: eachJobNumber.jobNumber, unitCode, companyCode, isActive: true } });
            const jobQty = jobOperationsInfo.inputQty;
            await manager.getRepository(SJobLineOperationsEntity).update({ id: jobOperationsInfo.id }, { inputQty: (jobQty - totalCancelledQty) });
            for (const eachBundle of jobBundles) {
                const clonedObj: SJobBundleEntity = JSON.parse(JSON.stringify(eachBundle));
                clonedObj.sJobLineId = eachJobNumber.id;
                clonedObj.isActBun = true
                allActBundles.push(clonedObj);
            }
        };
        await manager.getRepository(SJobBundleEntity).save(allActBundles, {reload: false})
    }

    /**
     * Service to get the request details for the job
     * @param req 
     * @returns 
    */
    async getRequestDetailsForJob(req: SPS_C_ProcJobNumberRequest): Promise<SPS_RequestDetailsModelResponse> {
        const { jobNumber, unitCode, companyCode } = req;
        const rmWhReqDetails: SPS_RequestDetailsModel[] = [];
        const whReqDetails = await this.poWhReqLineRepo.find({ where: { jobNumber, unitCode, companyCode }, select: ['poWhRequestId'] });
        const requestIds = new Set<number>();
        whReqDetails.forEach((line) => {
            requestIds.add(line.poWhRequestId);
        });
        for (const eachReq of requestIds) {
            const requestDetails = await this.poWhRequestRepo.findOne({ where: { id: eachReq, unitCode, companyCode } })
            const reqDetails = new SPS_RequestDetailsModel(requestDetails.id, requestDetails.requestCode, moment(requestDetails.createdAt).format('YYYY-MM-DD HH:MM'), requestDetails.status, requestDetails.requestType);
            rmWhReqDetails.push(reqDetails);
        }
        return new SPS_RequestDetailsModelResponse(true, 0, 'RM warehouse request details retrieved successfully', rmWhReqDetails)
    }


    async issueMaterialForRequestId(req: INV_C_InvOutAllocIdRequest): Promise<GlobalResponseObject> {
        const { unitCode, companyCode, allocationId, userId, username, issuedBy, issuedDate } = req;
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            const issuanceCheck = await this.issuanceRepo.findOne({ where: { issuanceId: allocationId, unitCode, companyCode, requestType: MaterialRequestTypeEnum.ITEM_SKU } });
            if (issuanceCheck) {
                throw new ErrorResponse(0, 'Issuance details already captured. ')
            };
            const m1 = new INV_C_InvOutAllocIdRequest(username, unitCode, companyCode, 0, allocationId, issuedDate, issuedBy, true);
            const issuanceDetails: INV_R_InvOutAllocationInfoAndBundlesResponse = await this.inventoryService.getAllocatedInventoryForAllocationId(m1);
            if (!issuanceDetails.status) {
                throw new ErrorResponse(issuanceDetails.errorCode, issuanceDetails.internalMessage);
            };
            const actIssuanceData = issuanceDetails.data;
            const reqId = actIssuanceData[0].refId;
            const requestDetails = await this.poWhRequestRepo.findOne({ where: { id: reqId, unitCode, companyCode } });
            if (requestDetails.status != WhRequestStatusEnum.OPEN) {
                throw new ErrorResponse(0, 'Request already been issued . Please check and try again')
            };
            const processType = requestDetails.processType;
            const processingSerial = requestDetails.processingSerial;

            console.log(actIssuanceData);
            await transManager.startTransaction();
            const allocationEntity = new PoWhIssuanceEntity();
            allocationEntity.companyCode = companyCode;
            allocationEntity.createdUser = username;
            allocationEntity.issuanceId = allocationId;
            allocationEntity.processType = processType;
            allocationEntity.processingSerial = processingSerial;
            allocationEntity.requestCode = requestDetails.requestCode;
            allocationEntity.requestType = requestDetails.requestType;
            allocationEntity.status = WhRequestStatusEnum.ISSUED;
            allocationEntity.unitCode = unitCode;
            allocationEntity.whReqId = requestDetails.id;
            await transManager.getRepository(PoWhIssuanceEntity).save(allocationEntity, { reload: false });
            const jobNumbersAdded = new Set<string>();
            const whLineWiseIssuedQty = new Map<number, number>();
            const jobItemColorSizeQtyMap = new Map<string, Map<string, Map<string, Map<string, number>>>>();
            for (const eachIssuance of actIssuanceData) {
                const whReqDetails = await this.poWhRequestRepo.findOne({ where: { id: Number(reqId), unitCode, companyCode } });
                if (!whReqDetails) {
                    throw new ErrorResponse(0, 'Warehouse request not found for the given details. Please check and try again')
                }
                const itemSkuWiseBundles = new Map<string, INV_R_InvOutAllocationBundleModel[]>();
                for (const eachIssuance of actIssuanceData) {
                    for (const eachBundle of eachIssuance.bundles) {
                        if (!itemSkuWiseBundles.has(eachBundle.itemSku)) {
                            itemSkuWiseBundles.set(eachBundle.itemSku, []);
                        }
                        itemSkuWiseBundles.get(eachBundle.itemSku).push(eachBundle);
                    }
                };
                for (const [itemSku, bundlesInfo] of itemSkuWiseBundles) {
                    const whReqLineInfo = await this.poWhReqLineRepo.find({ where: { poWhRequestId: whReqDetails.id, unitCode, companyCode, itemCode: itemSku }, select: ['id'] });
                    if (!whReqLineInfo.length) {
                        throw new ErrorResponse(0, 'Request jobs not found for the given warehouse request id');
                    };
                    const allLines: number[] = [];
                    for (const eachWhReqLine of whReqLineInfo) {
                        allLines.push(eachWhReqLine.id);
                    };
                    for (const eachBundle of bundlesInfo) {
                        const objectRelatedLines = await this.poWhReqMaterialRepo.findOne({ where: { poWhRequestLineId: In(allLines), unitCode, companyCode, objectCode: eachBundle.bunBarcode } });
                        if (!objectRelatedLines) {
                            throw new ErrorResponse(0, 'Allocation data not found for the details ' + `${reqId} - ${eachBundle.itemSku} - ${eachBundle.bunBarcode}`);
                        };
                        const pendingToIssuance = eachBundle.iQty;
                        if (pendingToIssuance > 0) {
                            await transManager.getRepository(PoWhRequestMaterialItemEntity).update({ id: objectRelatedLines.id, unitCode, companyCode }, { issuedQty: pendingToIssuance, updatedUser: req.username });
                            if (!whLineWiseIssuedQty.has(objectRelatedLines.poWhRequestLineId)) {
                                whLineWiseIssuedQty.set(objectRelatedLines.poWhRequestLineId, 0);
                            }
                            const preQty = whLineWiseIssuedQty.get(objectRelatedLines.poWhRequestLineId);
                            whLineWiseIssuedQty.set(objectRelatedLines.poWhRequestLineId, preQty + pendingToIssuance);
                            const lineInfo = await this.poWhReqLineRepo.findOne({ where: { id: objectRelatedLines.poWhRequestLineId, unitCode, companyCode } });
                            jobNumbersAdded.add(lineInfo.jobNumber);
                            if (!jobItemColorSizeQtyMap.has(lineInfo.jobNumber)) {
                                jobItemColorSizeQtyMap.set(lineInfo.jobNumber, new Map<string, Map<string, Map<string, number>>>());
                            }
                            if (!jobItemColorSizeQtyMap.get(lineInfo.jobNumber).has(itemSku)) {
                                jobItemColorSizeQtyMap.get(lineInfo.jobNumber).set(itemSku, new Map<string, Map<string, number>>())
                            }
                            if (!jobItemColorSizeQtyMap.get(lineInfo.jobNumber).get(itemSku).has(lineInfo.fgColor)) {
                                jobItemColorSizeQtyMap.get(lineInfo.jobNumber).get(itemSku).set(lineInfo.fgColor, new Map<string, number>())
                            }
                            if (!jobItemColorSizeQtyMap.get(lineInfo.jobNumber).get(itemSku).get(lineInfo.fgColor).has(lineInfo.size)) {
                                jobItemColorSizeQtyMap.get(lineInfo.jobNumber).get(itemSku).get(lineInfo.fgColor).set(lineInfo.size, 0)
                            };
                            const preQtyOfJob = jobItemColorSizeQtyMap.get(lineInfo.jobNumber).get(itemSku).get(lineInfo.fgColor).get(lineInfo.size);
                            const updatableQty = preQtyOfJob + Number(pendingToIssuance);
                            jobItemColorSizeQtyMap.get(lineInfo.jobNumber).get(itemSku).get(lineInfo.fgColor).set(lineInfo.size, updatableQty);
                            const issuanceObj = new PoWhJobMaterialIssuanceEntity();
                            issuanceObj.allocatedQty = pendingToIssuance;
                            issuanceObj.companyCode = companyCode;
                            issuanceObj.createdUser = username;
                            issuanceObj.issuanceId = allocationId;
                            issuanceObj.issuedQty = pendingToIssuance;
                            issuanceObj.itemCode = itemSku;
                            issuanceObj.itemColor = objectRelatedLines.itemColor;
                            issuanceObj.itemType = objectRelatedLines.itemType;
                            issuanceObj.itemDescription = objectRelatedLines.itemDescription;
                            issuanceObj.itemName = objectRelatedLines.itemName;
                            issuanceObj.jobNumber = lineInfo.jobNumber;
                            issuanceObj.objectCode = eachBundle.bunBarcode;
                            issuanceObj.processType = lineInfo.processType;
                            issuanceObj.processingSerial = lineInfo.processingSerial;
                            issuanceObj.unitCode = unitCode;
                            issuanceObj.reportedWeight = 0;
                            issuanceObj.productRef = lineInfo.productRef;
                            issuanceObj.fgColor = lineInfo.fgColor;
                            issuanceObj.size = lineInfo.size;
                            issuanceObj.subProcessName = lineInfo.subProcessName;
                            issuanceObj.bomItemType = lineInfo.bomItemType;
                            issuanceObj.whReqId = lineInfo.poWhRequestId;
                            await transManager.getRepository(PoWhJobMaterialIssuanceEntity).save(issuanceObj);
                        }
                    }
                }
                await transManager.getRepository(PoWhRequestEntity).update({ id: whReqDetails.id }, { status: WhRequestStatusEnum.ISSUED });
            }
            for (const eachJobNumber of jobNumbersAdded) {
                await transManager.getRepository(SJobLinePlanEntity).update({ jobNumber: eachJobNumber }, { itemSkuStatus: TrimStatusEnum.ISSUED })
            };
            console.log(jobItemColorSizeQtyMap);
            for (const [job, itemCodeDetail] of jobItemColorSizeQtyMap) {
                for (const [itemSku, fgColorInfo] of itemCodeDetail) {
                    for (const [fgColor, sizeInfo] of fgColorInfo) {
                        for (const [size, qty] of sizeInfo) {
                            await transManager.getRepository(PoWhJobMaterialEntity).update({ jobNumber: job, itemCode: itemSku, fgColor, size, unitCode, companyCode, processingSerial, processType, isRequestNeeded: true }, { issuedQty: qty });
                        }
                    }
                }
            }
            for (const [lineId, qty] of whLineWiseIssuedQty) {
                await transManager.getRepository(PoWhRequestLineEntity).update({ id: lineId }, { issuedQty: qty, updatedUser: username })
            }
            await transManager.completeTransaction();
            return new GlobalResponseObject(true, 0, 'Issuance has been completed successfully.');
        } catch (err) {
            console.log(err);
            await transManager.releaseTransaction();
            throw err;
        }

    };


    async updateIssuedMaterialFromWms(req: WMS_C_IssuanceIdRequest): Promise<GlobalResponseObject> {
        const { issuanceId, unitCode, companyCode, userId, username } = req;
        const manager = new GenericTransactionManager(this.dataSource);
        try {
            const issuedInfo: WMS_R_IssuanceIdItemsResponse = await this.wmsService.getIssuedItemsUnderIssuanceId(req);
            if (!issuedInfo.status) {
                throw new ErrorResponse(issuedInfo.errorCode, issuedInfo.internalMessage)
            };
            const existingIssuanceInfo: PoWhIssuanceEntity[] = await this.issuanceRepo.find({ where: { issuanceId, unitCode, companyCode, requestType: MaterialRequestTypeEnum.RM } });
            if (existingIssuanceInfo.length) {
                throw new ErrorResponse(0, 'Issuance Already done for this id, Please check and try again');
            };
            const actIssuanceData: WMS_R_IssuanceIdItemsModel[] = issuedInfo.data;
            if (!actIssuanceData.length) {
                throw new ErrorResponse(0, 'Issuance data not found.')
            }
            const jobNumbersAdded = new Set<string>();
            const jobItemColorSizeQtyMap = new Map<string, Map<string, Map<string, Map<string, number>>>>();
            const whLineWiseIssuedQty = new Map<number, number>();
            const requestDetails = await this.poWhRequestRepo.findOne({ where: { id: actIssuanceData[0].extRefId, unitCode, companyCode } });
            if (requestDetails.status != WhRequestStatusEnum.OPEN) {
                throw new ErrorResponse(0, 'Request already been issued . Please check and try again')
            };
            const processType = requestDetails.processType;
            const processingSerial = requestDetails.processingSerial;
            await manager.startTransaction();
            const allocationEntity = new PoWhIssuanceEntity();
            allocationEntity.companyCode = companyCode;
            allocationEntity.createdUser = username;
            allocationEntity.issuanceId = req.issuanceId;
            allocationEntity.processType = processType;
            allocationEntity.processingSerial = processingSerial;
            allocationEntity.requestCode = requestDetails.requestCode;
            allocationEntity.requestType = requestDetails.requestType;
            allocationEntity.status = WhRequestStatusEnum.ISSUED;
            allocationEntity.unitCode = unitCode;
            allocationEntity.whReqId = requestDetails.id;
            await manager.getRepository(PoWhIssuanceEntity).save(allocationEntity, { reload: false });
            for (const eachIssuance of actIssuanceData) {
                const whReqDetails = await this.poWhRequestRepo.findOne({ where: { id: Number(eachIssuance.extRefId), unitCode, companyCode } });
                if (!whReqDetails) {
                    throw new ErrorResponse(0, 'Warehouse request not found for the given details. Please check and try again')
                }
                const whReqLineInfo = await this.poWhReqLineRepo.find({ where: { poWhRequestId: whReqDetails.id, unitCode, companyCode }, select: ['id'] });
                if (!whReqLineInfo.length) {
                    throw new ErrorResponse(0, 'Request jobs not found for the given warehouse request id');
                };
                const allLines: number[] = [];
                for (const eachWhReqLine of whReqLineInfo) {
                    allLines.push(eachWhReqLine.id);
                }
                const objectRelatedLines = await manager.getRepository(PoWhRequestMaterialItemEntity).find({ where: { poWhRequestLineId: In(allLines), unitCode, companyCode, objectCode: eachIssuance.barcode } });
                if (!objectRelatedLines.length) {
                    throw new ErrorResponse(0, 'Allocation data not found for the details' + `${eachIssuance.extRefId} - ${eachIssuance.itemCode} - ${eachIssuance.barcode}`);
                };
                let barcodeIssuedQty = eachIssuance.issuedQty;
                let totalAllocatedQty = 0;
                while (barcodeIssuedQty > 0) {
                    for (const eachObjectLine of objectRelatedLines) {
                        const pendingToIssuance = eachObjectLine.allocatedQty - eachObjectLine.issuedQty;
                        const allowableQty = Math.min(barcodeIssuedQty, pendingToIssuance);
                        totalAllocatedQty += allowableQty;
                        if (allowableQty > 0) {
                            const updatedQty = eachObjectLine.allocatedQty + Number(allowableQty);
                            await manager.getRepository(PoWhRequestMaterialItemEntity).update({ id: eachObjectLine.id, unitCode, companyCode }, { issuedQty: updatedQty, updatedUser: req.username });
                            const lineInfo = await this.poWhReqLineRepo.findOne({ where: { id: eachObjectLine.poWhRequestLineId, unitCode, companyCode } });
                            if (!whLineWiseIssuedQty.has(eachObjectLine.poWhRequestLineId)) {
                                whLineWiseIssuedQty.set(eachObjectLine.poWhRequestLineId, 0);
                            };
                            const preQty = whLineWiseIssuedQty.get(eachObjectLine.poWhRequestLineId);
                            whLineWiseIssuedQty.set(eachObjectLine.poWhRequestLineId, preQty + pendingToIssuance);
                            if (!jobItemColorSizeQtyMap.has(lineInfo.jobNumber)) {
                                jobItemColorSizeQtyMap.set(lineInfo.jobNumber, new Map<string, Map<string, Map<string, number>>>());
                            }
                            if (!jobItemColorSizeQtyMap.get(lineInfo.jobNumber).has(lineInfo.fgColor)) {
                                jobItemColorSizeQtyMap.get(lineInfo.jobNumber).set(lineInfo.fgColor, new Map<string, Map<string, number>>())
                            }
                            if (!jobItemColorSizeQtyMap.get(lineInfo.jobNumber).get(lineInfo.fgColor).has(lineInfo.size)) {
                                jobItemColorSizeQtyMap.get(lineInfo.jobNumber).get(lineInfo.fgColor).set(lineInfo.size, new Map<string, number>())
                            }
                            if (!jobItemColorSizeQtyMap.get(lineInfo.jobNumber).get(lineInfo.fgColor).get(lineInfo.size).has(eachObjectLine.itemCode)) {
                                jobItemColorSizeQtyMap.get(lineInfo.jobNumber).get(lineInfo.fgColor).get(lineInfo.size).set(eachObjectLine.itemCode, 0)
                            };
                            const preQtyOfJob = jobItemColorSizeQtyMap.get(lineInfo.jobNumber).get(lineInfo.fgColor).get(lineInfo.size).get(eachObjectLine.itemCode);
                            jobItemColorSizeQtyMap.get(lineInfo.jobNumber).get(lineInfo.fgColor).get(lineInfo.size).set(eachObjectLine.itemCode, preQtyOfJob + allowableQty);
                            jobNumbersAdded.add(lineInfo.jobNumber);
                            const issuanceObj = new PoWhJobMaterialIssuanceEntity();
                            issuanceObj.allocatedQty = eachObjectLine.allocatedQty;
                            issuanceObj.companyCode = companyCode;
                            issuanceObj.createdUser = username;
                            issuanceObj.issuanceId = issuanceId;
                            issuanceObj.issuedQty = eachIssuance.issuedQty;
                            issuanceObj.itemCode = eachIssuance.itemCode;
                            issuanceObj.itemColor = eachObjectLine.itemColor;
                            issuanceObj.itemType = eachObjectLine.itemType;
                            issuanceObj.itemDescription = eachObjectLine.itemDescription;
                            issuanceObj.itemName = eachObjectLine.itemName;
                            issuanceObj.jobNumber = lineInfo.jobNumber;
                            issuanceObj.objectCode = eachIssuance.barcode;
                            issuanceObj.processType = lineInfo.processType;
                            issuanceObj.processingSerial = lineInfo.processingSerial;
                            issuanceObj.unitCode = unitCode;
                            issuanceObj.reportedWeight = 0;
                            issuanceObj.productRef = lineInfo.productRef;
                            issuanceObj.fgColor = lineInfo.fgColor;
                            issuanceObj.size = lineInfo.size;
                            issuanceObj.subProcessName = lineInfo.subProcessName;
                            issuanceObj.bomItemType = lineInfo.bomItemType;
                            issuanceObj.whReqId = requestDetails.id;
                            await manager.getRepository(PoWhJobMaterialIssuanceEntity).save(issuanceObj);
                            barcodeIssuedQty -= allowableQty;
                        }
                    }
                    if (barcodeIssuedQty > 0) {
                        throw new ErrorResponse(0, `Issued more than the requested qty for the barcode ${eachIssuance.barcode} , Pending for the issuance is : ${totalAllocatedQty} But issued qty is : ${eachIssuance.issuedQty}`);
                    }
                }
                await manager.getRepository(PoWhRequestEntity).update({ id: whReqDetails.id }, { status: WhRequestStatusEnum.ISSUED });
                // throw null;
            };
            for (const eachJobNumber of jobNumbersAdded) {
                await manager.getRepository(SJobLinePlanEntity).update({ jobNumber: eachJobNumber }, { rawMaterialStatus: TrimStatusEnum.ISSUED })
            };
            for (const [job, itemCodeDetail] of jobItemColorSizeQtyMap) {
                for (const [fgColor, fgColorDetail] of itemCodeDetail) {
                    for (const [size, sizeDetails] of fgColorDetail) {
                        for (const [itemSku, qty] of sizeDetails) {
                            await manager.getRepository(PoWhJobMaterialEntity).update({ jobNumber: job, fgColor, size, itemCode: itemSku, unitCode, companyCode }, { issuedQty: qty });
                        }
                    }
                }
            }
            for (const [lineId, qty] of whLineWiseIssuedQty) {
                await manager.getRepository(PoWhRequestLineEntity).update({ id: lineId }, { issuedQty: qty, updatedUser: username })
            }
            await manager.completeTransaction();
            return new GlobalResponseObject(true, 0, 'Material Issued Successfully for the jobs')
        } catch (err) {
            await manager.releaseTransaction();
            throw err;
        }


    }

    async getJobMaterialSummary(job_header_id: number) {
        // Step 1: Fetch all materials for the job_header_id — ordered properly
        const jobMaterials = await this.jobWhMaterialRepo.find({
            where: { sJobHeaderId: job_header_id, isActive: true },
            order: { jobNumber: 'ASC', fgColor: 'ASC', size: 'ASC', itemCode: 'ASC' }
        });
        let result = [];

        // Step 2: Group materials by (jobNumber + fgColor + size + itemCode) combo (uniqueness — for row)
        const materialKeyMap: Map<string, any> = new Map();
        for (const material of jobMaterials) {
            const key = `${material.jobNumber}||${material.fgColor}||${material.size}||${material.itemCode}`;
            if (!materialKeyMap.has(key)) {
                materialKeyMap.set(key, material);
            }
        }

        // Step 3: Group materials by (jobNumber + fgColor + size) — for computing total required & issued qtys
        const comboGroupMap: Map<string, any[]> = new Map();
        for (const material of jobMaterials) {
            const comboKey = `${material.jobNumber}||${material.fgColor}||${material.size}`;
            if (!comboGroupMap.has(comboKey)) {
                comboGroupMap.set(comboKey, []);
            }
            comboGroupMap.get(comboKey).push(material);
        }

        // Step 4: Process combo groups — compute status per combo
        const comboStatusMap: Map<string, string> = new Map(); // comboKey -> status

        const comboEligibleQtyMap: Map<string, Map<string, number>> = new Map(); // comboKey -> itemCode -> eligibleQty

        for (const [comboKey, comboMaterials] of comboGroupMap.entries()) {
            let allEligible = true;
            const itemEligibleMap: Map<string, number> = new Map();

            let totalIssuedQty = 0;
            let totalRequiredQty = 0;

            for (const m of comboMaterials) {
                totalIssuedQty += Number(m.issuedQty);
                totalRequiredQty += Number(m.requiredQty);
            }

            for (const m of comboMaterials) {
                let eligibleQty = 0;
                if (m.itemType === 'Trim') {
                    eligibleQty = totalRequiredQty > totalIssuedQty ? 0 : totalRequiredQty;
                } else {
                    eligibleQty = Math.min(m.requiredQty, totalIssuedQty);
                }

                itemEligibleMap.set(m.itemCode, eligibleQty);

                if (eligibleQty === 0) {
                    allEligible = false;
                }
            }

            comboEligibleQtyMap.set(comboKey, itemEligibleMap);
            comboStatusMap.set(comboKey, allEligible ? '🟢 Ready' : '🔴 Blocked');
        }

        // Step 5: Process materialKeyMap (unique rows) + apply combo status
        const groupedByJobNumber: Map<string, any[]> = new Map();

        for (const [key, material] of materialKeyMap.entries()) {
            const comboKey = `${material.jobNumber}||${material.fgColor}||${material.size}`;
            const eligibleQty = comboEligibleQtyMap.get(comboKey)?.get(material.itemCode) || 0;
            const comboStatus = comboStatusMap.get(comboKey) || '🔴 Blocked';

            const row = {
                job_number: material.jobNumber,
                fg_color: material.fgColor,
                size: material.size,
                item_code: material.itemCode,
                is_trim: material.itemType === 'Trim' ? '✅' : '❌',
                required_qty: material.requiredQty,
                allocated_qty: material.allocatedQty,
                issued_qty: material.issuedQty,
                eligible_qty_to_start: eligibleQty,
                status: comboStatus,
            };

            // Group rows by jobNumber to compute per-job total later
            if (!groupedByJobNumber.has(material.jobNumber)) {
                groupedByJobNumber.set(material.jobNumber, []);
            }
            groupedByJobNumber.get(material.jobNumber).push(row);
        }

        // Step 6: Prepare final result with per-job total
        const sortedJobNumbers = Array.from(groupedByJobNumber.keys()).sort();

        for (const jobNumber of sortedJobNumbers) {
            const rows = groupedByJobNumber.get(jobNumber);

            let jobTotalRequiredQty = 0;
            let jobTotalAllocatedQty = 0;
            let jobTotalIssuedQty = 0;

            for (const row of rows) {
                result.push(row);
                jobTotalRequiredQty += Number(row.required_qty);
                jobTotalAllocatedQty += Number(row.allocated_qty);
                jobTotalIssuedQty += Number(row.issued_qty);
            }

            // Add TOTAL row for that job
            result.push({
                job_number: `${jobNumber} TOTAL`,
                fg_color: '',
                size: '',
                item_code: '',
                is_trim: '',
                required_qty: jobTotalRequiredQty,
                allocated_qty: jobTotalAllocatedQty,
                issued_qty: jobTotalIssuedQty,
                eligible_qty_to_start: '',
                status: '',
            });
        }

        return result;
    }



}