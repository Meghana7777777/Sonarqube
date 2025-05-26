import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { KG_MaterialRequirementForKitGroupRequest, KG_MaterialRequirementDetailResp, KG_KnitJobMaterialAllocationRequest, GlobalResponseObject, KC_KnitGroupPoSerialRequest, KG_KnitJobMaterialAllocationResponse, KG_JobWiseMaterialAllocationDetailRequest, KG_JobWiseMaterialAllocationDetailResponse, KG_KnitGroupMaterialRequirementModel, KG_ItemWiseMaterialRequirementModel, MOC_MoProductFabConsumptionModel, KG_ItemWiseAllocationModel_R, KG_ObjectWiseAllocationInfo_R, KG_JobWiseMaterialAllocationDetail, KG_KnitJobMaterialAllocationModel_R, KJ_C_KnitJobNumberRequest, KMS_R_KnitJobRequestedItemsResponse, KMS_C_JobMainMaterialReqIdRequest, WMS_C_IssuanceIdRequest, KG_ObjectWiseAllocationInfo_C, KMS_R_KnitJobRequestedMaterialModel, KMS_R_KnitJobRequestedItemsModel, WMS_R_IssuanceIdItemsResponse, WMS_R_IssuanceIdItemsModel, ManufacturingOrderDataInfoModel, StockCodesRequest, ItemIdRequest, PhItemCategoryEnum, KJ_MaterialStatusEnum, WhRequestStatusEnum, SewingJobPlanStatusEnum, ItemModel, StockObjectInfoModel, ProcessTypeEnum } from '@xpparel/shared-models';
import { DataSource, In } from 'typeorm';
import { PoWhRequestRepository } from '../common/repository/po-wh-request.repo';
import { PoWhRequestLineRepository } from '../common/repository/po-wh-request-line.repo';
import { PoWhRequestMaterialItemRepository } from '../common/repository/po-wh-request-material-item.repo';
import { PoKnitJobEntity } from '../common/entities/po-knit-job-entity';
import { PoKnitJobRepository } from '../common/repository/po-knit-job.repo';
import { ErrorResponse } from '@xpparel/backend-utils';
import { ItemSharedService, KnittingJobsService, PackingListService, WmsKnitItemRequestService } from '@xpparel/shared-services';
import { PoKnitJobLineRepository } from '../common/repository/po-knit-job-line.repo';
import { PoKnitJobSubLineEntity } from '../common/entities/po-knit-job-sub-line-entity';
import { PoKnitJobSubLineRepository } from '../common/repository/po-knit-job-sub-line.repo';
import { PoProductRepository } from '../common/repository/po-product.repo';
import { KnittingConfigurationService } from '../knitting-configuration/knitting-configuration.service';
import { PoJobPslMapRepository } from '../common/repository/po-job-psl-map.repo';
import { GenericTransactionManager } from '../../database/typeorm-transactions';
import { PoWhRequestEntity } from '../common/entities/po-wh-request-entity';
import { PoWhRequestLineEntity } from '../common/entities/po-wh-request-line-entity';
import { PoWhRequestMaterialHistoryEntity } from '../common/entities/po-wh-request-material-history-entity';
import { PoWhRequestLineHistoryEntity } from '../common/entities/po-wh-request-line-history.entity';
import { PoWhRequestHistoryEntity } from '../common/entities/po-wh-request-history.entity';
import { PoWhRequestMaterialItemEntity } from '../common/entities/po-wh-request-material-item-entity';
import { PoSubLineRepository } from '../common/repository/po-sub-line.repo';
import { ProductSubLineFeaturesRepository } from '../common/repository/product-sub-line-features.repo';
import { PoWhKnitJobMaterialRepository } from '../common/repository/po-wh-knit-job-material.repo';
import { PoWhKnitJobMaterialEntity } from '../common/entities/po-wh-job-material-entity';
import { PoWhKnitJobMaterialIssuanceRepository } from '../common/repository/po-wh-job-material-issuance.repo';
import { PoWhKnitJobMaterialIssuanceEntity } from '../common/entities/po-wh-job-material-issuance-entity';
import { PoWhRequestMaterialItemHistoryEntity } from '../common/entities/po-wh-request-material-item-history-entity';
import { PoKnitJobPlanEntity } from '../common/entities/po-knit-job-plan-entity';
import { PoKnitJobPlanRepository } from '../common/repository/po-knit-job-plan.repo';
const util = require('util');

@Injectable()
export class KnittingJobsMaterialAllocationService {
    constructor(
        private dataSource: DataSource,
        private poWhRequestRepo: PoWhRequestRepository,
        private poWhLineRequestRepo: PoWhRequestLineRepository,
        private poWhRequestItemRepo: PoWhRequestMaterialItemRepository,
        private poKnitJobRepo: PoKnitJobRepository,
        private poKnitJobLineRepo: PoKnitJobLineRepository,
        private poKnitJobSubLineRepo: PoKnitJobSubLineRepository,
        private poProductRepo: PoProductRepository,
        @Inject(forwardRef(() => KnittingConfigurationService)) private knitConfigService: KnittingConfigurationService,
        private poKnitJobPslMap: PoJobPslMapRepository,
        private poSubLineFeaturesRepo: ProductSubLineFeaturesRepository,
        private whJobMaterialRepo: PoWhKnitJobMaterialRepository,
        private whMaterialIssuance: PoWhKnitJobMaterialIssuanceRepository,
        private packListService: PackingListService,
        private itemSharedService: ItemSharedService,
        private knitJObPlanRepo: PoKnitJobPlanRepository,
        private wmsService: WmsKnitItemRequestService
    ) { }

    /**
     * TODO: Need to get the Item details from master to fill -- DONE
     * TODO: Some details are missing from the WMS inventory getting api need to verify -- DONE
     * Need to get the inventory from WMS and fill if i need object wise
     * Service to get material requirement details for knit group and job numbers
     * Usually calls from UI to show all object info to select the cones
     * @param reqObj 
     * @param config 
     * @returns 
    */
    async getMaterialRequirementForGivenKnitGroup(reqObj: KG_MaterialRequirementForKitGroupRequest): Promise<KG_MaterialRequirementDetailResp> {
        const { unitCode, companyCode, processType, processingSerial, jobNumbers } = reqObj;
        const itemReqForJobs = await this.whJobMaterialRepo.find({ where: { jobNumber: In(jobNumbers), unitCode, companyCode } });
        if (!itemReqForJobs.length) {
            throw new ErrorResponse(0, 'Job Requirement details not found . please check and try again');
        }
        const kgWiseMaterialRequirementDetails: KG_KnitGroupMaterialRequirementModel[] = [];
        const itemCodeKnitGroupReqQtyMap = new Map<string, Map<string, number>>();
        for (const eachJobReq of itemReqForJobs) {
            if (!itemCodeKnitGroupReqQtyMap.has(eachJobReq.itemCode)) {
                itemCodeKnitGroupReqQtyMap.set(eachJobReq.itemCode, new Map<string, number>());
            }
            if (!itemCodeKnitGroupReqQtyMap.get(eachJobReq.itemCode).has(eachJobReq.groupCode)) {
                itemCodeKnitGroupReqQtyMap.get(eachJobReq.itemCode).set(eachJobReq.groupCode, 0);
            }
            const preQty = itemCodeKnitGroupReqQtyMap.get(eachJobReq.itemCode).get(eachJobReq.groupCode);
            itemCodeKnitGroupReqQtyMap.get(eachJobReq.itemCode).set(eachJobReq.groupCode, preQty + (Number(eachJobReq.requiredQty) - Number(eachJobReq.allocatedQty)));

        }
        const moNumbersForJobs = await this.getMoNumbersForJobNumber(reqObj.jobNumbers, unitCode, companyCode);
        let groupCodes = new Set<string>();
        const itemWiseRequirementDetails: KG_ItemWiseMaterialRequirementModel[] = [];
        for (const [itemCode, groupInfo] of itemCodeKnitGroupReqQtyMap) {
            const itemIdRequest = new ItemIdRequest(reqObj.username, reqObj.unitCode, reqObj.companyCode, reqObj.userId, 0, '', itemCode);
            const itemInfo = await this.itemSharedService.getBomItemByItemCode(itemIdRequest);
            if (!itemInfo.status) {
                throw new ErrorResponse(itemInfo.errorCode, itemInfo.internalMessage);
            }
            let totalReqQty = 0
            for (const [groupCode, qty] of groupInfo) {
                groupCodes.add(groupCode);
                totalReqQty += qty;
            };
            const inventoryReq = new StockCodesRequest(null, unitCode, companyCode, null, itemCode, [], [], Array.from(moNumbersForJobs));
            const inventoryDetails = await this.packListService.getInStockObjectsForItemCode(inventoryReq);
            if (!inventoryDetails.status) {
                throw new ErrorResponse(inventoryDetails.errorCode, inventoryDetails.internalMessage);
            };
            const inventoryObjects: KG_ObjectWiseAllocationInfo_R[] = [];
            for (const eachInventoryItem of inventoryDetails.data) {
                const alreadyAllocatedQtyDetail = await this.poWhRequestItemRepo.find({ where: { unitCode, companyCode, itemCode, objectCode: eachInventoryItem.barcode }, select: ['allocatedQty'] });
                let allocatedQtyForBarcode = alreadyAllocatedQtyDetail.reduce((pre, curr) => {
                    return pre + Number(curr.allocatedQty);
                }, 0);
                const inventoryObject = new KG_ObjectWiseAllocationInfo_R(eachInventoryItem.objectType, eachInventoryItem.barcode, eachInventoryItem.locationCode, eachInventoryItem.supplierCode, eachInventoryItem.vpo, (eachInventoryItem.originalQty - allocatedQtyForBarcode), eachInventoryItem.issuedQuantity, allocatedQtyForBarcode, 0);
                inventoryObjects.push(inventoryObject);
            };
            const itemCodeDetail = itemReqForJobs.filter(job => job.itemCode == itemCode);
            const totalRequiredQty = itemCodeDetail.reduce((pre, curr) => {
                return pre + Number(curr.requiredQty);
            }, 0);
            const totalAllocatedQty = itemCodeDetail.reduce((pre, curr) => {
                return pre + Number(curr.allocatedQty);
            }, 0);
            const totalIssuedQty = itemCodeDetail.reduce((pre, curr) => {
                return pre + Number(curr.issuedQty);
            }, 0)
            itemWiseRequirementDetails.push(new KG_ItemWiseMaterialRequirementModel(itemCode, itemInfo.data[0].itemName, itemInfo.data[0].itemDescription, itemInfo.data[0].itemColor, itemInfo.data[0].bomItemType as PhItemCategoryEnum, totalRequiredQty, totalAllocatedQty, totalIssuedQty, inventoryObjects));
        }
        kgWiseMaterialRequirementDetails.push(new KG_KnitGroupMaterialRequirementModel(Array.from(groupCodes).toString(), itemWiseRequirementDetails));
        // // KG -> PRODUCT CODE -> FG COLOR -> SIZE -> QTY
        // const kGWiseJobsMap = new Map<string, Map<string, Map<string, Map<string, number>>>>();
        // // const kgWiseMaterialRequirementDetails: KG_KnitGroupMaterialRequirementModel[] = [];
        // const moProductSubLineIds = new Set<number>();
        // // Fetch all knit job info in parallel
        // const knitJobInfos = await Promise.all(
        //     jobNumbers.map((eachJob) =>
        //         this.poKnitJobRepo.findOne({
        //             where: { knitJobNumber: eachJob, unitCode, companyCode, processingSerial, processType },
        //             select: ["groupCode", "knitJobNumber"],
        //         })
        //     )
        // );

        // // Fetch all job lines, sublines, and bundles in parallel
        // const jobLineInfos = await this.poKnitJobLineRepo.find({
        //     where: { knitJobNumber: In(jobNumbers), unitCode, companyCode, processingSerial, processType },
        //     select: ["id", "knitJobNumber"],
        // });
        // if (!knitJobInfos.length) throw new ErrorResponse(0, "Knit Job not found");
        // for (const eachJobLine of knitJobInfos) {
        //     if (!kGWiseJobsMap.has(eachJobLine.groupCode)) {
        //         kGWiseJobsMap.set(eachJobLine.groupCode, new Map());
        //     }
        // }
        // const jobSubLineInfos = await this.poKnitJobSubLineRepo.find({
        //     where: { poKnitJobLineId: In(jobLineInfos.map((jl) => jl.id)), unitCode, companyCode },
        //     select: ["id", "productRef", "fgColor", "size", "quantity", "knitJobNumber"],
        // });

        // const bundleInfos = await this.poKnitJobPslMap.find({
        //     where: { poJobSubLineId: In(jobSubLineInfos.map((jsl) => jsl.id)), unitCode, companyCode },
        //     select: ["moProductSubLineId"],
        // });

        // bundleInfos.forEach((bundle) => moProductSubLineIds.add(bundle.moProductSubLineId));

        // const productInfos = await this.poProductRepo.find({
        //     where: { productRef: In(jobSubLineInfos.map((jsl) => jsl.productRef)), unitCode, companyCode, processingSerial, processType },
        //     select: ["productCode", "productRef"],
        // });

        // const productMap = new Map(productInfos.map((p) => [p.productRef, p.productCode]));
        // for (const eachSubLine of jobSubLineInfos) {
        //     const productCode = productMap.get(eachSubLine.productRef);
        //     if (!productCode) continue;
        //     const groupMap = kGWiseJobsMap.get(knitJobInfos.find((job) => job.knitJobNumber === eachSubLine.knitJobNumber)?.groupCode);
        //     if (!groupMap.has(productCode)) groupMap.set(productCode, new Map());
        //     if (!groupMap.get(productCode).has(eachSubLine.fgColor)) groupMap.get(productCode).set(eachSubLine.fgColor, new Map());
        //     const sizeMap = groupMap.get(productCode).get(eachSubLine.fgColor);
        //     sizeMap.set(eachSubLine.size, (sizeMap.get(eachSubLine.size) || 0) + eachSubLine.quantity);
        // }
        // // Fetch size-wise consumption details
        // const sizeWiseConsumptionDetails = await this.knitConfigService.getSizeWiseComponentConsumptionForPo(
        //     processType,
        //     Array.from(moProductSubLineIds),
        //     unitCode,
        //     companyCode
        // );

        // const itemWiseConsumptionMap = new Map<string, number>();
        // for (const [eachKnitGroup, knitGroupJobs] of kGWiseJobsMap) {
        //     const itemWiseRequirementDetails: KG_ItemWiseMaterialRequirementModel[] = [];
        //     for (const [productCode, productInfo] of knitGroupJobs) {
        //         const itemsRequiredForProductCode = sizeWiseConsumptionDetails.filter((item) => item.productCode === productCode);
        //         for (const [fgColor, colorInfo] of productInfo) {
        //             const itemsRequiredForFgColor = itemsRequiredForProductCode.find((item) => item.fgColor === fgColor);
        //             if (!itemsRequiredForFgColor) continue;
        //             for (const eachItem of itemsRequiredForFgColor.fabCons) {
        //                 let totalConsumption = 0;
        //                 for (const [size, qty] of colorInfo) {
        //                     const sizeConsumptionOfMaterial = eachItem.sizeCons.find((item) => item.size === size);
        //                     if (!sizeConsumptionOfMaterial) throw new ErrorResponse(0, `Requirement details not found for ${eachItem.itemCode} ${fgColor} ${productCode} ${size}`);
        //                     totalConsumption += sizeConsumptionOfMaterial.cons * qty;
        //                 }
        //                 itemWiseConsumptionMap.set(eachItem.itemCode, (itemWiseConsumptionMap.get(eachItem.itemCode) || 0) + totalConsumption);
        //             }
        //         }
        //     }
        //     const materialReqInfos = await this.poWhLineRequestRepo.find({
        //         where: {
        //             jobNumber: In(jobNumbers),
        //             unitCode,
        //             companyCode,
        //             processingSerial,
        //             processType,
        //             itemCode: In(Array.from(itemWiseConsumptionMap.keys())),
        //             isActive: true,
        //         },
        //         select: ["itemCode", "allocatedQty"],
        //     });
        //     const allocationMap = new Map<string, { allocatedQty: number; issuedQty: number }>();
        //     for (const req of materialReqInfos) {
        //         if (!allocationMap.has(req.itemCode)) {
        //             allocationMap.set(req.itemCode, { allocatedQty: 0, issuedQty: 0 });
        //         }
        //         allocationMap.get(req.itemCode).allocatedQty += req.allocatedQty;
        //         allocationMap.get(req.itemCode).issuedQty += 0;
        //     };
        //     const moNumbersForJobs = await this.getMoNumbersForJobNumber(reqObj.jobNumbers, unitCode, companyCode);
        //     for (const [itemCode, consumption] of itemWiseConsumptionMap) {
        //         const { allocatedQty = 0, issuedQty = 0 } = allocationMap.get(itemCode) || {};
        //         const requiredQty = consumption - allocatedQty;
        //         const itemIdRequest = new ItemIdRequest(reqObj.username, reqObj.unitCode, reqObj.companyCode, reqObj.userId, 0, '', itemCode);
        //         const itemInfo = await this.itemSharedService.getBomItemByItemCode(itemIdRequest);
        //         if (!itemInfo.status) {
        //             throw new ErrorResponse(itemInfo.errorCode, itemInfo.internalMessage);
        //         }
        //         const inventoryReq = new StockCodesRequest(null, unitCode, companyCode, null, itemCode, [], [], Array.from(moNumbersForJobs));
        //         const inventoryDetails = await this.packListService.getInStockObjectsForItemCode(inventoryReq);
        //         if (!inventoryDetails.status) {
        //             throw new ErrorResponse(inventoryDetails.errorCode, inventoryDetails.internalMessage);
        //         }
        //         const inventoryObjects: KG_ObjectWiseAllocationInfo_R[] = [];
        //         for (const eachInventoryItem of inventoryDetails.data) {
        //             const alreadyAllocatedQtyDetail = await this.poWhRequestItemRepo.find({ where: { unitCode, companyCode, itemCode, objectCode: eachInventoryItem.barcode }, select: ['allocatedQty'] });
        //             let allocatedQtyForBarcode = alreadyAllocatedQtyDetail.reduce((pre, curr) => {
        //                 return pre + curr.allocatedQty;
        //             }, 0);
        //             const inventoryObject = new KG_ObjectWiseAllocationInfo_R(eachInventoryItem.objectType, eachInventoryItem.barcode, eachInventoryItem.locationCode, eachInventoryItem.supplierCode, eachInventoryItem.vpo, (eachInventoryItem.originalQty - allocatedQtyForBarcode),eachInventoryItem.issuedQuantity, allocatedQtyForBarcode, 0);
        //             inventoryObjects.push(inventoryObject);
        //         }
        //         itemWiseRequirementDetails.push(new KG_ItemWiseMaterialRequirementModel(itemCode, itemInfo.data[0].itemName, itemInfo.data[0].itemDescription, itemInfo.data[0].itemColor, itemInfo.data[0].bomItemType as PhItemCategoryEnum, requiredQty, allocatedQty, issuedQty, inventoryObjects));
        //     }
        //     kgWiseMaterialRequirementDetails.push(new KG_KnitGroupMaterialRequirementModel(eachKnitGroup, itemWiseRequirementDetails));
        // }
        return new KG_MaterialRequirementDetailResp(true, 0, "Material Requirement details retrieved successfully", kgWiseMaterialRequirementDetails);
    }


    /**
     * TODO: Need to insert in the history tables as well.--PoWhRequestMaterialHistoryEntity(Inserted) -- DONE
     * TODO: Need to validate the real object qtys while allocating as well. while doing this need to update location code, supplier code and vpo -- DONE
     * TODO: Need to get the item details from master and insert  --DONE
     * TODO: Need to fill the location etc.. details from object  -- DONE
     * TODO: Bull job for WMS call
     * Service to Allocate Material for Knit Group
     * Usually calls from UI to after clicking on allocation button 
     * @param reqObj 
     * @param config 
     * @returns 
    */
    async allocateMaterialForKnitGroup(reqObj: KG_KnitJobMaterialAllocationRequest): Promise<GlobalResponseObject> {
        const { unitCode, companyCode, processType, processingSerial, username, userId } = reqObj;
        const manager = new GenericTransactionManager(this.dataSource);
        try {
            const allRequestedJobNumbers = new Set<string>();
            for (const jobInfo of reqObj.knitGroupWiseAllocationInfo) {
                for (const eachJob of jobInfo.jobNumbers) {
                    allRequestedJobNumbers.add(eachJob)
                }
            };
            const getPayload = new KG_MaterialRequirementForKitGroupRequest(null, unitCode, companyCode, 0, processingSerial, processType, null, Array.from(allRequestedJobNumbers), false)
            const getMaterialActualRequirementJobs = await this.getMaterialRequirementForEachGivenJob(getPayload);
            const materialRequirementInfo: Map<string, KG_KnitGroupMaterialRequirementModel[]> = getMaterialActualRequirementJobs;
            const itemWiseJobRequiredInfo = new Map<string, Map<string, KG_ItemWiseMaterialRequirementModel>>();
            const itemCodeWiseUserRequestedQty = new Map<string, number>();
            const objWiseQty = new Map<string, Map<string, number>>();
            for (const groupWiseDetail of reqObj.knitGroupWiseAllocationInfo) {
                for (const itemWiseDetail of groupWiseDetail.itemWiseInfo) {
                    if (!itemCodeWiseUserRequestedQty.has(itemWiseDetail.itemCode)) {
                        itemCodeWiseUserRequestedQty.set(itemWiseDetail.itemCode, 0);
                    }
                    const preQty = itemCodeWiseUserRequestedQty.get(itemWiseDetail.itemCode);
                    itemCodeWiseUserRequestedQty.set(itemWiseDetail.itemCode, preQty + itemWiseDetail.totalRequiredQty);
                }
            };
            //added3
            for (const groupWiseDetails of reqObj.knitGroupWiseAllocationInfo) {
                for (const itemWiseDetails of groupWiseDetails.itemWiseInfo) {
                    if (!objWiseQty.has(itemWiseDetails.itemCode)) {
                        objWiseQty.set(itemWiseDetails.itemCode, new Map<string, number>())
                    }

                    for (const objDetails of itemWiseDetails.objectWiseDetail) {
                        //objWiseQty.set(objDetails.objectCode,objDetails.allocatingQuantity);
                        if (!objWiseQty.get(itemWiseDetails.itemCode).has(objDetails.objectCode)) {
                            objWiseQty.get(itemWiseDetails.itemCode).set(objDetails.objectCode, 0);
                        }
                        const previousAllocated = Number(objWiseQty.get(itemWiseDetails.itemCode).get(objDetails.objectCode))
                        objWiseQty.get(itemWiseDetails.itemCode).set(objDetails.objectCode, previousAllocated + objDetails.allocatingQuantity)
                    }
                }
            };
            //end
            const itemWiseActualRequiredQtyForGivenJobs = new Map<string, number>();
            for (const [jobNumber, jobMaterialInfo] of materialRequirementInfo) {
                const jobPlanInfo = await this.knitJObPlanRepo.findOne({ where: { jobNumber, unitCode, companyCode }, select: ['id', 'rawMaterialStatus'] });
                if (jobPlanInfo.rawMaterialStatus != KJ_MaterialStatusEnum.OPEN) {
                    throw new ErrorResponse(0, `${jobNumber} 's material already been requested or issues. Please check and try again`)
                }
                for (const eachGroup of jobMaterialInfo) {
                    for (const eachMaterial of eachGroup.itemWiseMaterialRequirement) {
                        if (!itemCodeWiseUserRequestedQty.has(eachMaterial.itemCode)) {
                            throw new ErrorResponse(0, `Item Code ${eachMaterial.itemCode} is missing in the request for the job ${jobNumber} Please check and try again. You need to request all materials in the jobs`)
                        }
                        if (!itemWiseJobRequiredInfo.has(eachMaterial.itemCode)) {
                            itemWiseJobRequiredInfo.set(eachMaterial.itemCode, new Map<string, KG_ItemWiseMaterialRequirementModel>);
                        }
                        if (!itemWiseJobRequiredInfo.get(eachMaterial.itemCode).has(jobNumber)) {
                            itemWiseJobRequiredInfo.get(eachMaterial.itemCode).set(jobNumber, eachMaterial);
                        }
                        if (!itemWiseActualRequiredQtyForGivenJobs.has(eachMaterial.itemCode)) {
                            itemWiseActualRequiredQtyForGivenJobs.set(eachMaterial.itemCode, 0);
                        }
                        const preQty = itemWiseActualRequiredQtyForGivenJobs.get(eachMaterial.itemCode);
                        itemWiseActualRequiredQtyForGivenJobs.set(eachMaterial.itemCode, preQty + eachMaterial.totalRequiredQty);
                    }
                }
            };
            for (const [itemCode, actualRequiredQty] of itemWiseActualRequiredQtyForGivenJobs) {
                const requestingQty = itemCodeWiseUserRequestedQty.get(itemCode);
                if (requestingQty) {
                    if (requestingQty > actualRequiredQty) {
                        throw new ErrorResponse(0, 'You are requesting more than the actual required quantity. So you can not proceed' + itemCode);
                    }
                }
            }
            const existingJobs: number = await this.poWhRequestRepo.count({ where: { processingSerial, unitCode, companyCode, processType, isActive: true } });
            //added
            const objCodeDetailsMap = new Map<string, StockObjectInfoModel>()
            for (const jobNumbersArr of reqObj.knitGroupWiseAllocationInfo) {
                const jobNumbersArray = jobNumbersArr.jobNumbers
                const moNumber = await this.getMoNumbersForJobNumber(jobNumbersArray, reqObj.unitCode, reqObj.companyCode);
                for (const itemInfo of jobNumbersArr.itemWiseInfo) {
                    const itemCode = itemInfo.itemCode
                    const stockCodesRequest = new StockCodesRequest(reqObj.username, reqObj.unitCode, reqObj.companyCode, reqObj.userId, itemInfo.itemCode, [], [], Array.from(moNumber));
                    const objInfo = await this.packListService.getInStockObjectsForItemCode(stockCodesRequest);
                    if (!objInfo.status) {
                        throw new ErrorResponse(objInfo.errorCode, objInfo.internalMessage)
                    }
                    const inventoryBarcodes = objInfo.data;
                    const objectsOfItemCode = objWiseQty.get(itemCode);
                    if (!objectsOfItemCode) {
                        throw new ErrorResponse(0, 'No Objects found for the item code ' + itemCode);
                    }
                    for (const [objectCode, qty] of objectsOfItemCode) {
                        const inventoryInfoOfObject = inventoryBarcodes.find(ob => ob.barcode === objectCode);
                        objCodeDetailsMap.set(objectCode, inventoryInfoOfObject);
                        if (!inventoryInfoOfObject) {
                            throw new ErrorResponse(0, 'Requested Barcode not found in the inventory' + objectCode)
                        }
                        const orginalQty = inventoryInfoOfObject.originalQty;
                        const alreadyAllocatedQtyDetail = await this.poWhRequestItemRepo.find({ where: { unitCode, companyCode, itemCode, objectCode: objectCode }, select: ['allocatedQty'] });
                        let allocatedQtyForBarcode = alreadyAllocatedQtyDetail.reduce((pre, curr) => {
                            return pre + curr.allocatedQty;
                        }, 0);
                        const requestingQty = qty;
                        const availableQty = orginalQty - allocatedQtyForBarcode;
                        if (requestingQty > availableQty) {
                            throw new ErrorResponse(1, "Requested qty is more than available qty" + "Barcode" + objectCode + "Requested" + requestingQty + "Available" + availableQty);

                        }
                    }
                }
            }
            //end
            await manager.startTransaction();
            const materialReqHead = new PoWhRequestEntity();
            materialReqHead.companyCode = companyCode;
            materialReqHead.createdUser = username;
            materialReqHead.planCloseDate = reqObj.planCloseDate;
            materialReqHead.sla = reqObj.sla;
            materialReqHead.requestCode = `WR-${ProcessTypeEnum.KNIT}-${processingSerial}-${existingJobs + 1}`;
            materialReqHead.requestedBy = username;
            materialReqHead.unitCode = unitCode;
            materialReqHead.processingSerial = processingSerial;
            materialReqHead.processType = processType;
            const materialReqInfo = await manager.getRepository(PoWhRequestEntity).save(materialReqHead);
            const materialReqHeadHistory = new PoWhRequestHistoryEntity();
            materialReqHeadHistory.companyCode = companyCode;
            materialReqHeadHistory.createdUser = username;
            materialReqHeadHistory.planCloseDate = reqObj.planCloseDate;
            materialReqHeadHistory.sla = reqObj.sla;
            materialReqHeadHistory.requestCode = `WR-${ProcessTypeEnum.KNIT}-${processingSerial}-${existingJobs + 1}`;
            materialReqHeadHistory.requestedBy = username;
            materialReqHeadHistory.unitCode = unitCode;
            // await manager.getRepository(PoWhRequestHistoryEntity).save(materialReqHeadHistory);
            const itemCodeWiseObjectDetails = new Map<string, KG_ObjectWiseAllocationInfo_C[]>()
            for (const groupWiseDetail of reqObj.knitGroupWiseAllocationInfo) {
                for (const itemWiseDetail of groupWiseDetail.itemWiseInfo) {
                    if (!itemCodeWiseObjectDetails.has(itemWiseDetail.itemCode)) {
                        itemCodeWiseObjectDetails.set(itemWiseDetail.itemCode, []);
                    }
                    for (const eachObject of itemWiseDetail.objectWiseDetail) {
                        itemCodeWiseObjectDetails.get(itemWiseDetail.itemCode).push(eachObject)
                    }
                }
            }
            // LOGIC TO DISTRIBUTE THE OBJECTS RELATED TO ITEM CODE TO ITEM CODE RELATED JOBS
            const jobItemWiseAllocationDetails = new Map<string, Map<string, KG_ObjectWiseAllocationInfo_C[]>>();
            const uniqueItemCodes = new Map<string, ItemModel>();
            for (const [itemCode, requestedQty] of itemCodeWiseUserRequestedQty) {
                if (!jobItemWiseAllocationDetails.has(itemCode)) {
                    jobItemWiseAllocationDetails.set(itemCode, new Map<string, KG_ObjectWiseAllocationInfo_C[]>())
                }
            }
            for (const [itemCode, requestedQty] of itemCodeWiseUserRequestedQty) {
                const jobWiseItemCodeReqInfo = itemWiseJobRequiredInfo.get(itemCode);
                const objectWiseDetail = itemCodeWiseObjectDetails.get(itemCode);
                for (const [jobNumber, requiredQtyInfo] of jobWiseItemCodeReqInfo) {
                    if (!jobItemWiseAllocationDetails.get(itemCode).has(jobNumber)) {
                        jobItemWiseAllocationDetails.get(itemCode).set(jobNumber, [])
                    }
                    let jobRemainingQty = requiredQtyInfo.totalRequiredQty;
                    while (jobRemainingQty > 0) {
                        for (const eachObj of objectWiseDetail) {
                            const eligibleToOccupy = Math.min(jobRemainingQty, eachObj.allocatingQuantity);
                            if (eligibleToOccupy > 0) {
                                jobRemainingQty -= eligibleToOccupy;
                                eachObj.allocatingQuantity -= eligibleToOccupy;
                                jobItemWiseAllocationDetails.get(itemCode).get(jobNumber).push(new KG_ObjectWiseAllocationInfo_C(eachObj.objectCode, eligibleToOccupy));
                            }
                        }
                        if (jobRemainingQty > 0) {
                            throw new ErrorResponse(0, 'You cannot partially allocate a job' + `${jobNumber} required quantity ${requiredQtyInfo.totalRequiredQty} but balance to allocate qty is ${jobRemainingQty}`);
                        }
                    }
                };
                const itemDetails = jobItemWiseAllocationDetails.get(itemCode);
                let eachItemData: ItemModel = null;
                if (uniqueItemCodes.has(itemCode)) {
                    eachItemData = uniqueItemCodes.get(itemCode);
                }
                else {
                    const req = new ItemIdRequest(reqObj.username, reqObj.unitCode, reqObj.companyCode, reqObj.userId, null, null, itemCode);
                    const itemData = await this.itemSharedService.getBomItemByItemCode(req);
                    if (!itemData.status) {
                        throw new ErrorResponse(itemData.errorCode, itemData.internalMessage)
                    }
                    uniqueItemCodes.set(itemCode, itemData?.data[0]);
                    eachItemData = itemData?.data[0];
                };
                // console.log(util.inspect(itemDetails, false, null, true));
                for (const [jobNumber, jobDetails] of itemDetails) {
                    let jobWiseAllocatedQty = 0;
                    const objectWiseEntities: PoWhRequestMaterialItemEntity[] = [];
                    const objectWiseHistoryEntity: PoWhRequestMaterialItemHistoryEntity[] = [];
                    for (const eachObject of jobDetails) {
                        // const inventoryInfoOfObject = inventoryBarcodes.find(ob => ob.barcode === objectCode);
                        // if (!inventoryInfoOfObject) {
                        //     throw new ErrorResponse(0, 'Requested Barcode not found in the inventory' + objectCode)
                        // }
                        const objectDetails = objCodeDetailsMap.get(eachObject.objectCode);;
                        jobWiseAllocatedQty += eachObject.allocatingQuantity;
                        const whReqLineItem = new PoWhRequestMaterialItemEntity();
                        whReqLineItem.allocatedQty = eachObject.allocatingQuantity;
                        whReqLineItem.companyCode = companyCode;
                        whReqLineItem.createdUser = username;
                        whReqLineItem.issuedQty = 0;
                        whReqLineItem.itemCode = itemCode;
                        whReqLineItem.itemColor = eachItemData?.itemColor;
                        whReqLineItem.itemDescription = eachItemData?.itemDescription;
                        whReqLineItem.itemName = eachItemData?.itemName;
                        whReqLineItem.itemType = eachItemData?.rmItemType;
                        whReqLineItem.locationCode = objectDetails?.locationCode;
                        whReqLineItem.objectCode = eachObject.objectCode;
                        whReqLineItem.objectType = objectDetails?.objectType;
                        whReqLineItem.supplierCode = objectDetails?.supplierCode;
                        whReqLineItem.unitCode = unitCode;
                        whReqLineItem.vpo = objectDetails?.vpo;
                        whReqLineItem.requiredQty = itemWiseActualRequiredQtyForGivenJobs.get(itemCode)
                        objectWiseEntities.push(whReqLineItem);

                        const whReqLineItemHistory = new PoWhRequestMaterialItemHistoryEntity();
                        whReqLineItemHistory.allocatedQty = eachObject.allocatingQuantity;
                        whReqLineItemHistory.companyCode = companyCode;
                        whReqLineItemHistory.createdUser = username;
                        whReqLineItemHistory.issuedQty = 0;
                        whReqLineItemHistory.itemCode = itemCode;
                        whReqLineItemHistory.itemColor = eachItemData?.itemColor;
                        whReqLineItemHistory.itemDescription = eachItemData?.itemDescription;
                        whReqLineItemHistory.itemName = eachItemData?.itemName;
                        whReqLineItemHistory.itemType = eachItemData?.rmItemType;
                        whReqLineItemHistory.locationCode = objectDetails?.locationCode;
                        whReqLineItemHistory.objectCode = eachObject.objectCode;
                        whReqLineItemHistory.objectType = objectDetails?.objectType;
                        whReqLineItemHistory.supplierCode = objectDetails?.supplierCode;
                        whReqLineItemHistory.unitCode = unitCode;
                        whReqLineItemHistory.vpo = objectDetails?.vpo;
                        objectWiseHistoryEntity.push(whReqLineItemHistory);
                    }
                    const whRequestLineEntity = new PoWhRequestLineEntity();
                    whRequestLineEntity.companyCode = companyCode;
                    whRequestLineEntity.createdUser = username;
                    whRequestLineEntity.itemCode = itemCode;
                    whRequestLineEntity.itemColor = eachItemData?.itemColor;
                    whRequestLineEntity.itemDescription = eachItemData?.itemDescription;
                    whRequestLineEntity.itemName = eachItemData?.itemName;
                    whRequestLineEntity.itemType = eachItemData?.rmItemType;
                    whRequestLineEntity.jobNumber = jobNumber;
                    whRequestLineEntity.processType = processType;
                    whRequestLineEntity.processingSerial = processingSerial;
                    whRequestLineEntity.requiredQty = jobWiseAllocatedQty;
                    whRequestLineEntity.poWhRequestId = materialReqInfo.id;
                    whRequestLineEntity.allocatedQty = jobWiseAllocatedQty;
                    whRequestLineEntity.unitCode = unitCode;
                    whRequestLineEntity.groupCode = 'YET';
                    console.log(util.inspect(whRequestLineEntity, false, null, true));
                    // throw null;
                    const phReqLines = await manager.getRepository(PoWhRequestLineEntity).save(whRequestLineEntity);

                    const whRequestLineHistoryEntity = new PoWhRequestLineHistoryEntity;
                    whRequestLineHistoryEntity.companyCode = companyCode;
                    whRequestLineHistoryEntity.createdUser = username;
                    whRequestLineHistoryEntity.itemCode = itemCode;
                    whRequestLineHistoryEntity.itemColor = eachItemData?.itemColor;
                    whRequestLineHistoryEntity.itemDescription = eachItemData?.itemDescription;
                    whRequestLineHistoryEntity.itemName = eachItemData?.itemName;
                    whRequestLineHistoryEntity.itemType = eachItemData?.rmItemType;
                    whRequestLineHistoryEntity.jobNumber = jobNumber;
                    whRequestLineHistoryEntity.processType = processType;
                    whRequestLineHistoryEntity.processingSerial = processingSerial;
                    whRequestLineHistoryEntity.requiredQty = jobWiseAllocatedQty;
                    whRequestLineHistoryEntity.poWhRequestId = materialReqInfo.id;
                    whRequestLineHistoryEntity.allocatedQty = jobWiseAllocatedQty;
                    // const phReqLinesHistory = await manager.getRepository(PoWhRequestLineHistoryEntity).save(whRequestLineHistoryEntity);
                    for (const objectEntity of objectWiseEntities) {
                        objectEntity.poWhRequestLineId = phReqLines.id
                    }

                    await manager.getRepository(PoWhRequestMaterialItemEntity).save(objectWiseEntities);
                    // await manager.getRepository(PoWhRequestMaterialItemEntity).save(objectWiseHistoryEntity);

                    const jobMaterialInfo = await this.whJobMaterialRepo.findOne({ where: { jobNumber, unitCode, companyCode, itemCode } });
                    if (!jobMaterialInfo) {
                        throw new ErrorResponse(0, 'Job material information not found for the given details' + `${jobNumber} and ${itemCode}`)
                    }
                    let preQty = Number(jobMaterialInfo.allocatedQty);
                    const totalQty = preQty + jobWiseAllocatedQty
                    await manager.getRepository(PoWhKnitJobMaterialEntity).update({ id: jobMaterialInfo.id }, { allocatedQty: totalQty });

                    const jobPlanInfo = await this.knitJObPlanRepo.findOne({ where: { jobNumber, unitCode, companyCode }, select: ['id', 'rawMaterialStatus'] });
                    await manager.getRepository(PoKnitJobPlanEntity).update({ id: jobPlanInfo.id }, { rawMaterialStatus: KJ_MaterialStatusEnum.REQUESTED });
                }
            };
            await manager.completeTransaction();
            // Need to send the request details to WMS
            const reqIdObj = new KMS_C_JobMainMaterialReqIdRequest(username, unitCode, companyCode, userId, materialReqInfo.id);
            await this.wmsService.allocateKnitMaterialByRequestId(reqIdObj);
            return new GlobalResponseObject(true, 0, 'Material Allocated Successfully');
        } catch (err) {
            await manager.releaseTransaction();
            throw err;
        }
    }


    /**
     * Service to de allocate the material for the given request id 
     * Usually calls from UI after introduced
     * TODO:  Need to log these deleting records in the history
     * TODO: Need to call WMS API for the reversal 
     * @param requestId 
     * @param unitCode 
     * @param companyCode 
     * @returns 
    */
    async deAllocateMaterialForRequest(requestId: number, unitCode: string, companyCode: string) {
        const manager = new GenericTransactionManager(this.dataSource);
        try {
            const requestDetails = await this.poWhRequestRepo.findOne({ where: { id: requestId, unitCode, companyCode } });
            if (!requestDetails) {
                throw new ErrorResponse(0, 'Request Details not found. Please check and try again');
            }
            if (requestDetails.status != WhRequestStatusEnum.OPEN) {
                throw new ErrorResponse(0, 'Material is already been partially / fully issued. You cannot de allocate the material');
            }
            const requestLines: PoWhRequestLineEntity[] = await this.poWhLineRequestRepo.find({ where: { poWhRequestId: requestId, unitCode, companyCode } });
            const jobNumberItemCodeQtyMap = new Map<string, Map<string, number>>();
            const requestLineIds: number[] = [];
            for (const eachReqLine of requestLines) {
                if (eachReqLine.issuedQty > 0) {
                    throw new ErrorResponse(0, 'Material is already been partially / fully issued. You cannot de allocate the material' + eachReqLine.id);
                };
                requestLineIds.push(eachReqLine.id);
                if (!jobNumberItemCodeQtyMap.has(eachReqLine.jobNumber)) {
                    jobNumberItemCodeQtyMap.set(eachReqLine.jobNumber, new Map<string, number>());
                }
                if (!jobNumberItemCodeQtyMap.get(eachReqLine.jobNumber).has(eachReqLine.itemCode)) {
                    jobNumberItemCodeQtyMap.get(eachReqLine.jobNumber).set(eachReqLine.itemCode, 0)
                }
                const preAllocatedQty = jobNumberItemCodeQtyMap.get(eachReqLine.jobNumber).get(eachReqLine.itemCode);
                jobNumberItemCodeQtyMap.get(eachReqLine.jobNumber).set(eachReqLine.itemCode, preAllocatedQty + eachReqLine.allocatedQty);
            };
            await manager.startTransaction();
            for (const [jobNumber, itemDetails] of jobNumberItemCodeQtyMap) {
                for (const [itemCode, allocatedQty] of itemDetails) {
                    const whJobDetails = await this.whJobMaterialRepo.findOne({ where: { jobNumber, itemCode, unitCode, companyCode } });
                    if (!whJobDetails) {
                        throw new ErrorResponse(0, `Wh Job Details not found for the item ${itemCode} AND job ${jobNumber}`);
                    }
                    await manager.getRepository(PoWhKnitJobMaterialEntity).update({ id: whJobDetails.id }, { allocatedQty: (whJobDetails.allocatedQty - allocatedQty) });
                }
            };
            if (!requestLineIds.length) {
                throw new ErrorResponse(0, 'Request line ids not found. Please check and try again')
            }
            await manager.getRepository(PoWhRequestMaterialItemEntity).delete({ poWhRequestLineId: In(requestLineIds), unitCode, companyCode });
            await manager.getRepository(PoWhRequestLineEntity).delete({ poWhRequestId: requestId, unitCode, companyCode });
            await manager.getRepository(PoWhRequestEntity).delete({ id: requestId, unitCode, companyCode });
            await manager.completeTransaction();
            return new GlobalResponseObject(true, 0, 'De Allocation completed Successfully')
        } catch (err) {
            await manager.releaseTransaction();
            throw err;
        }

    }

    /**
     * Service to get material allocation details for the knit group 
     * It gives item code wise already allocated qty etc..
     * @param reqObj 
     * @param config 
     * @returns 
    */
    async getMaterialAllocationDetailsForKnitGroup(reqObj: KC_KnitGroupPoSerialRequest): Promise<KG_KnitJobMaterialAllocationResponse> {
        const { knitGroup, unitCode, companyCode, processingSerial, processType } = reqObj;
        const totalAllocationDetails: KG_KnitJobMaterialAllocationModel_R[] = [];
        const groupRelatedRequests = await this.poWhLineRequestRepo.find({ where: { groupCode: knitGroup, unitCode, companyCode, processingSerial, processType }, select: ['id'] });
        const materialRequestIds = groupRelatedRequests.map(whLine => whLine.id);
        for (const eachRequest of materialRequestIds) {
            const requestDetails = await this.poWhRequestRepo.findOne({ where: { processingSerial, processType, unitCode, companyCode, id: eachRequest } });
            const knitJobNumbers = new Set<string>();
            const requestLineDetails = await this.poWhLineRequestRepo.find({ where: { poWhRequestId: eachRequest, unitCode, companyCode } });
            const itemCodeWiseDetails: KG_ItemWiseAllocationModel_R[] = [];
            for (const eachLine of requestLineDetails) {
                knitJobNumbers.add(eachLine.jobNumber);
            }
            // for (const eachItemCode of reqWiseMaterialDetails) {
            //     const objectWiseDetails: KG_ObjectWiseAllocationInfo_R[] = [];
            //     const itemAllocationDetails = new KG_ItemWiseAllocationModel_R(eachItemCode.itemCode, eachItemCode.allocatedQty, objectWiseDetails);
            //     const reqMaterialItemDetails = await this.poWhRequestItemRepo.find({ where: { poWhRequestMaterialId: eachItemCode.id, unitCode, companyCode } });
            //     for (const eachObject of reqMaterialItemDetails) {
            //         const objectDetail = new KG_ObjectWiseAllocationInfo_R(eachObject.objectType, eachObject.objectCode, eachObject.locationCode, eachObject.supplierCode, eachObject.vpo, eachObject.issuedQty, eachObject.allocatedQty, 0);
            //         objectWiseDetails.push(objectDetail);
            //     }
            //     itemCodeWiseDetails.push(itemAllocationDetails)
            // }
            const allocationRequest = new KG_KnitJobMaterialAllocationModel_R(eachRequest, requestDetails.requestCode, knitGroup, Array.from(knitJobNumbers), itemCodeWiseDetails);
            totalAllocationDetails.push(allocationRequest);
        }
        return new KG_KnitJobMaterialAllocationResponse(true, 0, 'Already Material Allocation details retrieved successfully.', totalAllocationDetails);
    }

    /**
     * Service to get knitting job wise material allocation details for given knit group
     * Usually calls from UI to show already allocated quantity for particular job
     * @param reqObj 
     * @param config 
     * @returns 
    */
    async getJobWiseMaterialAllocationDetailsForKnitGroup(reqObj: KG_JobWiseMaterialAllocationDetailRequest): Promise<KG_JobWiseMaterialAllocationDetailResponse> {
        const { knitGroup, unitCode, companyCode, processingSerial, processType } = reqObj;
        const jobWiseMaterialAllocationDetails: KG_JobWiseMaterialAllocationDetail[] = [];
        const knitJobNumbers = new Set<string>();
        const groupRelatedRequests = await this.poWhLineRequestRepo.find({ where: { groupCode: knitGroup, unitCode, companyCode, processingSerial, processType }, select: ['id'] });
        const materialRequestIds = groupRelatedRequests.map(whLine => whLine.id);
        for (const eachRequest of materialRequestIds) {
            const requestLineDetails = await this.poWhLineRequestRepo.find({ where: { poWhRequestId: eachRequest, unitCode, companyCode }, select: ['jobNumber'] });
            for (const eachLine of requestLineDetails) {
                knitJobNumbers.add(eachLine.jobNumber);
            }
        }
        for (const eachKnitJob of knitJobNumbers) {
            const materialDetailsForJob: KG_ItemWiseAllocationModel_R[] = [];
            const requestLineDetails = await this.poWhLineRequestRepo.find({ where: { jobNumber: eachKnitJob, unitCode, companyCode } });
            for (const eachJobLine of requestLineDetails) {
                const objectDetails: KG_ObjectWiseAllocationInfo_R[] = [];
                const objectWiseJobMaterialDetails = await this.poWhRequestItemRepo.find({ where: { poWhRequestLineId: eachJobLine.id, unitCode, companyCode } });
                for (const eachObj of objectWiseJobMaterialDetails) {
                    const objectDetail = new KG_ObjectWiseAllocationInfo_R(eachObj.itemType, eachObj.objectCode, eachObj.locationCode, eachObj.supplierCode, eachObj.vpo, 0, eachObj.issuedQty, eachObj.allocatedQty, 0);
                    objectDetails.push(objectDetail);
                }
                const materialDetail = new KG_ItemWiseAllocationModel_R(eachJobLine.itemCode, eachJobLine.requiredQty, objectDetails);
                materialDetailsForJob.push(materialDetail);
            }
            const jobWiseMaterialInfo = new KG_JobWiseMaterialAllocationDetail(eachKnitJob, []);
            jobWiseMaterialAllocationDetails.push(jobWiseMaterialInfo);
        }
        return new KG_JobWiseMaterialAllocationDetailResponse(true, 0, '', jobWiseMaterialAllocationDetails);
    }

    /**
     * Service to get the material requirement details for each given job 
     * @param reqObj 
     * @returns 
    */
    async getMaterialRequirementForEachGivenJob(reqObj: KG_MaterialRequirementForKitGroupRequest): Promise<Map<string, KG_KnitGroupMaterialRequirementModel[]>> {
        const { unitCode, companyCode, processType, processingSerial, jobNumbers } = reqObj;
        const responses: KG_MaterialRequirementDetailResp[] = [];
        const jobWiseRequirementDetails = new Map<string, KG_KnitGroupMaterialRequirementModel[]>();

        for (const eachJob of reqObj.jobNumbers) {
            const itemReqForJobs = await this.whJobMaterialRepo.find({ where: { jobNumber: eachJob, unitCode, companyCode } });
            if (!itemReqForJobs.length) {
                throw new ErrorResponse(0, 'Job Requirement details not found . please check and try again');
            }
            const itemCodeKnitGroupReqQtyMap = new Map<string, Map<string, number>>();
            for (const eachJobReq of itemReqForJobs) {
                if (!itemCodeKnitGroupReqQtyMap.has(eachJobReq.itemCode)) {
                    itemCodeKnitGroupReqQtyMap.set(eachJobReq.itemCode, new Map<string, number>());
                }
                if (!itemCodeKnitGroupReqQtyMap.get(eachJobReq.itemCode).has(eachJobReq.groupCode)) {
                    itemCodeKnitGroupReqQtyMap.get(eachJobReq.itemCode).set(eachJobReq.groupCode, 0);
                }
                const preQty = itemCodeKnitGroupReqQtyMap.get(eachJobReq.itemCode).get(eachJobReq.groupCode);
                itemCodeKnitGroupReqQtyMap.get(eachJobReq.itemCode).set(eachJobReq.groupCode, preQty + (Number(eachJobReq.requiredQty) - Number(eachJobReq.allocatedQty)));

            }
            const moNumbersForJobs = await this.getMoNumbersForJobNumber(reqObj.jobNumbers, unitCode, companyCode);
            let groupCodes = new Set<string>();
            const itemWiseRequirementDetails: KG_ItemWiseMaterialRequirementModel[] = [];
            for (const [itemCode, groupInfo] of itemCodeKnitGroupReqQtyMap) {
                const itemIdRequest = new ItemIdRequest(reqObj.username, reqObj.unitCode, reqObj.companyCode, reqObj.userId, 0, '', itemCode);
                const itemInfo = await this.itemSharedService.getBomItemByItemCode(itemIdRequest);
                if (!itemInfo.status) {
                    throw new ErrorResponse(itemInfo.errorCode, itemInfo.internalMessage);
                }
                let totalReqQty = 0
                for (const [groupCode, qty] of groupInfo) {
                    groupCodes.add(groupCode);
                    totalReqQty += qty;
                };
                const inventoryReq = new StockCodesRequest(null, unitCode, companyCode, null, itemCode, [], [], Array.from(moNumbersForJobs));
                const inventoryDetails = await this.packListService.getInStockObjectsForItemCode(inventoryReq);
                if (!inventoryDetails.status) {
                    throw new ErrorResponse(inventoryDetails.errorCode, inventoryDetails.internalMessage);
                };
                const inventoryObjects: KG_ObjectWiseAllocationInfo_R[] = [];
                for (const eachInventoryItem of inventoryDetails.data) {
                    const alreadyAllocatedQtyDetail = await this.poWhRequestItemRepo.find({ where: { unitCode, companyCode, itemCode, objectCode: eachInventoryItem.barcode }, select: ['allocatedQty'] });
                    let allocatedQtyForBarcode = alreadyAllocatedQtyDetail.reduce((pre, curr) => {
                        return pre + curr.allocatedQty;
                    }, 0);
                    const inventoryObject = new KG_ObjectWiseAllocationInfo_R(eachInventoryItem.objectType, eachInventoryItem.barcode, eachInventoryItem.locationCode, eachInventoryItem.supplierCode, eachInventoryItem.vpo, (eachInventoryItem.originalQty - allocatedQtyForBarcode), eachInventoryItem.issuedQuantity, allocatedQtyForBarcode, 0);
                    inventoryObjects.push(inventoryObject);
                };
                const itemCodeDetail = itemReqForJobs.filter(job => job.itemCode == itemCode);
                const totalRequiredQty = itemCodeDetail.reduce((pre, curr) => {
                    return pre + Number(curr.requiredQty);
                }, 0);
                const totalAllocatedQty = itemCodeDetail.reduce((pre, curr) => {
                    return pre + Number(curr.allocatedQty);
                }, 0);
                const totalIssuedQty = itemCodeDetail.reduce((pre, curr) => {
                    return pre + Number(curr.issuedQty);
                }, 0)
                itemWiseRequirementDetails.push(new KG_ItemWiseMaterialRequirementModel(itemCode, itemInfo.data[0].itemName, itemInfo.data[0].itemDescription, itemInfo.data[0].itemColor, itemInfo.data[0].bomItemType as PhItemCategoryEnum, totalRequiredQty, totalAllocatedQty, totalIssuedQty, inventoryObjects));
            }
            jobWiseRequirementDetails.set(eachJob, [new KG_KnitGroupMaterialRequirementModel(Array.from(groupCodes).toString(), itemWiseRequirementDetails)]);
        }
        return jobWiseRequirementDetails;
        // const kGWiseJobsMap = new Map<string, Map<string, Map<string, Map<string, number>>>>();
        // const moProductSubLineIds = new Set<number>();

        // const knitJobInfos = await this.poKnitJobRepo.find({
        //     where: { knitJobNumber: In(jobNumbers), unitCode, companyCode, processingSerial, processType }
        // });
        // if (knitJobInfos.length !== jobNumbers.length) {
        //     throw new ErrorResponse(0, `Some Knit Jobs not found. Please check and try again.`);
        // }
        // for (const knitJobInfo of knitJobInfos) {
        //     if (!kGWiseJobsMap.has(knitJobInfo.groupCode)) {
        //         kGWiseJobsMap.set(knitJobInfo.groupCode, new Map());
        //     }
        //     const jobLineInfos = await this.poKnitJobLineRepo.find({
        //         where: { knitJobNumber: knitJobInfo.knitJobNumber, unitCode, companyCode, processingSerial, processType }
        //     });
        //     for (const eachJobLine of jobLineInfos) {
        //         const jobSubLineInfos = await this.poKnitJobSubLineRepo.find({
        //             where: { poKnitJobLineId: eachJobLine.id, unitCode, companyCode }
        //         });
        //         for (const eachSubLine of jobSubLineInfos) {
        //             const bundleInfo = await this.poKnitJobPslMap.find({
        //                 where: { poJobSubLineId: eachSubLine.id, unitCode, companyCode }
        //             });
        //             bundleInfo.forEach(bundle => moProductSubLineIds.add(bundle.moProductSubLineId));

        //             const productInfo = await this.poProductRepo.findOne({
        //                 where: { productRef: eachSubLine.productRef, unitCode, companyCode, processingSerial, processType }
        //             });
        //             const productMap = kGWiseJobsMap.get(knitJobInfo.groupCode);
        //             if (!productMap.has(productInfo.productCode)) {
        //                 productMap.set(productInfo.productCode, new Map());
        //             }
        //             const colorMap = productMap.get(productInfo.productCode);
        //             if (!colorMap.has(eachSubLine.fgColor)) {
        //                 colorMap.set(eachSubLine.fgColor, new Map());
        //             }
        //             const sizeMap = colorMap.get(eachSubLine.fgColor);
        //             sizeMap.set(eachSubLine.size, (sizeMap.get(eachSubLine.size) || 0) + eachSubLine.quantity);
        //         }
        //     }
        // }
        // const sizeWiseConsumptionDetails = await this.knitConfigService.getSizeWiseComponentConsumptionForPo(
        //     processType, Array.from(moProductSubLineIds), unitCode, companyCode
        // );
        // for (const eachJob of jobNumbers) {
        //     const kgWiseMaterialRequirementDetails: KG_KnitGroupMaterialRequirementModel[] = [];
        //     const itemWiseConsumptionMap = new Map<string, number>();
        //     for (const [eachKnitGroup, knitGroupJobs] of kGWiseJobsMap) {
        //         const itemWiseRequirementDetails: KG_ItemWiseMaterialRequirementModel[] = [];
        //         for (const [productCode, productInfo] of knitGroupJobs) {
        //             const itemsRequiredForProductCode = sizeWiseConsumptionDetails.filter(item => item.productCode == productCode);
        //             for (const [fgColor, colorInfo] of productInfo) {
        //                 const itemsRequiredForFgColor = itemsRequiredForProductCode.find(item => item.fgColor == fgColor);
        //                 for (const eachItem of itemsRequiredForFgColor.fabCons) {
        //                     let totalConsumption = 0;
        //                     for (const [size, qty] of colorInfo) {
        //                         const sizeConsumptionOfMaterial = eachItem.sizeCons.find(item => item.size == size);
        //                         if (!sizeConsumptionOfMaterial) {
        //                             throw new ErrorResponse(0, `Requirement details not found for the ${eachItem.itemCode} ${fgColor} ${productCode} ${size}`);
        //                         }
        //                         totalConsumption += sizeConsumptionOfMaterial.cons * qty;
        //                     }
        //                     itemWiseConsumptionMap.set(eachItem.itemCode, (itemWiseConsumptionMap.get(eachItem.itemCode) || 0) + totalConsumption);
        //                 }
        //             }
        //         }
        //         for (const [itemCode, consumption] of itemWiseConsumptionMap) {
        //             let alreadyAllocatedQty = 0;
        //             let alreadyIssuedQty = 0;
        //             const materialReqLineInfo = await this.poWhLineRequestRepo.findOne({
        //                 where: { jobNumber: eachJob, unitCode, companyCode, processingSerial, processType, itemCode, isActive: true }
        //             });
        //             if (materialReqLineInfo) {
        //                 alreadyAllocatedQty = materialReqLineInfo.allocatedQty;
        //                 alreadyIssuedQty = materialReqLineInfo.issuedQty;
        //             }
        //             const requiredQty = (consumption - alreadyAllocatedQty);
        //             itemWiseRequirementDetails.push(new KG_ItemWiseMaterialRequirementModel(
        //                 itemCode, null, null, null, null, requiredQty, alreadyAllocatedQty, alreadyIssuedQty, []
        //             ));
        //         }
        //         kgWiseMaterialRequirementDetails.push(new KG_KnitGroupMaterialRequirementModel(eachKnitGroup, itemWiseRequirementDetails));
        //     }
        //     jobWiseRequirementDetails.set(eachJob, kgWiseMaterialRequirementDetails);
        // }
        // return jobWiseRequirementDetails;
    }

    /**
     * Service to get the material allocation detail for the given knit job
     * @param reqObj 
     * @returns 
    */
    async getJobWiseMaterialAllocationDetailsForKnitJob(reqObj: KJ_C_KnitJobNumberRequest): Promise<KG_JobWiseMaterialAllocationDetailResponse> {
        const { unitCode, companyCode, jobNumbers } = reqObj;
        const jobWiseMaterialAllocationDetails: KG_JobWiseMaterialAllocationDetail[] = [];
        for (const eachKnitJob of jobNumbers) {
            const materialDetailsForJob: KG_ItemWiseAllocationModel_R[] = [];
            const requestLineDetails = await this.poWhLineRequestRepo.find({ where: { jobNumber: eachKnitJob, unitCode, companyCode } });
            for (const eachJobLine of requestLineDetails) {
                const objectDetails: KG_ObjectWiseAllocationInfo_R[] = [];
                const objectWiseJobMaterialDetails = await this.poWhRequestItemRepo.find({ where: { poWhRequestLineId: eachJobLine.id, unitCode, companyCode } });
                for (const eachObj of objectWiseJobMaterialDetails) {
                    const objectDetail = new KG_ObjectWiseAllocationInfo_R(eachObj.itemType, eachObj.objectCode, eachObj.locationCode, eachObj.supplierCode, eachObj.vpo, 0, eachObj.issuedQty, eachObj.allocatedQty, 0);
                    objectDetails.push(objectDetail);
                }
                const materialDetail = new KG_ItemWiseAllocationModel_R(eachJobLine.itemCode, eachJobLine.requiredQty, objectDetails);
                materialDetailsForJob.push(materialDetail);
            }
            const jobWiseMaterialInfo = new KG_JobWiseMaterialAllocationDetail(eachKnitJob, materialDetailsForJob);
            jobWiseMaterialAllocationDetails.push(jobWiseMaterialInfo);
        }
        return new KG_JobWiseMaterialAllocationDetailResponse(true, 0, '', jobWiseMaterialAllocationDetails);
    }


    /**
     * Service to get the requested Knit materials for the Material request id
     * Usually calls from WMS, Once the request is raised from the KMS
     * @param reqObj getRequestedKnitMaterialForReqId
     * @param config 
     * @returns 
    */
    async getRequestedKnitMaterialForReqId(reqObj: KMS_C_JobMainMaterialReqIdRequest): Promise<KMS_R_KnitJobRequestedItemsResponse> {
        const { unitCode, companyCode, reqId } = reqObj;
        const materialReqDetails: KMS_R_KnitJobRequestedMaterialModel[] = [];
        const requestDetails = await this.poWhRequestRepo.find({ where: { id: reqId, unitCode, companyCode } });

        if (!requestDetails.length) {
            throw new ErrorResponse(0, 'Request details not found for given request id . Please check and try again');
        };
        for (const eachRequest of requestDetails) {
            const jobReqDetail = await this.poWhLineRequestRepo.find({ where: { poWhRequestId: eachRequest.id, unitCode, companyCode } });
            const jobNumbers = jobReqDetail.map(job => job.jobNumber);
            const moNumberSet = await this.getMoNumbersForJobNumber(jobNumbers, unitCode, companyCode);
            const requestedItemsInfo: KMS_R_KnitJobRequestedItemsModel[] = [];
            for (const eachLine of jobReqDetail) {
                const objectInfo = await this.poWhRequestItemRepo.find({ where: { poWhRequestLineId: eachLine.id, unitCode, companyCode } });
                for (const eachObject of objectInfo) {
                    const objectWiseInfo = new KMS_R_KnitJobRequestedItemsModel(null, eachObject.objectCode, eachObject.itemCode, eachObject.allocatedQty);
                    requestedItemsInfo.push(objectWiseInfo);
                }
            }
            const materialJobReq = new KMS_R_KnitJobRequestedMaterialModel(jobNumbers, Array.from(moNumberSet).toString(), `${eachRequest.planCloseDate}`, eachRequest.requestCode, `${eachRequest.createdAt}`, eachRequest.requestedBy, requestedItemsInfo);
            materialReqDetails.push(materialJobReq);
        }
        return new KMS_R_KnitJobRequestedItemsResponse(true, 0, 'Material Request related details retrieved successfully', materialReqDetails)
    }

    /**
     * Service to update issued quantity for knit materials from after getting the info from WMS against to each item code and job
     * make an API to WMS and get the items issued under a issuance id getIssuedItemsUnderAIssuanceId
     * fill the items from top to bottom based on the item code and the extRefId
     * after doing all the activity make an API call to WMS to update the handled status in the WMS
     * TODO : Need to integrate this with WMS for issuance.  --DONE
     * TODO : Need to get the item details from master  --DONE
     * @param req 
     * @returns 
     */
    async updateIssuedKnitMaterialFromWms(req: WMS_C_IssuanceIdRequest): Promise<GlobalResponseObject> {
        const { issuanceId, unitCode, companyCode, userId, username } = req;
        const manager = new GenericTransactionManager(this.dataSource);
        try {
            const issuedInfo: WMS_R_IssuanceIdItemsResponse = await this.wmsService.getIssuedItemsUnderIssuanceId(req);
            if (!issuedInfo.status) {
                throw new ErrorResponse(issuedInfo.errorCode, issuedInfo.internalMessage)
            };
            const existingIssuanceInfo: PoWhKnitJobMaterialIssuanceEntity[] = await this.whMaterialIssuance.find({ where: { issuanceId, unitCode, companyCode } });
            if (existingIssuanceInfo.length) {
                throw new ErrorResponse(0, 'Issuance Already done for this id, Please check and try again');
            }
            const actIssuanceData: WMS_R_IssuanceIdItemsModel[] = issuedInfo.data;
            const jobNumbersAdded = new Set<string>();
            const jobItemColorSizeQtyMap = new Map<string, Map<string, number>>();
            const whLineWiseIssuedQty = new Map<number, number>();
            await manager.startTransaction();
            for (const eachIssuance of actIssuanceData) {
                const whReqDetails = await this.poWhRequestRepo.findOne({ where: { id: Number(eachIssuance.extRefId), unitCode, companyCode } });
                if (!whReqDetails) {
                    throw new ErrorResponse(0, 'Warehouse request not found for the given details. Please check and try again')
                }
                const whReqLineInfo = await this.poWhLineRequestRepo.find({ where: { poWhRequestId: whReqDetails.id, unitCode, companyCode }, select: ['id'] });
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
                        totalAllocatedQty += Number(allowableQty);
                        if (allowableQty > 0) {
                            const updatedQty = Number(eachObjectLine.allocatedQty) + Number(allowableQty);
                            await manager.getRepository(PoWhRequestMaterialItemEntity).update({ id: eachObjectLine.id, unitCode, companyCode }, { issuedQty: updatedQty, updatedUser: req.username });
                            const lineInfo = await this.poWhLineRequestRepo.findOne({ where: { id: eachObjectLine.poWhRequestLineId, unitCode, companyCode } });
                            if (!whLineWiseIssuedQty.has(eachObjectLine.poWhRequestLineId)) {
                                whLineWiseIssuedQty.set(eachObjectLine.poWhRequestLineId, 0);
                            };
                            const preQty = whLineWiseIssuedQty.get(eachObjectLine.poWhRequestLineId);
                            whLineWiseIssuedQty.set(eachObjectLine.poWhRequestLineId, preQty + pendingToIssuance);
                            if (!jobItemColorSizeQtyMap.has(lineInfo.jobNumber)) {
                                jobItemColorSizeQtyMap.set(lineInfo.jobNumber, new Map<string, number>());
                            }
                            if (!jobItemColorSizeQtyMap.get(lineInfo.jobNumber).has(eachObjectLine.itemCode)) {
                                jobItemColorSizeQtyMap.get(lineInfo.jobNumber).set(eachObjectLine.itemCode, 0)
                            };
                            const preQtyOfJob = jobItemColorSizeQtyMap.get(lineInfo.jobNumber).get(eachObjectLine.itemCode)
                            jobItemColorSizeQtyMap.get(lineInfo.jobNumber).set(eachObjectLine.itemCode, preQtyOfJob + allowableQty);
                            jobNumbersAdded.add(lineInfo.jobNumber);
                            const issuanceObj = new PoWhKnitJobMaterialIssuanceEntity();
                            issuanceObj.allocatedQty = eachObjectLine.allocatedQty;
                            issuanceObj.companyCode = companyCode;
                            issuanceObj.createdUser = username;
                            issuanceObj.groupCode = lineInfo.groupCode;
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
                            await manager.getRepository(PoWhKnitJobMaterialIssuanceEntity).save(issuanceObj);
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
                await manager.getRepository(PoKnitJobPlanEntity).update({ jobNumber: eachJobNumber }, { rawMaterialStatus: KJ_MaterialStatusEnum.COMPLETELY_ISSUED })
            };
            for (const [job, itemCodeDetail] of jobItemColorSizeQtyMap) {
                for (const [itemSku, qty] of itemCodeDetail) {
                    await manager.getRepository(PoWhKnitJobMaterialEntity).update({ jobNumber: job, itemCode: itemSku, unitCode, companyCode }, { issuedQty: qty });
                }
            }
            for (const [lineId, qty] of whLineWiseIssuedQty) {
                await manager.getRepository(PoWhRequestLineEntity).update({ id: lineId }, { issuedQty: qty, updatedUser: username });
            }
            await manager.completeTransaction();
            return new GlobalResponseObject(true, 0, 'Material Issued Successfully for the jobs')
        } catch (err) {
            await manager.releaseTransaction();
            throw err;
        }
    }



    // async reverseTheIssuanceForKnitMaterial(issuanceId: number, unitCode: string, companyCode: string) {
    //     const issuanceDetails = await this.whMaterialIssuance.find({where: {id: issuanceId, unitCode, companyCode}});
    //     if (!issuanceDetails.length) {
    //         throw new ErrorResponse(0, 'Issuance Details not found. Please check and try again');
    //     };
    //     sfsdf

    // }


    async getMoNumbersForJobNumber(jobNumbers: string[], unitCode: string, companyCode: string): Promise<Set<string>> {
        const moProductSubLineDetails = await this.poKnitJobPslMap.find({ where: { jobNumber: In(jobNumbers), unitCode, companyCode }, select: ['moProductSubLineId', 'processingSerial', 'processType'] });
        if (!moProductSubLineDetails.length) {
            throw new ErrorResponse(0, 'Product sub line details not found for the given jobs ')
        }
        const moProductSubLineIds = moProductSubLineDetails.map(id => id.moProductSubLineId);
        const processingSerial = moProductSubLineDetails[0].processingSerial;
        const processType = moProductSubLineDetails[0].processType;
        const subLineDetails = await this.poSubLineFeaturesRepo.find({ where: { moProductSubLineId: In(moProductSubLineIds), unitCode, companyCode, processingSerial, processType }, select: ['moNumber'] });
        const moNumberSet = new Set<string>();
        for (const eachSubLine of subLineDetails) {
            moNumberSet.add(eachSubLine.moNumber)
        }
        return moNumberSet;
    }
}
