import { Inject, Injectable } from "@nestjs/common";
import { ErrorResponse } from "@xpparel/backend-utils";
import { PackItemsModel, PackJobItems, PackJobResponseModel, PackJobsByPackListIdsRequest, PackJobsResponseForPackList, PackMatReqModel, PackMatReqStatusDisplayValue, PackMatReqStatusEnum, PK_ItemWiseMaterialRequirementModel, PK_MaterialRequirementDetailResp, PK_ObjectWiseAllocationInfo_R, PKMS_C_JobTrimReqIdRequest, PKMS_R_JobTrimItemModel, PKMS_R_JobTrimMaterialModel, PKMS_R_JobTrimResponse, PKMSInspectionHeaderAttributesEnum, StockCodesRequest, StockObjectInfoModel } from "@xpparel/shared-models";
import { PackingListService } from "@xpparel/shared-services";
import { DataSource, In } from "typeorm";
import { CartonRepo } from "../packing-list/repositories/carton-repo";
import { PLConfigRepo } from "../packing-list/repositories/config.repo";
import { JobHeaderRepoInterface } from "../packing-list/repositories/job-header-repo.interface";
import { PackJobReqAttributeRepoInterFace } from "../packing-list/repositories/pack-job-attribute-repo-interface";
import { PackMatReqWhItemRepoInterface } from "./repositories/pack-material-req-wh-item.interface";
import { PackingMaterialReqRepo } from "./repositories/packing-material-req.repo";
import { PackMatReqLinesRepo } from "./repositories/pack-mat-req-lines.repo";
import { ItemsRepo } from "../__masters__/items/repositories/items.repo";
import { JobHeaderRepo } from "../packing-list/repositories/job-header.repo";
import { PackMaterialRequestEntity } from "./entities/material-request.entity";

@Injectable()
export class PAckingMaterialReqInfoService {
    constructor(
        @Inject('PLConfigRepoInterface')
        private readonly packListRepo: PLConfigRepo,
        @Inject('JobHeaderRepoInterface')
        private readonly packJobRepo: JobHeaderRepoInterface,
        @Inject('CartonRepoInterFace')
        private readonly cartonRepo: CartonRepo,
        @Inject('PackJobReqAttributeRepoInterFace')
        private readonly packJobReqAttributeRepo: PackJobReqAttributeRepoInterFace,
        @Inject('PackMatReqWhItemRepoInterface')
        private readonly packMatReqWhItemRepo: PackMatReqWhItemRepoInterface,
        @Inject('PackingMaterialReqRepoInterface')
        private readonly pmrRepo: PackingMaterialReqRepo,
        @Inject('PackMatReqLinesRepoInterface')
        private readonly pmItemLineRepo: PackMatReqLinesRepo,
        private readonly itemRepo: ItemsRepo,
        private readonly jobHeader: JobHeaderRepo,
        private packListService: PackingListService,
        private dataSource: DataSource
    ) { }



    async getPackJobsForPackListIds(req: PackJobsByPackListIdsRequest): Promise<PackJobsResponseForPackList> {
        const packListData = await this.packListRepo.findOne({ where: { id: req.packListId } });
        if (!packListData) {
            throw new ErrorResponse(36038, 'Data not available with given Pack list Id')
        }
        const packJobs = await this.packJobRepo.find({ where: { packList: req.packListId, companyCode: req.companyCode, unitCode: req.unitCode } })
        const materialReqIds = packJobs.map(rec => rec.pkMatReqId);
        const materialReqMap = new Map<string, PackMatReqStatusEnum>();
        const materialStatus = await this.dataSource.getRepository(PackMaterialRequestEntity).find({ select: ['matStatus', 'requestNo'], where: { id: In(materialReqIds) } });
        for (const rec of materialStatus) {
            materialReqMap.set(rec.requestNo, rec.matStatus)
        }
        const qtyCarton: PackJobItems[] = [];
        for (const packJob of packJobs) {

            const packJobItem = new PackJobItems(packJob.id, packJob.jobNumber, packJob.jobQty, [], packJob.pkMatReqId ? true : false, packJob.pkMatReqNo, materialReqMap.get(packJob.pkMatReqNo)   );
            const cartonItemData = await this.cartonRepo.getCartonItemsDataOfPackJob(packJob.id);
            const cartonsCount = await this.cartonRepo.count({ where: { pkJobId: packJob.id, companyCode: req.companyCode, unitCode: req.unitCode } });
            for (const cartonItem of cartonItemData) {
                packJobItem.itemsData.push(new PackItemsModel(cartonItem.item_id, cartonItem.item_code, cartonsCount, cartonItem.category, false));
                //polyBags
                const polyBagItemData = await this.cartonRepo.getPolyItemsDataOfPackJob(packJob.id, cartonItem.carton_proto_id);
                for (const polyBag of polyBagItemData) {
                    packJobItem.itemsData.push(new PackItemsModel(polyBag.item_id, polyBag.item_code, polyBag.count * cartonsCount, polyBag.category, false));
                }
            }
            qtyCarton.push(packJobItem);
        }
        return new PackJobsResponseForPackList(true, 36106, 'pack jobs retrieved successfully', new PackJobResponseModel(packListData.poId, req.packListId, qtyCarton))
    }



    async getStockInfoForGivenItems(unitCode: string, companyCode: string, moNumbersForJobs: Set<string>, itemCodes: string[]) {
        const resultMap = new Map<string, StockObjectInfoModel[]>();
        await Promise.all(
            itemCodes.map(async (itemCode) => {
                const inventoryReq = new StockCodesRequest(null, unitCode, companyCode, null, itemCode, [], [], Array.from(moNumbersForJobs)
                );
                const inventoryDetails = await this.packListService.getInStockObjectsForItemCode(inventoryReq);

                if (!inventoryDetails.status) {
                    throw new ErrorResponse(inventoryDetails.errorCode, inventoryDetails.internalMessage);
                }

                resultMap.set(itemCode, inventoryDetails.data);
            })
        );
        return resultMap;
    }

    async getMoNumbersForJobNumber(jobIds: number[], unitCode: string, companyCode: string): Promise<Set<string>> {
        const userReq = { companyCode, unitCode };
        const moNosAttrs = await this.packJobReqAttributeRepo.find({ select: ['attributeValue'], where: { packJobId: In(jobIds), attributeName: PKMSInspectionHeaderAttributesEnum.MO_NO, ...userReq } })
        if (!moNosAttrs.length) {
            throw new ErrorResponse(0, 'Product sub line details not found for the given jobs ')
        }
        const moNumberSet = new Set<string>();
        for (const moData of moNosAttrs) {
            moNumberSet.add(moData.attributeValue)
        }
        return moNumberSet;
    }

    async getBOMInfoForPackJobs(req: PackMatReqModel): Promise<PK_MaterialRequirementDetailResp> {
        let objectMap = new Map<string, StockObjectInfoModel[]>();
        const packJobIds = req.packJobItems.map(x => x.packJobId);
        const moNumbers = await this.getMoNumbersForJobNumber(packJobIds, req.unitCode, req.companyCode);
        const itemCodes = new Set<string>();
        const itemCodeQtyMap = new Map<string, number>();
        req.packJobItems.forEach(packJob => {
            packJob.itemsData.forEach(item => {
                itemCodes.add(item.itemCode);
                if (itemCodeQtyMap.has(item.itemCode)) {
                    itemCodeQtyMap.set(item.itemCode, itemCodeQtyMap.get(item.itemCode) + item.qty)
                } else {
                    itemCodeQtyMap.set(item.itemCode, item.qty)
                }

            })
        });
        req.extraItems.forEach(item => {
            itemCodes.add(item.itemCode)
        })
        objectMap = await this.getStockInfoForGivenItems(req.unitCode, req.companyCode, moNumbers, Array.from(itemCodes));
        const itemWiseRequirement: PK_ItemWiseMaterialRequirementModel[] = [];
        for (const [itemCode, stockDetails] of objectMap) {
            const stockData = stockDetails?.[0];
            const objectType: any = stockData?.objectType;
            const itemName = stockData?.itemName;
            const itemDescription = stockData?.itemDesc;
            const itemColor = stockData?.itemColor;
            const obj = new PK_ItemWiseMaterialRequirementModel(itemCode, itemName, itemDescription, itemColor, objectType, itemCodeQtyMap.get(itemCode), 0, 0, stockDetails.map(x => new PK_ObjectWiseAllocationInfo_R(x.objectType, x.barcode, x.locationCode, x.supplierCode, x.vpo, x.leftOverQuantity, x.issuedQuantity, 0, 0)));
            itemWiseRequirement.push(obj);
        }
        return new PK_MaterialRequirementDetailResp(true, 0, 'Material requirement details retrieved successfully', itemWiseRequirement);
    }

    async getRequestedTrimMaterialForReqId(reqObj: PKMS_C_JobTrimReqIdRequest): Promise<PKMS_R_JobTrimResponse> {
        const { unitCode, companyCode, reqId } = reqObj;
        const materialReqDetails: PKMS_R_JobTrimMaterialModel[] = [];
        const requestDetails = await this.pmrRepo.find({ where: { id: reqId, unitCode, companyCode } });

        if (requestDetails.length == 0) {
            throw new ErrorResponse(0, 'Request details not found for given request id . Please check and try again');
        };
        for (const eachRequest of requestDetails) {
            const jobReqDetail = await this.pmItemLineRepo.find({ where: { pkMatReqId: eachRequest.id, unitCode, companyCode } });
            const jobIds = jobReqDetail.map(job => job.pkJobId);
            const moNumberSet = await this.getMoNumbersForJobNumber(jobIds, unitCode, companyCode);
            const requestedItemsInfo: PKMS_R_JobTrimItemModel[] = [];
            for (const eachLine of jobReqDetail) {
                const objectInfo = await this.packMatReqWhItemRepo.find({ where: { packWhRequestLineId: eachLine.id, unitCode, companyCode } });
                for (const eachObject of objectInfo) {
                    const itemData = await this.itemRepo.findOne({ where: { id: eachObject.items, unitCode, companyCode } });
                    const objectWiseInfo = new PKMS_R_JobTrimItemModel(null, eachObject.objectCode, itemData.code, eachObject.allocatedQty);
                    requestedItemsInfo.push(objectWiseInfo);
                }
            }
            const jobs = await this.jobHeader.find({ select: ['jobNumber'], where: { id: In(jobIds), unitCode, companyCode } });
            const materialJobReq = new PKMS_R_JobTrimMaterialModel(jobs.map(x => x.jobNumber), Array.from(moNumberSet).toString(), `${eachRequest.matFulfillmentDateTime}`, eachRequest.requestNo, `${eachRequest.createdAt}`, eachRequest.matReqBy, requestedItemsInfo);
            materialReqDetails.push(materialJobReq);
        }
        const res = new PKMS_R_JobTrimResponse(true, 0, 'Material Request related details retrieved successfully', materialReqDetails);
        console.log(res);
        return res;

    }

}
