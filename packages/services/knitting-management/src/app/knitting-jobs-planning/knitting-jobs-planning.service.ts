import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { KJ_KnitJobLocPlanRequest, GlobalResponseObject, KJ_locationCodeRequest, KJ_LocationKnitJobsResponse, SewingJobPlanStatusEnum, KJ_MaterialStatusEnum, KJ_LocationKnitJobsModel, KC_LocationKnitJobModel, MOC_OpRoutingModel, KC_ProductSku, ProcessTypeEnum, KJ_LocationCodesRequest, KJ_LocationCodeWiseQtyResponse, KJ_LocationCodeQtyModel, KC_KnitJobRmModel, KC_KnitJobColorSizeModel } from '@xpparel/shared-models';
import { DataSource, In } from 'typeorm';
import { PoKnitJobPlanRepository } from '../common/repository/po-knit-job-plan.repo';
import { PoKnitJobPlanHistoryRepository } from '../common/repository/po-knit-job-plan-history.repo';
import { ErrorResponse } from '@xpparel/backend-utils';
import { PoKnitJobEntity } from '../common/entities/po-knit-job-entity';
import { PoKnitJobPlanHistoryEntity } from '../common/entities/po-knit-job-plan-history-entity';
import { PoKnitJobPlanEntity } from '../common/entities/po-knit-job-plan-entity';
import { GenericTransactionManager } from '../../database/typeorm-transactions';
import { PoKnitJobRatioLineRepository } from '../common/repository/po-knit-job-ratio-line.repo';
import { PoKnitJobRatioRepository } from '../common/repository/po-knit-job-ratio.repo';
import { PoKnitJobRatioSubLineRepository } from '../common/repository/po-knit-job-ratio-sub-line.repo';
import { ProcessingOrderRepository } from '../common/repository/processing-order.repo';
import { PoLineRepository } from '../common/repository/po-line.repo';
import { PoSubLineRepository } from '../common/repository/po-sub-line.repo';
import { PoProductRepository } from '../common/repository/po-product.repo';
import { PoKnitJobRepository } from '../common/repository/po-knit-job.repo';
import { PoKnitJobLineRepository } from '../common/repository/po-knit-job-line.repo';
import { PoKnitJobSubLineRepository } from '../common/repository/po-knit-job-sub-line.repo';
import { PoKnitJobQtyRepository } from '../common/repository/po-knit-job-quantity.repo';
import { ProductSubLineFeaturesRepository } from '../common/repository/product-sub-line-features.repo';
import { PoJobPslMapRepository } from '../common/repository/po-job-psl-map.repo';
import { KnittingJobsService } from '../knitting-jobs/knitting-jobs.service';

@Injectable()
export class KnittingJobsPlanningService {
    constructor(
        private dataSource: DataSource,
        private poKnitJobPlanRepo: PoKnitJobPlanRepository,
        private poProductRepo: PoProductRepository,
        private poKnitJobRepo: PoKnitJobRepository,
        private poKnitJobLineRepo: PoKnitJobLineRepository,
        private poKnitJobSubLineRepo: PoKnitJobSubLineRepository,
        @Inject(forwardRef(() => KnittingJobsService)) private knittingJobService: KnittingJobsService,
        private poKnitJobQtyRepo: PoKnitJobQtyRepository

    ) { }

    /**
    * Service to plan knit jobs to location
    * @param reqObj 
    * @param config 
    * @returns 
   */
    async planKnitJobsToLocation(reqObj: KJ_KnitJobLocPlanRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            await transManager.startTransaction();
            for (const reqJob of reqObj.knitJobs) {
                const jobs = await this.poKnitJobPlanRepo.findOne({ where: { unitCode: reqObj.unitCode, companyCode: reqObj.companyCode, jobNumber: reqJob, processingSerial: reqObj.processingSerial, processType: reqObj.processType } })
                if (!jobs) {
                    throw new ErrorResponse(1, "Job Number doesn't exists");
                }

                await this.poKnitJobPlanRepo.update(
                    { id: jobs.id }, // WHERE conditions
                    { locationCode: reqObj.locationCode, updatedUser: reqObj.username, status: SewingJobPlanStatusEnum.IN_PROGRESS } // Fields to update
                );
                const poKnitJobPlanHistoryObj = new PoKnitJobPlanHistoryEntity();
                poKnitJobPlanHistoryObj.companyCode = reqObj.companyCode
                poKnitJobPlanHistoryObj.unitCode = reqObj.unitCode
                poKnitJobPlanHistoryObj.createdUser = reqObj.username
                poKnitJobPlanHistoryObj.jobNumber = reqObj.locationCode
                poKnitJobPlanHistoryObj.jobPriority = jobs.jobPriority
                poKnitJobPlanHistoryObj.bomSkuStatus = jobs.bomSkuStatus
                poKnitJobPlanHistoryObj.planInputDate = jobs.planInputDate
                poKnitJobPlanHistoryObj.processType = reqObj.processType
                poKnitJobPlanHistoryObj.processingSerial = reqObj.processingSerial
                poKnitJobPlanHistoryObj.rawMaterialStatus = jobs.rawMaterialStatus
                poKnitJobPlanHistoryObj.status = SewingJobPlanStatusEnum.IN_PROGRESS
                poKnitJobPlanHistoryObj.locationCode = reqObj.locationCode
                // const saveData = await transManager.getRepository(PoKnitJobPlanHistoryEntity).save(poKnitJobPlanHistoryObj);            
            }
            await transManager.completeTransaction();
            return new GlobalResponseObject(true, 1, "Location updated successfully");
        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }


    }

    /**
   * Service to plan knit jobs to location
   * @param reqObj 
   * @param config 
   * @returns 
  */
    async unPlanKnitJobsToLocation(reqObj: KJ_KnitJobLocPlanRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            for (const reqJob of reqObj.knitJobs) {
                const jobs = await this.poKnitJobPlanRepo.findOne({ where: { unitCode: reqObj.unitCode, companyCode: reqObj.companyCode, jobNumber: reqJob, processingSerial: reqObj.processingSerial, processType: reqObj.processType } })
                if (!jobs) {
                    throw new ErrorResponse(1, "Job Number doesn't exists");
                }
                if (jobs.rawMaterialStatus != KJ_MaterialStatusEnum.OPEN) {
                    throw new ErrorResponse(1, "Raw Material status is not open status");
                }
                await transManager.startTransaction();
                await this.poKnitJobPlanRepo.update(
                    { id: jobs.id }, // WHERE conditions
                    { locationCode: null, updatedUser: reqObj.username, status: SewingJobPlanStatusEnum.OPEN } // Fields to update
                );
                const poKnitJobPlanHistoryObj = new PoKnitJobPlanHistoryEntity();
                poKnitJobPlanHistoryObj.companyCode = reqObj.companyCode
                poKnitJobPlanHistoryObj.unitCode = reqObj.unitCode
                poKnitJobPlanHistoryObj.createdUser = reqObj.username
                poKnitJobPlanHistoryObj.jobNumber = null;
                poKnitJobPlanHistoryObj.jobPriority = jobs.jobPriority
                poKnitJobPlanHistoryObj.bomSkuStatus = jobs.bomSkuStatus
                poKnitJobPlanHistoryObj.planInputDate = jobs.planInputDate
                poKnitJobPlanHistoryObj.processType = reqObj.processType
                poKnitJobPlanHistoryObj.processingSerial = reqObj.processingSerial
                poKnitJobPlanHistoryObj.rawMaterialStatus = jobs.rawMaterialStatus
                poKnitJobPlanHistoryObj.status = SewingJobPlanStatusEnum.OPEN
                poKnitJobPlanHistoryObj.locationCode = reqObj.locationCode

                const saveData = await transManager.getRepository(PoKnitJobPlanHistoryEntity).save(poKnitJobPlanHistoryObj);
                await transManager.completeTransaction();
                return new GlobalResponseObject(true, 1, "Location updated successfully");
            }
        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }

    }

    /**
     * Service to get knit jobs information for given location
     * @param reqObj 
     * @param config 
     * @returns 
    */
    async getKnitJobsForGivenLocation(reqObj: KJ_locationCodeRequest): Promise<KJ_LocationKnitJobsResponse> {
        const { unitCode, companyCode, username, userId, locationCode } = reqObj;
        const knitOrderJobsInfo: KJ_LocationKnitJobsModel[] = [];
        const knitGroupWiseDetailModel: KC_LocationKnitJobModel[] = [];
        const productKnitGroupInfo = new Map<string, Map<string, MOC_OpRoutingModel>>();
        const knitJobsPlanningInfo = await this.poKnitJobPlanRepo.find({ where: { unitCode, companyCode, isActive: true, locationCode, status: SewingJobPlanStatusEnum.IN_PROGRESS } });
        if (!knitJobsPlanningInfo.length) {
            throw new ErrorResponse(0, 'Knit job not found for the given job details. Please check and try again')
        }
        const prodCompSet = new Map<string, number[]>();
        for (const eachKnitJob of knitJobsPlanningInfo) {
            const colorSizeModel: KC_KnitJobColorSizeModel[] = [];
            const knitJobsInfo = await this.poKnitJobRepo.findOne({ where: { processingSerial: eachKnitJob.processingSerial, processType: eachKnitJob.processType, unitCode, companyCode, isActive: true, knitJobNumber: eachKnitJob.jobNumber } });
            let productSpecs = null;
            let subLineCheck = false;
            const knitJobLineInfo = await this.poKnitJobLineRepo.find({ where: { poKnitJobId: knitJobsInfo.id, processingSerial: eachKnitJob.processingSerial, processType: eachKnitJob.processType, unitCode, companyCode, isActive: true } });
            for (const eachKnitJobLine of knitJobLineInfo) {
                const knitJobSubLineInfo = await this.poKnitJobSubLineRepo.find({ where: { poKnitJobLineId: eachKnitJobLine.id, unitCode, companyCode, processingSerial: eachKnitJob.processingSerial, processType: eachKnitJob.processType, isActive: true } });
                if (knitJobSubLineInfo.length > 0) {
                    subLineCheck = true;
                }
                for (const eachJobSubLine of knitJobSubLineInfo) {
                    const product = await this.poProductRepo.findOne({ where: { processingSerial: eachKnitJob.processingSerial, processType: eachKnitJob.processType, unitCode, companyCode, productRef: eachJobSubLine.productRef } });
                    productSpecs = new KC_ProductSku(product.productRef, product.productName, product.productType, product.productCode);
                    if (reqObj.iNeedColSizes) {
                        const fgColorObj = colorSizeModel.find(colorSize => colorSize.fgColor == eachJobSubLine.fgColor);
                        if (!fgColorObj) {
                            const fgColorDetails = new KC_KnitJobColorSizeModel(eachJobSubLine.fgColor, []);
                            colorSizeModel.push(fgColorDetails);
                        };
                        const fgColorActualObj = colorSizeModel.find(colorSize => colorSize.fgColor == eachJobSubLine.fgColor);
                        const fgColorSizeActObj = fgColorActualObj.sizeQtys.find(size => size.size == eachJobSubLine.size);
                        if (fgColorSizeActObj) {
                            fgColorSizeActObj.qty += eachJobSubLine.quantity;
                        } else {
                            fgColorActualObj.sizeQtys.push({
                                size: eachJobSubLine.size,
                                qty: eachJobSubLine.quantity
                            });
                        };
                    }
                };
               

            }
            let knitJobFeatures = null;

            knitJobFeatures = await this.knittingJobService.getFeaturesForGivenJobNumber(eachKnitJob.jobNumber, eachKnitJob.processingSerial, eachKnitJob.processType, unitCode, companyCode);
            const itemCodesOfJob = new Set<string>();
            const componentsOfJob = new Set<string>();
            for (const [prodCode, prodInfo] of productKnitGroupInfo) {
                for (const [fgColor, routingInfo] of prodInfo) {
                    for (const eachProcessType of routingInfo.processTypesList) {
                        for (const eachSubProcess of eachProcessType.subProcessList) {
                            for (const eachComp of eachSubProcess.components) {
                                componentsOfJob.add(eachComp.compName)
                            }
                        }
                    }

                }
            }
            knitJobFeatures.components = Array.from(componentsOfJob);
            knitJobFeatures.itemCodes = Array.from(itemCodesOfJob);
            let materialStatus: KJ_MaterialStatusEnum = null;
            const rawMaterialStatus = await this.knittingJobService.getRmAndBomStatusForJobNumber(eachKnitJob.jobNumber, eachKnitJob.processingSerial, eachKnitJob.processType, unitCode, companyCode);
            materialStatus = rawMaterialStatus.rawMaterialStatus;
            const kcLocationKnitJobModel = new KC_LocationKnitJobModel(knitJobsInfo.groupCode, knitJobsInfo.knitJobNumber, knitJobsInfo.quantity, productSpecs, eachKnitJob.processingSerial, true, materialStatus, ProcessTypeEnum.CUT, knitJobFeatures, colorSizeModel, []);
            knitGroupWiseDetailModel.push(kcLocationKnitJobModel);

        }
        const result = new KJ_LocationKnitJobsModel(locationCode, knitGroupWiseDetailModel);


        return new KJ_LocationKnitJobsResponse(true, 0, 'Knit Jobs Information Retrieved Successfully for Given Po and Product Code', [result]);

    }

    async getPlannedQtyForGivenLocation(reqObj: KJ_LocationCodesRequest): Promise<KJ_LocationCodeWiseQtyResponse> {
        const { locationCodes, unitCode, companyCode } = reqObj;
        const qtyResp: KJ_LocationCodeQtyModel[] = [];
        for (const eachLocation of locationCodes) {
            const locationWiseJobs = await this.poKnitJobPlanRepo.find({ where: { locationCode: eachLocation, unitCode, companyCode, status: SewingJobPlanStatusEnum.IN_PROGRESS }, select: ['jobNumber'] });
            let jobQty = 0;
            const knitJobs = locationWiseJobs.map(job => job.jobNumber);
            const jobBundleInfo = await this.poKnitJobSubLineRepo.find({ where: { knitJobNumber: In(knitJobs), unitCode, companyCode }, select: ['quantity'] });
            jobQty = jobBundleInfo.reduce((pre, cur) => {
                return pre + cur.quantity;
            }, 0);
            const knitJobReportedQty = await this.poKnitJobQtyRepo.find({ where: { jobNumber: In(knitJobs), unitCode, companyCode, isActive: true } });
            const reportedQty = knitJobReportedQty.reduce((pre, cur) => {
                return pre + (cur.goodQty + cur.rejectedQty)
            }, 0)
            const locationQtyObj = new KJ_LocationCodeQtyModel(eachLocation, (jobQty - reportedQty));
            qtyResp.push(locationQtyObj);
        }
        return new KJ_LocationCodeWiseQtyResponse(true, 0, 'Quantity Details retrieved successfully', qtyResp)
    }

}
