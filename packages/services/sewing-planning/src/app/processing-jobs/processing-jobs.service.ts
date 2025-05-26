import { Injectable } from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import { PoLineRepository } from '../entities/repository/po-line.repo';
import { PoProductRepository } from '../entities/repository/po-product.repo';
import { PoSubLineRepository } from '../entities/repository/po-sub-line.repo';
import { ProcessingOrderRepository } from '../entities/repository/processing-order.repo';
import { ProductSubLineFeaturesRepository } from '../entities/repository/product-sub-line-features.repo';
import { PJ_ProcessingSerialRequest, PJ_ProcessingTypesResponse, PJ_ProcessingJobsSummaryResponse, PJ_ProcessingSerialTypeAndFeatureGroupReq, PJ_ProcessingJobsSummaryForFeaturesResponse, PJ_ProcessingJobPreviewModelResp, PJ_ProcessingJobBatchInfoResp, IPS_C_LocationCodeRequest, IPS_R_LocationJobsResponse, SPS_C_ProcJobNumberRequest, SPS_R_JobInfoDetailedResponse, ProcessTypeEnum, PJ_ProcessingJobsSummaryModel, PJ_ProductFgColorQuantityModel, PJ_sizeQuantityModel, PJ_ProcessingJobSummaryForFeatureGroupModel, PJ_ProcessingJobsGenRequest, PJ_ProcessingJobPreviewHeaderInfo, ProductSubLineAndBundleDetailModel, MOC_BundleDetail, MC_BundleCountModel, ProductSubLineFeatures, PJ_BundleExtractInfo, PJ_ProcessingJobWisePreviewModel, PJ_ProcessingTypesResponseModel, PJ_BundlePropsModel, MOC_OpRoutingModel, MC_ProductSubLineProcessTypeRequest, MOC_OpRoutingResponse, GlobalResponseObject, BundleGenStatusEnum, JobsGenStatusEnum, MOC_OpRoutingSubProcessList, SewingJobPlanStatusEnum, TrimStatusEnum, BomItemTypeEnum, PhItemCategoryEnum, PJ_ProcessingJobBatchDetails, PJ_ProcessingJobLine, PJ_ProcessingJobSubLine, JobLine, SewingJobBatchDetails, SPS_R_ProcJobInfoModel, SPS_R_ProcJobTrimsModel, SPS_R_JobDepOpSkuInfo, SPS_R_JobBundles, SPS_R_JobColorSizeModel, SPS_R_JobDepBundlesModel, SPS_R_JobFeaturesModel, IPS_R_LocationJobsModel, IPS_R_JobModel, IPS_R_JobTrimStatusModel, IPS_R_JobDepBomItemStatusModel, IPS_R_JobTrackingStatusModel, DeleteSewingJobsRequest, SewingJobBarcodeInfoResp, SewingJobPropsModel, SewingJobPropsResp, DependentJobGroupInfo, IPS_R_JobStatusModel, FixedOpCodeEnum, SingleProcessTypes, SPS_R_JobPslQtyModel, PTS_C_ProductionJobNumberRequest } from '@xpparel/shared-models';
import { PoRoutingGroupRepository } from '../entities/repository/po-routing-group-repo';
import { BundleAndQtyModel, ErrorResponse, POQtyRecommendationUtil } from '@xpparel/backend-utils';
import { PoSubLineBundleRepository } from '../entities/repository/po-sub-line-bundle.repo';
import { PoSubLineBundleEntity } from '../entities/po-sub-line-bundle.entity';
import { ProductSubLineFeaturesEntity } from '../entities/product-sub-line-features-entity';
import { FgCreationService, MoOpRoutingService } from '@xpparel/shared-services';
import { SJobPreferences } from '../entities/s-job-preferences.entity';
import { GenericTransactionManager } from '../../database/typeorm-transactions';
import { SJobHeaderEntity } from '../entities/s-job-header.entity';
import { SJobLineEntity } from '../entities/s-job-line.entity';
import { SJobBundleEntity } from '../entities/s-job-bundle.entity';
import { SJobLinePlanEntity } from '../entities/s-job-line-plan';
import { SJobLineOperationsEntity } from '../entities/s-job-line-operations';
import { PoWhJobMaterialEntity } from '../entities/po-wh-job-material-entity';
import moment from 'moment';
import { SJobHeaderRepo } from '../entities/repository/s-job-header.repository';
import { SJobLineOperationsRepo } from '../entities/repository/s-job-line-operations';
import { SJobLinePlanRepo } from '../entities/repository/s-job-line-plan.repository';
import { SJobPreferencesRepo } from '../entities/repository/s-job-preference.repository';
import { SJobSubLineRepo } from '../entities/repository/s-job-sub-line.repository';
import { SJobLineRepo } from '../entities/repository/s-job-line.repository';
import { PoWhJobMaterialRepository } from '../entities/repository/po-wh-job-material-repo';
import { PoWhRequestLineRepository } from '../entities/repository/po-wh-request-line.repo';
import { PoWhJobMaterialIssuanceHistoryRepository } from '../entities/repository/po-wh-job-material-issuance-history-repo';
import { ProcessingJobHelperService } from './processing-job-helper.service';
import { SJobLineOperationsHistoryRepo } from '../entities/repository/s-job-line-operations-history.repo';
import { SJobLineOperationsHistoryEntity } from '../entities/s-job-line-operations-history';
import { SJobPslEntity } from '../entities/s-job-psl-entity';
import { SJobPslRepository } from '../entities/repository/s-job-psl.repository';

@Injectable()
export class ProcessingJobsService {
    constructor(
        private dataSource: DataSource,
        private poRepo: ProcessingOrderRepository,
        private poLineRepo: PoLineRepository,
        private poSubLineRepo: PoSubLineRepository,
        private poProductRepo: PoProductRepository,
        private poSubLineFeatures: ProductSubLineFeaturesRepository,
        private poSubLineBundleRepo: PoSubLineBundleRepository,
        private moRoutingService: MoOpRoutingService,
        private poRoutingRepo: PoRoutingGroupRepository,
        private jobHeaderRepo: SJobHeaderRepo,
        private jobPreferencesRepository: SJobPreferencesRepo,
        private jobOperationsRepo: SJobLineOperationsRepo,
        private jobPlanRepo: SJobLinePlanRepo,
        private sJobSubLineRepo: SJobSubLineRepo,
        private jobGroupRepo: SJobLineRepo,
        private jobWhMaterialRepo: PoWhJobMaterialRepository,
        private phWhReqLineRepo: PoWhRequestLineRepository,
        private poWhJobMaterialIssuanceHistoryRepository: PoWhJobMaterialIssuanceHistoryRepository,
        private procJobHelperService: ProcessingJobHelperService,
        private sJobLineOperationsHistoryRepo: SJobLineOperationsHistoryRepo,
        private jobPslMap: SJobPslRepository,
        private fgCreationService: FgCreationService
    ) { }


    /**
     * Service to get the processing types attached to that processing serial
     * Usually calls from UI to give the tabs for each process type in order to generate the processing jobs for each process type
     * @param reqObj 
     * @param config 
     * @returns 
    */
    async getProcessingTypesByProcessingSerial(reqObj: PJ_ProcessingSerialRequest): Promise<PJ_ProcessingTypesResponse> {
        const { processingSerial, unitCode, companyCode } = reqObj;
        const routingGroupInfo = await this.poRoutingRepo.find({ where: { processingSerial, unitCode, companyCode } });
        if (!routingGroupInfo.length) {
            throw new ErrorResponse(0, 'Routing Group info not found . Please check and try again');
        }
        const processingTypes: PJ_ProcessingTypesResponseModel[] = routingGroupInfo.map((group) => {
            return new PJ_ProcessingTypesResponseModel(group.processType, group.processType);
        });
        return new PJ_ProcessingTypesResponse(true, 0, 'Processing types retrieved successfully for the given ', processingTypes);
    }

    /**
     * Service to get the Processing jobs summary including processing order total quantity and how much processing jobs has been generated
     * Usually calls from UI to visualize the summary of processing jobs for processing type
     * TODO: need to get the process job generated qty for the sub line ids and include in the object from job sub line repo
     * @param reqObj 
     * @param config 
     * @returns 
    */
    async getProcessingJobSummaryForProcessType(reqObj: PJ_ProcessingSerialRequest, oslRefIds?: number[]): Promise<PJ_ProcessingJobsSummaryResponse> {
        const { processingSerial, processType, unitCode, companyCode } = reqObj;
        const productsInfo: PJ_ProductFgColorQuantityModel[] = [];
        const poProductInfo = await this.poProductRepo.find({ where: { processingSerial, unitCode, companyCode } });
        if (!poProductInfo.length) {
            throw new ErrorResponse(0, 'Product Information not found for the given po and product')
        }
        for (const eachProduct of poProductInfo) {
            const colorSizeOrderSubInfo = new Map<string, Map<string, number[]>>();
            const poSubLineInfo = await this.poSubLineRepo.find({ where: { productRef: eachProduct.productRef, unitCode, companyCode, processingSerial } });
            const colorSizeQtyInfo = new Map<string, Map<string, number>>();
            for (const eachPoSubLine of poSubLineInfo) {
                if (oslRefIds) if (!oslRefIds.includes(eachPoSubLine.moProductSubLineId)) continue;
                if (!colorSizeQtyInfo.has(eachPoSubLine.fgColor)) {
                    colorSizeQtyInfo.set(eachPoSubLine.fgColor, new Map<string, number>());
                    colorSizeOrderSubInfo.set(eachPoSubLine.fgColor, new Map<string, number[]>());
                }
                if (!colorSizeQtyInfo.get(eachPoSubLine.fgColor).has(eachPoSubLine.size)) {
                    colorSizeQtyInfo.get(eachPoSubLine.fgColor).set(eachPoSubLine.size, 0);
                    colorSizeOrderSubInfo.get(eachPoSubLine.fgColor).set(eachPoSubLine.size, []);
                }
                const preQty = colorSizeQtyInfo.get(eachPoSubLine.fgColor).get(eachPoSubLine.size);
                colorSizeQtyInfo.get(eachPoSubLine.fgColor).set(eachPoSubLine.size, preQty + eachPoSubLine.quantity);
                colorSizeOrderSubInfo.get(eachPoSubLine.fgColor).get(eachPoSubLine.size).push(eachPoSubLine.moProductSubLineId);

            }
            for (const [fgColor, sizeQtyDetails] of colorSizeQtyInfo) {
                const sewingOrderSubLineInfoObj: PJ_sizeQuantityModel[] = [];
                for (const [size, qtyDetails] of sizeQtyDetails) {
                    const subLineIds = colorSizeOrderSubInfo.get(fgColor).get(size);
                    // Need to change this to job psl 
                    // for that first need to get the one sub process name for the sub line ids + processing type + processing serial
                    const jobVersionInfo = await this.getRoutingInfoForMOProductCodeAndFgColor(processType, subLineIds, eachProduct.productCode, fgColor, unitCode, companyCode);
                    let subProcessName = null;
                    for (const eachProcessType of jobVersionInfo.processTypesList) {
                        for (const subProcess of eachProcessType.subProcessList) {
                            if (!subProcessName) subProcessName = subProcess.subProcessName;
                        }
                    }
                    const sJobPslRepoData = await this.jobPslMap.find({ where: { unitCode: unitCode, companyCode: companyCode, moProductSubLineId: In(subLineIds), processType: processType, processingSerial, subProcessName } });
                    const sumQuantity = sJobPslRepoData.reduce((total, record) => total + (record.quantity - (record.cancelledQuantity - record.reJobGenQty)), 0);
                    const processJobsGeneratedQty: number = sumQuantity;
                    const sizeQtyInfo = new PJ_sizeQuantityModel(size, qtyDetails, processJobsGeneratedQty, (qtyDetails - processJobsGeneratedQty));
                    sewingOrderSubLineInfoObj.push(sizeQtyInfo);
                }
                const productColorInfo = new PJ_ProductFgColorQuantityModel(eachProduct.productCode, eachProduct.productType, eachProduct.productName, fgColor, sewingOrderSubLineInfoObj);
                productsInfo.push(productColorInfo);
            }
        }
        const productInfoArray = new PJ_ProcessingJobsSummaryModel(processingSerial, processType, productsInfo);
        return new PJ_ProcessingJobsSummaryResponse(true, 26049, 'Sewing order info retrieved successfully', productInfoArray);
    }

    /**
     * Service to get the Processing jobs summary including processing order total quantity and how much processing jobs has been generated for particular feature group
     * Usually calls from UI to visualize the summary of processing jobs for processing type
     * @param reqObj 
     * @param config 
     * @returns 
    */
    async getProcessingJobSummaryForProcessTypeAndFeatureGroup(reqObj: PJ_ProcessingSerialTypeAndFeatureGroupReq): Promise<PJ_ProcessingJobsSummaryForFeaturesResponse> {
        const { processingSerial, processType, unitCode, companyCode } = reqObj;
        const poProductInfo = await this.poProductRepo.find({ where: { processingSerial, unitCode, companyCode } });
        if (!poProductInfo.length) {
            throw new ErrorResponse(0, 'Product Information not found for the given po and product')
        };
        const sewingOrderInfoObj: PJ_ProcessingJobSummaryForFeatureGroupModel[] = [];
        const groupedOptionsInfo = await this.poSubLineFeatures.getGroupedSewingJobFeatures(reqObj);
        const serialReq = new PJ_ProcessingSerialRequest(null, unitCode, companyCode, null, processingSerial, reqObj.processType)
        const promises = groupedOptionsInfo.map(async (eachGroupOptions) => {
            const oslRefIds = eachGroupOptions.mo_product_sub_line_id.split(',').map(res => Number(res));
            const summaryInfo = (await this.getProcessingJobSummaryForProcessType(serialReq, oslRefIds))?.data;
            const bundlesInfo = await this.getBundleDetailsForSubLineIds(oslRefIds, processingSerial, processType, unitCode, companyCode);
            const allBundleQtyGroups: MOC_BundleDetail[] = [];
            for (const eachPslb of bundlesInfo) {
                allBundleQtyGroups.push(...eachPslb.bundleDetails);
            };
            const bundleQtyGroup = this.getBundleQtyGroupsForGivenBundles(allBundleQtyGroups);
            return new PJ_ProcessingJobSummaryForFeatureGroupModel(processingSerial, processType, eachGroupOptions, summaryInfo.productFgQtyInfo, bundleQtyGroup);
        });
        const results = await Promise.all(promises); // Execute all promises concurrently
        for (const eachDocBundleInfoForFeature of results) {
            sewingOrderInfoObj.push(eachDocBundleInfoForFeature);
        }
        return new PJ_ProcessingJobsSummaryForFeaturesResponse(true, 26049, 'Sewing order info retrieved successfully', sewingOrderInfoObj);
    }


    /**
     * Supporting function to get bundle quantity group wise bundle count for given bundles
     * @param bundleDetails 
     * @returns 
    */
    getBundleQtyGroupsForGivenBundles(bundleDetails: MOC_BundleDetail[]): MC_BundleCountModel[] {
        // bundle qty group and no of bundles
        const bundleQtyGroups = new Map<number, number>();
        for (const eachBundle of bundleDetails) {
            if (!bundleQtyGroups.has(eachBundle.quantity)) {
                bundleQtyGroups.set(eachBundle.quantity, 0);
            }
            let preCount = bundleQtyGroups.get(eachBundle.quantity);
            bundleQtyGroups.set(eachBundle.quantity, ++preCount)
        };
        const bundleQtyGroupInfo = [];
        for (const [bundleQty, noOfEligibleBundles] of bundleQtyGroups) {
            bundleQtyGroupInfo.push({
                bundleQty,
                noOfEligibleBundles
            })
        }
        return bundleQtyGroupInfo;
    }

    /**
     * Helper function to get the bundle details for the given sub line Id
     * Usually calls to fill the bundles and suggesting the job quantity for for a sewing job
     * @param moProductSubLineIds 
     * @param processingSerial 
     * @param processingType 
     * @param unitCode 
     * @param companyCode 
     * @returns 
    */
    async getBundleDetailsForSubLineIds(moProductSubLineIds: number[], processingSerial: number, processingType: ProcessTypeEnum, unitCode: string, companyCode: string): Promise<ProductSubLineAndBundleDetailModel[]> {
        const productSubLineBundleInfo = await this.poSubLineBundleRepo.find({ where: { moProductSubLineId: In(moProductSubLineIds), processingSerial, procType: processingType, unitCode, companyCode } });
        const subLineBundleInfo = new Map<number, MOC_BundleDetail[]>();
        for (const eachSubLine of productSubLineBundleInfo) {
            if (!subLineBundleInfo.has(eachSubLine.moProductSubLineId)) {
                subLineBundleInfo.set(eachSubLine.moProductSubLineId, [])
            };
            subLineBundleInfo.get(eachSubLine.moProductSubLineId).push(new MOC_BundleDetail(eachSubLine.bundleNumber, eachSubLine.quantity, null, eachSubLine.moProductSubLineId));
        };
        const subLineBasedBundles: ProductSubLineAndBundleDetailModel[] = [];
        subLineBundleInfo.forEach((eachSubLineBundles, subLineId) => {
            subLineBasedBundles.push(new ProductSubLineAndBundleDetailModel(subLineId, eachSubLineBundles));
        });
        return subLineBasedBundles;
    }

    /**
     * Helper function to get the Eligible bundle details for the given sub line Id to generate processing jobs
     * Usually calls to fill the bundles and suggesting the job quantity for for a sewing job
     * @param moProductSubLineIds 
     * @param processingSerial 
     * @param processingType 
     * @param unitCode 
     * @param companyCode 
     * @returns 
    */
    async getProcessingJobEligibleBundleDetailsForSubLineIds(moProductSubLineIds: number[], processingSerial: number, processingType: ProcessTypeEnum, unitCode: string, companyCode: string): Promise<ProductSubLineAndBundleDetailModel[]> {
        const productSubLineBundleInfo = await this.poSubLineBundleRepo.find({ where: { moProductSubLineId: In(moProductSubLineIds), processingSerial, procType: processingType, unitCode, companyCode, isJobGenerated: false } });
        const subLineBundleInfo = new Map<number, MOC_BundleDetail[]>();
        for (const eachSubLine of productSubLineBundleInfo) {
            if (!subLineBundleInfo.has(eachSubLine.moProductSubLineId)) {
                subLineBundleInfo.set(eachSubLine.moProductSubLineId, [])
            };
            subLineBundleInfo.get(eachSubLine.moProductSubLineId).push(new MOC_BundleDetail(eachSubLine.bundleNumber, eachSubLine.quantity, null, eachSubLine.moProductSubLineId));
        };
        const subLineBasedBundles: ProductSubLineAndBundleDetailModel[] = [];
        subLineBundleInfo.forEach((eachSubLineBundles, subLineId) => {
            subLineBasedBundles.push(new ProductSubLineAndBundleDetailModel(subLineId, eachSubLineBundles));
        });
        return subLineBasedBundles;
    }


    /**
     * Service method to get the virtual sewing jobs for the cancelled quantity for the given sub line Ids
     * Usually calls after the normal sewing jobs has been generated in the system. In the case of partial issuance for that PSL id , We need to generate the sewing job for the rest of the quantity
     * @param moProductSubLineIds 
     * @param processingSerial 
     * @param processingType 
     * @param unitCode 
     * @param companyCode 
     * @param subProcessName 
     * @param sewingJobQty 
     * @param multiColor 
     * @param multiSize 
     * @returns PJ_ProcessingJobPreviewModelResp
    */
    async getVirtualJobsForCancelledQtyTheGivenSubLineIds(moProductSubLineIds: number[], processingSerial: number, processingType: ProcessTypeEnum, unitCode: string, companyCode: string, subProcessName: string, sewingJobQty: number, multiColor: boolean, multiSize: boolean) {
        const maxBundleQty = await this.poSubLineBundleRepo.getMaxBundleQtyForGivenSubLineIds(moProductSubLineIds, companyCode, unitCode);
        const bundlesInfo: ProductSubLineAndBundleDetailModel[] = await this.getProcessingJobEligiblePslQtyForSubLineIds(moProductSubLineIds, processingSerial, processingType, unitCode, companyCode, subProcessName, maxBundleQty);
        const allBundleQtyGroups: MOC_BundleDetail[] = [];
        for (const eachPslb of bundlesInfo) {
            allBundleQtyGroups.push(...eachPslb.bundleDetails);
        };
        const allBundlesForSewJobGen: MOC_BundleDetail[] = allBundleQtyGroups;
        const totalBundleInfo: PJ_BundleExtractInfo[] = [];
        const moProductSubLineInfoMap = new Map<number, ProductSubLineFeaturesEntity>();
        for (const eachBundle of allBundlesForSewJobGen) {
            // const bundleActInfo = 
            if (!moProductSubLineInfoMap.has(eachBundle.pslId)) {
                const poSubLineFeatures = await this.poSubLineFeatures.findOne({ where: { processingSerial, moProductSubLineId: eachBundle.pslId, unitCode, companyCode } });
                moProductSubLineInfoMap.set( eachBundle.pslId, poSubLineFeatures);
            }
            const featuresInfo = moProductSubLineInfoMap.get( eachBundle.pslId);
            totalBundleInfo.push(new PJ_BundleExtractInfo(eachBundle.bundleNumber,  eachBundle.pslId, featuresInfo.productType, featuresInfo.productName, featuresInfo.fgColor, featuresInfo.size, eachBundle.quantity, featuresInfo.productCode, eachBundle.itemSku));
        };
        const virtualJobsInfo: {
            jobNumber: number;
            bundles: PJ_BundleExtractInfo[];
        }[] = this.assignBundlesToJobs(sewingJobQty, totalBundleInfo, multiColor, multiSize);
        return virtualJobsInfo;
    }

    /**
    * Helper function to get the Eligible psl details for the given sub line Id to generate processing jobs
    * Usually calls to after the sewing job generation / re generating the sewing jobs for the one pslb id
    * Generating sewing jobs for the cancelled quantity for the pslb id
    * Need to update the re generated quantity for pslb id
    * 
    * @param moProductSubLineIds 
    * @param processingSerial 
    * @param processingType 
    * @param unitCode 
    * @param companyCode 
    * @returns 
   */
    async getProcessingJobEligiblePslQtyForSubLineIds(moProductSubLineIds: number[], processingSerial: number, processingType: ProcessTypeEnum, unitCode: string, companyCode: string, subProcessName: string, bundleQty: number): Promise<ProductSubLineAndBundleDetailModel[]> {
        const productSubLineBundleInfo = await this.jobPslMap.find({ where: { moProductSubLineId: In(moProductSubLineIds), processingSerial, processType: processingType, unitCode, companyCode, subProcessName } });
        const subLineBasedBundles: ProductSubLineAndBundleDetailModel[] = [];
        if (productSubLineBundleInfo.length > 0) {
            const pslbAvailableQtyMap = new Map<number, number>();
            for (const eachSubLine of productSubLineBundleInfo) {
                if (!pslbAvailableQtyMap.has(eachSubLine.moProductSubLineId)) {
                    pslbAvailableQtyMap.set(eachSubLine.moProductSubLineId, 0);
                }
                const preQty = pslbAvailableQtyMap.get(eachSubLine.moProductSubLineId);
                pslbAvailableQtyMap.set(eachSubLine.moProductSubLineId, preQty + (Number(eachSubLine.cancelledQuantity) - Number(eachSubLine.reJobGenQty)));
            };
            const subLineBundleInfo = new Map<number, MOC_BundleDetail[]>();
            let virtualBundleCount = 1;
            for (const [pslb, availableQty] of pslbAvailableQtyMap) {
                if (!subLineBundleInfo.has(pslb)) {
                    subLineBundleInfo.set(pslb, [])
                };
                let pslbAvailableQty = availableQty;
                while (pslbAvailableQty > 0) {
                    const allowableQty = Math.min(pslbAvailableQty, bundleQty);
                    const virtualBundle = new MOC_BundleDetail(`BUN-${virtualBundleCount++}`, allowableQty, null, pslb);
                    subLineBundleInfo.get(pslb).push(virtualBundle)
                    pslbAvailableQty -= allowableQty
                }
            }
            subLineBundleInfo.forEach((eachSubLineBundles, subLineId) => {
                subLineBasedBundles.push(new ProductSubLineAndBundleDetailModel(subLineId, eachSubLineBundles));
            });
            return subLineBasedBundles;
        }
    }

    /**
     * Supporting function to get bundle quantity group wise bundles info for given bundles
     * @param bundleDetails 
     * @returns 
    */
    getBundleQtyGroupWiseBundlesForGivenBundles(bundleDetails: MOC_BundleDetail[]): Map<number, MOC_BundleDetail[]> {
        // bundle qty group and no of bundles
        const bundleQtyGroups = new Map<number, number>();
        const bundleQtyGroupBundles = new Map<number, MOC_BundleDetail[]>();
        for (const eachBundle of bundleDetails) {
            if (!bundleQtyGroups.has(eachBundle.quantity)) {
                bundleQtyGroups.set(eachBundle.quantity, 0);
                bundleQtyGroupBundles.set(eachBundle.quantity, []);
            }
            let preCount = bundleQtyGroups.get(eachBundle.quantity);
            bundleQtyGroups.set(eachBundle.quantity, ++preCount);
            bundleQtyGroupBundles.get(eachBundle.quantity).push(eachBundle);
        };
        const bundleQtyGroupInfo: MC_BundleCountModel[] = [];
        for (const [bundleQty, noOfEligibleBundles] of bundleQtyGroups) {
            bundleQtyGroupInfo.push({
                bundleQty,
                noOfEligibleBundles
            })
        }
        return bundleQtyGroupBundles;
    }


    /**
     * Service Get virtual  processing jobs for the process type and feature group
     * Usually calls from UI after clicks on generate button to show these virtual jobs in the POP UP
     * @param reqObj 
     * @param config 
     * @returns 
    */
    async getVirtualProcessingJobsForProcessTypeAndFeatureGroup(reqObj: PJ_ProcessingJobsGenRequest): Promise<PJ_ProcessingJobPreviewModelResp> {
        const { processType, processingSerial, multiColor, multiSize, groupInfo, unitCode, companyCode, sewingJobQty } = reqObj;
        const virtualJobs = await this.validateAndGetVirtualProcessingJobs(reqObj);
        const productSubLineIds = await this.poSubLineFeatures.getMoProductSubLineIdsForFeatureGroup(groupInfo, unitCode, companyCode, processingSerial);
        if (!productSubLineIds.length) {
            throw new ErrorResponse(0, 'Product sub line ids not found . Please check and try again');
        };
        const jobSubLineInfo = await this.jobPslMap.findOne({ where: { processingSerial, processType, moProductSubLineId: In(productSubLineIds) }, select: ['subProcessName'] });
        if (jobSubLineInfo) {
            const virtualJobsForCancelledQty = await this.getVirtualJobsForCancelledQtyTheGivenSubLineIds(productSubLineIds, processingSerial, processType, unitCode, companyCode, jobSubLineInfo.subProcessName, sewingJobQty, multiColor, multiSize);
            virtualJobs.push(...virtualJobsForCancelledQty);
        }
        const previewModel = await this.getProcessingJobPreviewForVirtualJobs(virtualJobs, unitCode, companyCode, processingSerial, processType, multiColor, multiSize);
        return new PJ_ProcessingJobPreviewModelResp(true, 0, 'Virtual Job Details Retrieved Successfully', previewModel)
    }

    /**
     * Helper function to get the processing jobs for given features details, It gets the bundle information for each job
     * Usually calls for getting virtual jobs to UI as well as create the processing jobs for same
     * @param reqObj 
     * @returns 
    */
    async validateAndGetVirtualProcessingJobs(reqObj: PJ_ProcessingJobsGenRequest): Promise<{
        jobNumber: number;
        bundles: PJ_BundleExtractInfo[];
    }[]> {
        const { processType, processingSerial, multiColor, multiSize, groupInfo, unitCode, companyCode, sewingJobQty } = reqObj;
        const qtyRecUtil = new POQtyRecommendationUtil()
        const productSubLineIds = await this.poSubLineFeatures.getMoProductSubLineIdsForFeatureGroup(groupInfo, unitCode, companyCode, processingSerial);
        if (!productSubLineIds.length) {
            throw new ErrorResponse(0, 'Product sub line ids not found . Please check and try again');
        };
        const bundlesInfo = await this.getProcessingJobEligibleBundleDetailsForSubLineIds(productSubLineIds, processingSerial, processType, unitCode, companyCode);
        const virtualJobsInfo: {
            jobNumber: number;
            bundles: PJ_BundleExtractInfo[];
        }[] = [];
        if (bundlesInfo.length > 0) {
            const allBundleQtyGroups: MOC_BundleDetail[] = [];
            for (const eachPslb of bundlesInfo) {
                allBundleQtyGroups.push(...eachPslb.bundleDetails);
            };
            const bundleQtyGroup = this.getBundleQtyGroupsForGivenBundles(allBundleQtyGroups);
            const getRecommendedQty = qtyRecUtil.getPossibleQuantities(bundleQtyGroup).quantities;
            if (!getRecommendedQty.includes(sewingJobQty)) {
                throw new ErrorResponse(0, 'Product sub line quantity you have entered is not matches with bundle eligible quantity, Please check and try again');
            };
            // const recommendedBundlesCount = qtyRecUtil.getBundlesForQuantity(bundleQtyGroup, sewingJobQty);
            const allBundlesForSewJobGen: MOC_BundleDetail[] = allBundleQtyGroups;
            // const bundleQtyGroupBundleInfo: Map<number, MOC_BundleDetail[]> = this.getBundleQtyGroupWiseBundlesForGivenBundles(allBundleQtyGroups);
            // console.log(bundleQtyGroupBundleInfo);
            // for (const eachBundleGroup of recommendedBundlesCount) {
            //     const bundleQtyGroupBundles = bundleQtyGroupBundleInfo.get(eachBundleGroup.bundleQty);
            //     const bundlesForJobGen = bundleQtyGroupBundles.slice(0, eachBundleGroup.noOfEligibleBundles);
            //     allBundlesForSewJobGen.push(...bundlesForJobGen)
            // };
            const totalBundleInfo: PJ_BundleExtractInfo[] = [];
            const moProductSubLineInfoMap = new Map<number, ProductSubLineFeaturesEntity>();
            for (const eachBundle of allBundlesForSewJobGen) {
                const bundleActInfo = await this.poSubLineBundleRepo.findOne({ where: { bundleNumber: eachBundle.bundleNumber, processingSerial, procType: processType, unitCode, companyCode, isActive: true, isJobGenerated: false } });
                if (!bundleActInfo) {
                    throw new ErrorResponse(0, 'Bundle details not found for the bundle number' + eachBundle.bundleNumber)
                };
                if (!moProductSubLineInfoMap.has(bundleActInfo.moProductSubLineId)) {
                    const poSubLineFeatures = await this.poSubLineFeatures.findOne({ where: { processingSerial, moProductSubLineId: bundleActInfo.moProductSubLineId, unitCode, companyCode } });
                    moProductSubLineInfoMap.set(bundleActInfo.moProductSubLineId, poSubLineFeatures);
                }
                const featuresInfo = moProductSubLineInfoMap.get(bundleActInfo.moProductSubLineId);
                totalBundleInfo.push(new PJ_BundleExtractInfo(bundleActInfo.bundleNumber, bundleActInfo.moProductSubLineId, featuresInfo.productType, featuresInfo.productName, featuresInfo.fgColor, featuresInfo.size, bundleActInfo.quantity, featuresInfo.productCode, bundleActInfo.fgSku));
            };
            virtualJobsInfo.push(...this.assignBundlesToJobs(sewingJobQty, totalBundleInfo, multiColor, multiSize))
        }
        return virtualJobsInfo;
    };

    assignBundlesToJobs(jobQuantity: number, bundlesInfo: PJ_BundleExtractInfo[], multiColor: boolean, multiSize: boolean) {
        const groupedOrders = bundlesInfo.reduce((groups, order) => {
            const key = `${multiColor ? "" : order.fgColor}_${multiSize ? "" : order.size}`;
            if (!groups[key]) groups[key] = [];
            order.quantity = Number(order.quantity)
            groups[key].push(order);
            return groups;
        }, []);
        const jobs: {
            jobNumber: number;
            bundles: PJ_BundleExtractInfo[];
        }[] = [];
        const result = new Map<number, MOC_BundleDetail[]>();
        let jobCounter = 0;

        Object.values(groupedOrders).forEach((group: PJ_BundleExtractInfo[]) => {
            // Need to reset tht job
            ++jobCounter;
            let currentJobBundles: MOC_BundleDetail[] = [];
            let currentJobTotalQty = 0;
            const utilBundleModels: MOC_BundleDetail[] = group.map((eachGroup) => {
                return new MOC_BundleDetail(eachGroup.bundleNumber, eachGroup.quantity, eachGroup.itemSku, eachGroup.moProductSubLineId)
            });
            const bundleQtyGroupBundleInfo: Map<number, MOC_BundleDetail[]> = this.getBundleQtyGroupWiseBundlesForGivenBundles(utilBundleModels);
            // Step 1: Sort bundle sizes descending
            const sortedBundleQtys = Array.from(bundleQtyGroupBundleInfo.keys()).sort((a, b) => b - a);
            // Step 2: Loop through each group
            for (const bundleQty of sortedBundleQtys) {
                const bundles = bundleQtyGroupBundleInfo.get(bundleQty);
                if (bundles) {
                    for (const bundle of bundles) {
                        // Can we fit this bundle into current job?
                        if (currentJobTotalQty + bundle.quantity <= jobQuantity) {
                            currentJobBundles.push(bundle);
                            currentJobTotalQty += bundle.quantity;
                        } else {
                            // Save current job
                            result.set(jobCounter, currentJobBundles);

                            // Start new job
                            jobCounter++;
                            currentJobBundles = [bundle];
                            currentJobTotalQty = bundle.quantity;
                        }
                    }
                }
            }
            // Step 3: Save last job if it has bundles
            if (currentJobBundles.length > 0) {
                result.set(jobCounter, currentJobBundles);
            }
        });
        for (const [jobNumber, relatedBundles] of result) {
            jobs.push({
                jobNumber,
                bundles: []
            });
            for (const eachRelatedBundle of relatedBundles) {
                jobs.find(eachJob => eachJob.jobNumber == jobNumber).bundles.push(bundlesInfo.find(bun => bun.bundleNumber == eachRelatedBundle.bundleNumber))
            }
        };
        return jobs;
    }

    /**
     * HELPER: Function to distribute orders into jobs with job numbers, grouping by multiColor and multiSize
     * @param {PJ_BundleExtractInfo[]} orders - Array of MOSewOrderQtyModel objects
     * @param {number} jobQuantity - The maximum quantity per job
     * @param {boolean} multiColor - Whether a job can include multiple colors
     * @param {boolean} multiSize - Whether a job can include multiple sizes
     * @returns {Array} - Array of jobs, each with a jobNumber and associated MO info
     */
    distributeJobs(orders: PJ_BundleExtractInfo[], jobQuantity: number, multiColor: boolean, multiSize: boolean) {
        const jobs: {
            jobNumber: number;
            bundles: PJ_BundleExtractInfo[]
        }[] = [];
        let jobNumber = 1; // Initialize job number
        // Group orders by color and size if multiColor or multiSize is false
        const groupedOrders = orders.reduce((groups, order) => {
            const key = `${multiColor ? "" : order.fgColor}_${multiSize ? "" : order.size}`;
            if (!groups[key]) groups[key] = [];
            order.quantity = Number(order.quantity)
            groups[key].push(order);
            return groups;
        }, []);
        // Process grouped orders
        let count = 0;
        Object.values(groupedOrders).forEach(group => {
            let groupRemainingQuantity = group.reduce((prev, curr) => prev + Number(curr.quantity), 0);
            while (groupRemainingQuantity > 0) {
                let remainingJobQuantity = jobQuantity; // Reset job capacity for each new job
                group.forEach((order: PJ_BundleExtractInfo) => {
                    if (remainingJobQuantity <= 0 || groupRemainingQuantity <= 0) return; // Stop if job or group is fully allocated
                    if (order.quantity > 0) {
                        // Calculate the bundle quantity for the current order
                        const bundleQuantity = Math.min(order.quantity, remainingJobQuantity);
                        // Find or create the current job
                        let currentJob = jobs.find(job => job.jobNumber === jobNumber);
                        if (!currentJob) {
                            currentJob = {
                                jobNumber: jobNumber,
                                bundles: [] // Array to hold bundles for this job
                            };
                            jobs.push(currentJob);
                        }
                        // Add the bundle to the current job
                        currentJob.bundles.push({
                            bundleNumber: order.bundleNumber,
                            moProductSubLineId: order.moProductSubLineId,
                            productType: order.productType,
                            productName: order.productName,
                            fgColor: order.fgColor,
                            size: order.size,
                            quantity: bundleQuantity,
                            productCode: order.productCode,
                            itemSku: order.itemSku
                        });
                        // Adjust remaining quantities
                        remainingJobQuantity -= bundleQuantity;
                        groupRemainingQuantity -= bundleQuantity;
                        order.quantity -= bundleQuantity;
                    }
                });
                // Move to the next job number once the current job is filled
                jobNumber++;
            }
        });
        return jobs;
    }
    /**
     * Helper
     * @param moWiseJobInfo Hel
     * @param unitCode 
     * @param companyCode 
     * @param bundleGroup 
     * @param sewSerial 
     * @param logicalBundleQty 
     * @returns 
    */
    async getProcessingJobPreviewForVirtualJobs(moWiseJobInfo: { jobNumber: number; bundles: PJ_BundleExtractInfo[] }[], unitCode: string, companyCode: string, processingSerial: number, processType: ProcessTypeEnum, multiColor: boolean, multiSize: boolean): Promise<PJ_ProcessingJobPreviewHeaderInfo> {
        const refProductName = moWiseJobInfo[0].bundles[0].productCode;
        const refFgColor = moWiseJobInfo[0].bundles[0].fgColor;
        const moProductSubLineIdsForBundle = new Set<number>();
        moWiseJobInfo.forEach((bundles) => {
            return bundles.bundles.forEach((eachBundle) => {
                moProductSubLineIdsForBundle.add(eachBundle.moProductSubLineId);
            })
        });
        let totalJobQty = 0;
        let totalBundleCount = 0;
        const operations = [];
        let noOfJobGroups = 0;
        const subProcessList: MOC_OpRoutingSubProcessList[] = [];
        const routingDetails = await this.getRoutingInfoForMOProductCodeAndFgColor(processType, Array.from(moProductSubLineIdsForBundle), refProductName, refFgColor, unitCode, companyCode);
        for (const eachProcessType of routingDetails.processTypesList) {
            for (const eachProcessJobGroup of eachProcessType.subProcessList) {
                subProcessList.push(eachProcessJobGroup);
                ++noOfJobGroups;
                for (const eachOps of eachProcessJobGroup.operations) {
                    operations.push(eachOps.opCode);
                }
            }
        }
        const jobWisePreviewModel: PJ_ProcessingJobWisePreviewModel[] = [];
        for (const eachJob of moWiseJobInfo) {
            const oslRefIds = eachJob.bundles.map(mo => mo.moProductSubLineId);
            const moFeatures: PJ_BundlePropsModel = await this.poSubLineFeatures.getFeatureForProductSubLineIds(oslRefIds, processingSerial, unitCode, companyCode);
            const totalQty = eachJob.bundles.reduce((pre, curr) => {
                return pre + Number(curr.quantity);
            }, 0);
            totalJobQty += totalQty;
            const noOfBundles = eachJob.bundles.length;
            totalBundleCount += noOfBundles;
            const bundleQty = eachJob.bundles.reduce((acc, curr) => {
                return acc + curr.quantity
            }, 0);
            const jobWisePreview = new PJ_ProcessingJobWisePreviewModel(`J-${eachJob.jobNumber}`, bundleQty, noOfBundles, totalQty, moFeatures, eachJob.bundles);
            jobWisePreviewModel.push(jobWisePreview);
        }
        const previewInfo = new PJ_ProcessingJobPreviewHeaderInfo(processType, moWiseJobInfo.length, totalJobQty, totalBundleCount, noOfJobGroups, operations, processingSerial, null, multiColor, multiSize, jobWisePreviewModel, subProcessList);
        return previewInfo;
    }





    /**
   * 
   * Getting processing job group information by calling OMS module , since the original knit group infomation will be available over there by sending PSLB ids
   * Helper function to get the knit group information 
   * @param processType 
   * @param processingSerial 
   * @param unitCode 
   * @param companyCode 
  */
    async getRoutingInfoForMOProductCodeAndFgColor(processType: ProcessTypeEnum, moProductSubLineId: number[], productCode: string, fgColor: string, unitCode: string, companyCode: string): Promise<MOC_OpRoutingModel> {
        // need to get the Operation routing information including BOM + OPERATION against o moProductSubLine Ids 
        // should return the SOC_OpRoutingModel for given product code and fg color
        const routingReq = new MC_ProductSubLineProcessTypeRequest(null, unitCode, companyCode, null, moProductSubLineId, processType);
        console.log(routingReq)
        const opRoutingDetails: MOC_OpRoutingResponse = await this.moRoutingService.getRoutingGroupInfoForMOProductSubLineDetails(routingReq);
        if (!opRoutingDetails.status) {
            throw new ErrorResponse(opRoutingDetails.errorCode, opRoutingDetails.internalMessage);
        }
        const opRoutingForProductAndFgColor = opRoutingDetails.data.find(route => route.fgColor == fgColor && route.prodName == productCode);
        if (!opRoutingForProductAndFgColor) {
            throw new ErrorResponse(0, 'Routing details not found for the given mo Product sub line Ids')
        }
        return opRoutingForProductAndFgColor;
    }

    /**
    * Service to confirm the virtual processing jobs for the process type and feature group
    * Usually calls from UI after clicks on Confirm button in the pop up
    * TODO: Need to get the item info and attach those
    * @param reqObj 
    * @param config 
    * @returns 
   */
    async confirmProcessingJobsForProcessTypeAndFeatureGroup(reqObj: PJ_ProcessingJobsGenRequest): Promise<GlobalResponseObject> {
        const { processType, processingSerial, multiColor, multiSize, groupInfo, unitCode, companyCode, sewingJobQty, userId, username } = reqObj;
        let routingId: number = null;
        const transManager = new GenericTransactionManager(this.dataSource);
        let checkFlag = false;
        try {
            const routingDetails = await this.poRoutingRepo.findOne({ where: { processingSerial, processType, unitCode, companyCode } });
            if (!routingDetails) {
                throw new ErrorResponse(0, 'Routing Information not found for the given processing order. Please check and try again')
            };
            const processingOrderInfo = await this.poRepo.findOne({ where: { processingSerial, unitCode, companyCode } });
            if (!processingOrderInfo) {
                throw new ErrorResponse(0, 'Processing order information not found. Please check and try again');
            }
            routingId = routingDetails.id;
            if (routingDetails.jobsGenStatus != JobsGenStatusEnum.OPEN) {
                throw new ErrorResponse(0, 'Processing jobs being generated or completed. Please check and try again')
            }
            await this.poRoutingRepo.update({ id: routingDetails.id }, { jobsGenStatus: JobsGenStatusEnum.IN_PROGRESS });
            checkFlag = true;
            // Need to insert the job preference -> job header ->  job line -> job bundle -> SJobPslEntity
            // Need to insert for each job line -> job-line-plan -> job-line-op -> po-wh-job-material
            // after that need to update job gen status to true for the bundle and process type
            // after that need to update the job gen status for routing group
            const subProcessesForTheJob: PJ_ProcessingJobPreviewModelResp = await this.getVirtualProcessingJobsForProcessTypeAndFeatureGroup(reqObj);
            if (!subProcessesForTheJob.status) {
                throw new ErrorResponse(subProcessesForTheJob.errorCode, subProcessesForTheJob.internalMessage);
            };
            const allBundles = new Set<string>();
            let jobHeaderStartNo = 1
            const virtualJobsInfo: PJ_ProcessingJobPreviewHeaderInfo = subProcessesForTheJob.data;
            const allCreatedSJobs: string[] = [];
            const createdSewingJobs: SJobLineEntity[] = [];
            await transManager.startTransaction();
            const jobPreferObj = new SJobPreferences();
            jobPreferObj.companyCode = companyCode;
            jobPreferObj.createdUser = username;
            jobPreferObj.groupInfo = JSON.stringify(groupInfo);
            jobPreferObj.multiColor = multiColor;
            jobPreferObj.multiSize = multiSize;
            jobPreferObj.processingSerial = processingSerial;
            jobPreferObj.unitCode = unitCode;
            jobPreferObj.companyCode = companyCode;
            jobPreferObj.sewingJobQty = sewingJobQty;
            jobPreferObj.processType = processType;
            const jobPrefEntity = await transManager.getRepository(SJobPreferences).save(jobPreferObj);
            const jobPslQtyMap = new Map<string, Map<number, number>>();
            for (const eachJob of virtualJobsInfo.jobWisePreviewModel) {
                const productFgColorSizeQtyMap = new Map<string, Map<string, Map<string, number>>>()
                const jobHeaderInfo = new SJobHeaderEntity();
                jobHeaderInfo.companyCode = companyCode;
                jobHeaderInfo.createdUser = username;
                jobHeaderInfo.jobHeaderNo = jobHeaderStartNo++;
                jobHeaderInfo.processingSerial = processingSerial;
                jobHeaderInfo.unitCode = unitCode;
                jobHeaderInfo.jobPrefId = jobPrefEntity.id;
                jobHeaderInfo.processType = processType;
                let jobRunningNumber = 1;
                const actJobQty = eachJob.bundleInfo.reduce((acc, curr) => {
                    return acc + curr.quantity;
                }, 0)
                const jobHeaderEntity = await transManager.getRepository(SJobHeaderEntity).save(jobHeaderInfo);
                let subProcessCount = 0;
                const jobMaterialInfo: PoWhJobMaterialEntity[] = [];
                for (const eachSubProcess of virtualJobsInfo.processingJobsInfo) {
                    // const subLineEntities: SJobPslEntity[] = [];
                    const sewingJobNumber = `PJ-${eachSubProcess.subProcessName}-${jobHeaderEntity.id}-${jobRunningNumber++}`;
                    if (!jobPslQtyMap.has(sewingJobNumber)) {
                        jobPslQtyMap.set(sewingJobNumber, new Map<number, number>());
                    }
                    for (const eachBundle of eachJob.bundleInfo) {
                        allBundles.add(eachBundle.bundleNumber);
                        if (!jobPslQtyMap.get(sewingJobNumber).has(eachBundle.moProductSubLineId)) {
                            jobPslQtyMap.get(sewingJobNumber).set(eachBundle.moProductSubLineId, 0)
                        }
                        const prePslQty = jobPslQtyMap.get(sewingJobNumber).get(eachBundle.moProductSubLineId);
                        jobPslQtyMap.get(sewingJobNumber).set(eachBundle.moProductSubLineId, Number(eachBundle.quantity) + prePslQty)
                    }
                    const jobLineObj = new SJobLineEntity();
                    jobLineObj.companyCode = companyCode;
                    jobLineObj.createdUser = username;
                    jobLineObj.jobNumber = sewingJobNumber;
                    jobLineObj.sJobHeaderId = jobHeaderEntity.id;
                    jobLineObj.unitCode = unitCode;
                    jobLineObj.processingSerial = processingSerial;
                    jobLineObj.processType = processType;
                    jobLineObj.subProcessName = eachSubProcess.subProcessName;
                    const jobLineEntity = await transManager.getRepository(SJobLineEntity).save(jobLineObj);
                    allCreatedSJobs.push(sewingJobNumber);
                    createdSewingJobs.push(jobLineEntity);
                    if (!processingOrderInfo.isActualTracking) {
                        for (const eachBundle of eachJob.bundleInfo) {
                            if (!productFgColorSizeQtyMap.has(eachBundle.productCode)) {
                                productFgColorSizeQtyMap.set(eachBundle.productCode, new Map<string, Map<string, number>>());
                            }
                            if (!productFgColorSizeQtyMap.get(eachBundle.productCode).has(eachBundle.fgColor)) {
                                productFgColorSizeQtyMap.get(eachBundle.productCode).set(eachBundle.fgColor, new Map<string, number>());
                            }
                            if (!productFgColorSizeQtyMap.get(eachBundle.productCode).get(eachBundle.fgColor).has(eachBundle.size)) {
                                productFgColorSizeQtyMap.get(eachBundle.productCode).get(eachBundle.fgColor).set(eachBundle.size, 0);
                            }
                            const preQty = productFgColorSizeQtyMap.get(eachBundle.productCode).get(eachBundle.fgColor).get(eachBundle.size);
                            productFgColorSizeQtyMap.get(eachBundle.productCode).get(eachBundle.fgColor).set(eachBundle.size, preQty + eachBundle.quantity);
                            const jobSubLineObj = new SJobBundleEntity();
                            jobSubLineObj.companyCode = companyCode;
                            jobSubLineObj.color = eachBundle.fgColor;
                            jobSubLineObj.createdUser = username;
                            jobSubLineObj.qty = eachBundle.quantity;
                            jobSubLineObj.sJobLineId = jobLineEntity.id;
                            jobSubLineObj.size = eachBundle.size;
                            jobSubLineObj.unitCode = unitCode;
                            jobSubLineObj.bundleNumber = eachBundle.bundleNumber;
                            jobSubLineObj.moProductSubLineId = eachBundle.moProductSubLineId;
                            jobSubLineObj.processingSerial = processingSerial;
                            jobSubLineObj.processType = processType;
                            jobSubLineObj.isActBun = false;
                            const jobSubLineEntity = await transManager.getRepository(SJobBundleEntity).save(jobSubLineObj);

                        }
                    }
                    // Need to insert for each job line -> job-line-plan -> job-line-op -> po-wh-job-material
                    const opGroupToOpMap = new Map<string, string[]>();
                    const opGroupToSmv = new Map<string, number>();
                    for (const eachOperation of eachSubProcess.operations) {
                        if (!opGroupToOpMap.has(eachOperation.opGroup)) {
                            opGroupToOpMap.set(eachOperation.opGroup, []);
                            opGroupToSmv.set(eachOperation.opGroup, 0);
                        };
                        const preQty = opGroupToSmv.get(eachOperation.opGroup);
                        opGroupToSmv.set(eachOperation.opGroup, preQty + Number(eachOperation.smv));
                        opGroupToOpMap.get(eachOperation.opGroup).push(eachOperation.opCode);
                    }
                    let opsSeq = 1;
                    for (const [opGroup, ops] of opGroupToOpMap) {
                        for (const eachHardCodeOp of [FixedOpCodeEnum.IN, FixedOpCodeEnum.OUT]) {
                            const jobLineOps = new SJobLineOperationsEntity();
                            jobLineOps.companyCode = companyCode;
                            jobLineOps.inputQty = actJobQty;
                            jobLineOps.jobNumber = sewingJobNumber;
                            jobLineOps.operationCodes = ops.toString();
                            jobLineOps.originalQty = actJobQty;
                            jobLineOps.unitCode = unitCode;
                            jobLineOps.smv = opGroupToSmv.get(opGroup) ? Number(opGroupToSmv.get(opGroup)) : 0;
                            jobLineOps.goodQty = 0;
                            jobLineOps.rejectionQty = 0;
                            jobLineOps.openRejections = 0;
                            jobLineOps.operationSequence = opsSeq++;
                            jobLineOps.processingSerial = processingSerial;
                            jobLineOps.operationGroup = opGroup;
                            jobLineOps.processType = processType;
                            jobLineOps.operationCode = eachHardCodeOp;
                            await transManager.getRepository(SJobLineOperationsHistoryEntity).save(jobLineOps);
                            await transManager.getRepository(SJobLineOperationsEntity).save(jobLineOps);
                        }
                    }
                    subProcessCount++;
                }
                await transManager.getRepository(PoWhJobMaterialEntity).save(jobMaterialInfo, { reload: false })
            };

            const jobPslEntities: SJobPslEntity[] = [];
            for (const [job, pslInfo] of jobPslQtyMap) {
                const jobInfo = createdSewingJobs.find(eachJob => eachJob.jobNumber == job);
                for (const [pslId, qty] of pslInfo) {
                    const existingJobPslData = await this.jobPslMap.findOne({ where: { jobNumber: job, unitCode, companyCode, moProductSubLineId: pslId } });
                    if (existingJobPslData) {
                        await transManager.getRepository(SJobPslEntity).update({ id: existingJobPslData.id, unitCode, companyCode }, { reJobGenQty: (existingJobPslData.reJobGenQty + qty) })
                        continue;
                    }
                    const jobPslMap = new SJobPslEntity();
                    jobPslMap.cancelledQuantity = 0;
                    jobPslMap.companyCode = companyCode;
                    jobPslMap.createdUser = username;
                    jobPslMap.jobNumber = job;
                    jobPslMap.moProductSubLineId = pslId;
                    jobPslMap.processType = processType;
                    jobPslMap.processingSerial = processingSerial;
                    jobPslMap.quantity = qty;
                    jobPslMap.reJobGenQty = 0;
                    jobPslMap.subProcessName = jobInfo.subProcessName;
                    jobPslMap.unitCode = unitCode;
                    jobPslEntities.push(jobPslMap);
                }
            };
            for (const eachBundle of allBundles) {
                await transManager.getRepository(PoSubLineBundleEntity).update({ processingSerial, procType: processType, bundleNumber: eachBundle, unitCode, companyCode }, { updatedUser: username, isJobGenerated: true })
            }
            await transManager.getRepository(SJobPslEntity).save(jobPslEntities, { reload: false });
            for (const eachJob of allCreatedSJobs) {
                await this.createJobBomInfoWithManager(eachJob, transManager, unitCode, companyCode, username);

            };
            await transManager.completeTransaction();
            await this.poRoutingRepo.update({ id: routingDetails.id }, { jobsGenStatus: JobsGenStatusEnum.OPEN });
            // send the jobs created status to the PTS - Bull Job
            if (!processingOrderInfo.isActualTracking) {
                for (const eachJob of allCreatedSJobs) {
                    const jobNumReq = new PTS_C_ProductionJobNumberRequest(username, unitCode, companyCode, userId, eachJob, processingSerial, processType);
                    await this.fgCreationService.mapActualBundlesForJob(jobNumReq);
                }
            }
            // TODO IF IT IS PLANNED NEED TO TRIGGER PTS API
        } catch (err) {
            await transManager.releaseTransaction();
            checkFlag ? await this.poRoutingRepo.update({ id: routingId }, { jobsGenStatus: JobsGenStatusEnum.OPEN }) : null;
            throw err;
        };

        return new GlobalResponseObject(true, 0, 'Processing Jobs Generated Successfully');
    }



    async createJobBomInfo(reqObj: SPS_C_ProcJobNumberRequest): Promise<GlobalResponseObject> {
        const manager = new GenericTransactionManager(this.dataSource)
        try {
            await manager.startTransaction();
            const res = await this.createJobBomInfoWithManager(reqObj.jobNumber, manager, reqObj.unitCode, reqObj.companyCode, reqObj.username);
            await manager.completeTransaction();
            return new GlobalResponseObject(true, 0, 'Job Bom Details saved Successfully')
        } catch (err) {
            await manager.releaseTransaction();
            throw err;
        }
    }



    async createJobBomInfoWithManager(jobNumber: string, transManager: GenericTransactionManager, unitCode: string, companyCode: string, username: string): Promise<boolean> {
        const jobInfo = await transManager.getRepository(SJobLineEntity).findOne({ where: { jobNumber, unitCode, companyCode, isActive: true } });
        const jobBundlesInfo = await transManager.getRepository(SJobPslEntity).find({ where: { jobNumber, unitCode, companyCode } });
        const refSubLineId = jobBundlesInfo[0].moProductSubLineId;
        const processingSerial = jobBundlesInfo[0].processingSerial;
        const subLineInfo = await this.poSubLineRepo.findOne({ where: { moProductSubLineId: refSubLineId, unitCode, companyCode, processingSerial } });
        const refProductCode = subLineInfo.productCode;
        const fgColor = subLineInfo.fgColor;
        const processType = jobInfo.processType;
        const moProductSubLineIdsForBundle = new Set<number>();
        const productFgColorSizeQtyMap = new Map<string, Map<string, Map<string, number>>>();
        const jobMaterialInfo: PoWhJobMaterialEntity[] = [];
        let rmCheck = false;
        let bomCheck = false;
        for (const eachBundle of jobBundlesInfo) {
            moProductSubLineIdsForBundle.add(eachBundle.moProductSubLineId);
            const subLineInfo = await this.poSubLineRepo.findOne({ where: { moProductSubLineId: eachBundle.moProductSubLineId, unitCode, companyCode, processingSerial } });
            if (!productFgColorSizeQtyMap.has(subLineInfo.productCode)) {
                productFgColorSizeQtyMap.set(subLineInfo.productCode, new Map<string, Map<string, number>>());
            }
            if (!productFgColorSizeQtyMap.get(subLineInfo.productCode).has(subLineInfo.fgColor)) {
                productFgColorSizeQtyMap.get(subLineInfo.productCode).set(subLineInfo.fgColor, new Map<string, number>());
            }
            if (!productFgColorSizeQtyMap.get(subLineInfo.productCode).get(subLineInfo.fgColor).has(subLineInfo.size)) {
                productFgColorSizeQtyMap.get(subLineInfo.productCode).get(subLineInfo.fgColor).set(subLineInfo.size, 0);
            }
            const preQty = productFgColorSizeQtyMap.get(subLineInfo.productCode).get(subLineInfo.fgColor).get(subLineInfo.size);
            productFgColorSizeQtyMap.get(subLineInfo.productCode).get(subLineInfo.fgColor).set(subLineInfo.size, preQty + eachBundle.quantity);
        };
        const subProcessList: MOC_OpRoutingSubProcessList[] = [];
        const routingDetails: MOC_OpRoutingModel = await this.getRoutingInfoForMOProductCodeAndFgColor(processType, Array.from(moProductSubLineIdsForBundle), refProductCode, fgColor, unitCode, companyCode);
        routingDetails.processTypesList.forEach((eachProcessType, index) => {
            for (const eachProcessJobGroup of eachProcessType.subProcessList) {
                subProcessList.push(eachProcessJobGroup);
            }
        });
        const subProcessesOfProcessType = subProcessList.filter(sp => sp.processType == jobInfo.processType);
        if (!subProcessesOfProcessType.length) {
            throw new ErrorResponse(0, `${jobInfo.processType} is not identified in the routing. Please check and try again`);
        };
        const createdProcessTypes = new Map<string, Map<string, Set<ProcessTypeEnum>>>();
        const subProcessRoutingInfo: MOC_OpRoutingSubProcessList = subProcessList.find(sp => sp.subProcessName == jobInfo.subProcessName);
        for (const eachDepSubProcess of subProcessRoutingInfo.dependentSubProcesses) {
            const dependencyProcessType = eachDepSubProcess.processesType;
            for (const [product, productInfo] of productFgColorSizeQtyMap) {
                const productRefInfo = await this.poProductRepo.findOne({ where: { processingSerial, productCode: product, unitCode, companyCode } });
                for (const [fgColor, colorInfo] of productInfo) {
                    for (const [size, qty] of colorInfo) {
                        const jobMaterialEntity = new PoWhJobMaterialEntity();
                        jobMaterialEntity.allocatedQty = 0;
                        jobMaterialEntity.bomItemType = BomItemTypeEnum.SFG;
                        jobMaterialEntity.companyCode = companyCode;
                        jobMaterialEntity.createdUser = username;
                        jobMaterialEntity.issuedQty = 0;
                        let itemSku = eachDepSubProcess.itemSku;
                        if (!subProcessRoutingInfo.isRequestNeeded) {
                            const depSubProcessInfo = subProcessList.find(sp => sp.subProcessName == eachDepSubProcess.subProcessName);
                            if (depSubProcessInfo) {
                                itemSku = depSubProcessInfo.outPutSku;
                            };

                        }
                        jobMaterialEntity.itemCode = itemSku;
                        jobMaterialEntity.itemColor = 'NA';
                        jobMaterialEntity.itemDescription = 'NA';
                        jobMaterialEntity.itemName = 'NA';
                        jobMaterialEntity.itemType = PhItemCategoryEnum.DEFAULT;
                        jobMaterialEntity.jobNumber = jobNumber;
                        jobMaterialEntity.processType = processType;
                        jobMaterialEntity.processingSerial = processingSerial;
                        jobMaterialEntity.requiredQty = qty;
                        jobMaterialEntity.subProcessName = subProcessRoutingInfo.subProcessName;
                        jobMaterialEntity.unitCode = unitCode;
                        let checkExists = false;
                        if (createdProcessTypes.has(fgColor)) {
                            if (createdProcessTypes.get(fgColor).has(size)) {
                                if (createdProcessTypes.get(fgColor).get(size).has(dependencyProcessType)) {
                                    checkExists = true
                                }
                            }
                        }
                        jobMaterialEntity.isRequestNeeded = checkExists ? false : subProcessRoutingInfo.isRequestNeeded;
                        if (subProcessRoutingInfo.isRequestNeeded) {
                            if (!createdProcessTypes.has(fgColor)) {
                                createdProcessTypes.set(fgColor, new Map<string, Set<ProcessTypeEnum>>());
                                if (!createdProcessTypes.get(fgColor).has(size)) {
                                    createdProcessTypes.get(fgColor).set(size, new Set<ProcessTypeEnum>())
                                };
                                createdProcessTypes.get(fgColor).get(size).add(dependencyProcessType);
                            }
                            bomCheck = true;
                        }
                        jobMaterialEntity.depProcessType = dependencyProcessType;
                        jobMaterialEntity.processType = processType;
                        jobMaterialEntity.productRef = productRefInfo.productRef;
                        jobMaterialEntity.fgColor = fgColor;
                        jobMaterialEntity.size = size;
                        jobMaterialEntity.uom = 'NA';
                        jobMaterialEntity.consumption = 1;
                        jobMaterialEntity.depSubProcessName = eachDepSubProcess.subProcessName;
                        jobMaterialEntity.sJobHeaderId = jobInfo.sJobHeaderId;
                        if (dependencyProcessType == ProcessTypeEnum.KNIT || dependencyProcessType == ProcessTypeEnum.CUT) {
                            jobMaterialEntity.allocatedQty = jobMaterialEntity.isRequestNeeded == false ? qty : 0;
                            jobMaterialEntity.issuedQty = jobMaterialEntity.isRequestNeeded == false ? qty : 0;
                        }
                        jobMaterialInfo.push(jobMaterialEntity);
                    }
                }
            }

        };
        for (const eachBom of subProcessRoutingInfo.bomList) {
            if (eachBom.isThisAPreOpOutput) continue;
            for (const [product, productInfo] of productFgColorSizeQtyMap) {
                const productRefInfo = await this.poProductRepo.findOne({ where: { processingSerial, productCode: product, unitCode, companyCode } });
                for (const [fgColor, colorInfo] of productInfo) {
                    for (const [size, qty] of colorInfo) {
                        const jobMaterialEntity = new PoWhJobMaterialEntity();
                        jobMaterialEntity.allocatedQty = 0;
                        jobMaterialEntity.bomItemType = eachBom.bomItemType;
                        jobMaterialEntity.companyCode = companyCode;
                        jobMaterialEntity.createdUser = username;
                        jobMaterialEntity.issuedQty = 0;
                        jobMaterialEntity.itemCode = eachBom.bomItemCode;
                        jobMaterialEntity.itemColor = 'NA';
                        jobMaterialEntity.itemDescription = eachBom.bomItemDesc;
                        jobMaterialEntity.itemName = eachBom.bomItemName;
                        jobMaterialEntity.itemType = eachBom.itemType;
                        jobMaterialEntity.jobNumber = jobNumber;
                        jobMaterialEntity.processType = processType;
                        jobMaterialEntity.isRequestNeeded = eachBom.itemType == PhItemCategoryEnum.TRIM ? true : false;
                        jobMaterialEntity.processingSerial = processingSerial;
                        jobMaterialEntity.requiredQty = qty * eachBom.consumption;
                        jobMaterialEntity.subProcessName = jobInfo.subProcessName;
                        jobMaterialEntity.unitCode = unitCode;
                        jobMaterialEntity.depProcessType = processType;
                        jobMaterialEntity.fgColor = fgColor;
                        jobMaterialEntity.size = size;
                        jobMaterialEntity.productRef = productRefInfo.productRef;
                        jobMaterialEntity.processType = processType;
                        jobMaterialEntity.uom = 'NA';
                        jobMaterialEntity.consumption = eachBom.consumption;
                        jobMaterialEntity.depProcessType = processType;
                        jobMaterialEntity.depSubProcessName = 'NA';
                        jobMaterialEntity.sJobHeaderId = jobInfo.sJobHeaderId;
                        jobMaterialInfo.push(jobMaterialEntity);
                        rmCheck = true;
                    }
                }
            }
        };
        await transManager.getRepository(PoWhJobMaterialEntity).save(jobMaterialInfo, { reload: false });
        const opsInfo = await transManager.getRepository(SJobLineOperationsEntity).find({ where: { jobNumber, unitCode, companyCode }, select: ['smv'] })
        // Need to insert for each job line -> job-line-plan -> job-line-op -> po-wh-job-material
        const jobPlanObj = new SJobLinePlanEntity();
        jobPlanObj.companyCode = companyCode;
        jobPlanObj.createdUser = username;
        jobPlanObj.jobNumber = jobNumber;
        jobPlanObj.locationCode = null;
        jobPlanObj.status = SewingJobPlanStatusEnum.OPEN;
        jobPlanObj.planInputDate = null;
        jobPlanObj.rawMaterialStatus = rmCheck ? TrimStatusEnum.OPEN : TrimStatusEnum.NR;
        jobPlanObj.itemSkuStatus = bomCheck ? TrimStatusEnum.OPEN : TrimStatusEnum.NR;
        jobPlanObj.unitCode = unitCode;
        jobPlanObj.companyCode = companyCode;
        jobPlanObj.processingSerial = processingSerial;
        jobPlanObj.smv = opsInfo.reduce((acc, curr) => {
            return Number(acc) + Number(curr.smv);
        }, 0);
        jobPlanObj.processType = processType;
        jobPlanObj.jobPriority = 0;
        await transManager.getRepository(SJobLinePlanEntity).save(jobPlanObj);
        return true;
    }

    /**
     * Service to ge the processing jobs information for the processing type and processing serial
     * @param reqObj 
     * @param config 
     * @returns 
    */
    async getProcessingJobsInfoForProcessingType(reqObj: PJ_ProcessingSerialRequest): Promise<PJ_ProcessingJobBatchInfoResp> {
        const { processingSerial, processType, unitCode, companyCode } = reqObj;
        const jobPrefObj = await this.jobPreferencesRepository.find({ where: { processingSerial, processType, unitCode, companyCode, isActive: true } });
        const batchInfo: PJ_ProcessingJobBatchDetails[] = [];
        for (const eachBatch of jobPrefObj) {
            const jobHeader = await this.jobHeaderRepo.find({ where: { jobPrefId: eachBatch.id, unitCode, companyCode, isActive: true }, select: ['id', 'jobHeaderNo'] });
            const jobLineObjs: PJ_ProcessingJobLine[] = [];
            for (const eachJobHeader of jobHeader) {
                const jobLines = await this.jobGroupRepo.find({ where: { sJobHeaderId: eachJobHeader.id, unitCode, companyCode, isActive: true } });
                for (const eachJob of jobLines) {
                    const subLines: PJ_ProcessingJobSubLine[] = [];
                    const totalSmv = await this.jobOperationsRepo.getTotalSmvByJobNo(eachJob.jobNumber, unitCode, companyCode);
                    const moduleInfo = await this.jobPlanRepo.findOne({ where: { jobNumber: eachJob.jobNumber, unitCode, companyCode } });
                    const subLineInfo = await this.jobPslMap.find({ where: { jobNumber: eachJob.jobNumber, unitCode, companyCode, isActive: true } });
                    const productColorSizeQty = new Map<string, Map<string, Map<string, number>>>();
                    for (const eachSubLine of subLineInfo) {
                        const subLineAttributes = await this.poSubLineFeatures.findOne({ where: { moProductSubLineId: eachSubLine.moProductSubLineId, processingSerial, unitCode, companyCode } });
                        if (!productColorSizeQty.has(subLineAttributes.productName)) {
                            productColorSizeQty.set(subLineAttributes.productName, new Map<string, Map<string, number>>())
                        }
                        if (!productColorSizeQty.get(subLineAttributes.productName).has(subLineAttributes.fgColor)) {
                            productColorSizeQty.get(subLineAttributes.productName).set(subLineAttributes.fgColor, new Map<string, number>());
                        }
                        if (!productColorSizeQty.get(subLineAttributes.productName).get(subLineAttributes.fgColor).has(subLineAttributes.size)) {
                            productColorSizeQty.get(subLineAttributes.productName).get(subLineAttributes.fgColor).set(subLineAttributes.size, 0)
                        }
                        const preQty = productColorSizeQty.get(subLineAttributes.productName).get(subLineAttributes.fgColor).get(subLineAttributes.size);
                        productColorSizeQty.get(subLineAttributes.productName).get(subLineAttributes.fgColor).set(subLineAttributes.size, preQty + Number(eachSubLine.quantity));
                    }
                    for (const [prodName, prodQty] of productColorSizeQty) {
                        for (const [color, colorInfo] of prodQty) {
                            for (const [size, qty] of colorInfo) {
                                subLines.push(new PJ_ProcessingJobSubLine(prodName, prodName, null, size, color, qty));
                            }
                        }
                    }
                    const jobLineEntity = new PJ_ProcessingJobLine(eachJob.jobNumber, eachJobHeader.jobHeaderNo, processType, totalSmv.smv, moduleInfo.locationCode ? true : false, moduleInfo.locationCode, totalSmv.original_qty, eachBatch.multiColor, eachBatch.multiSize, eachBatch.groupInfo, subLines);
                    jobLineObjs.push(jobLineEntity);
                }
            }
            const jobBatch = new PJ_ProcessingJobBatchDetails(eachBatch.id, moment(eachBatch.createdAt).format('YYYY-MM-DD HH:MM'), eachBatch.groupInfo, eachBatch.multiColor, eachBatch.multiSize, eachBatch.sewingJobQty, 0, 0, jobLineObjs, processType);
            batchInfo.push(jobBatch);
        }

        return new PJ_ProcessingJobBatchInfoResp(true, 26144, 'Sewing job Batch info retrieved successfully', batchInfo)
    }

    // Services using for Dashboard / Reports

    // For IPS dashboard 

    // will be only called from the IPS
    /**
     * TODO: Can be multiple processing types as dependency for one sub process but should be in single routing group--done
     * TODO: last issued date should get from the history table for that item code + job 
     * Once user clicks on the job Need to call this api to get the job level detail information in order to show the same in the header
     * Usually calls from the UI dashboards once user clicks on the box of a job. 
     * @param reqObj 
     * @param config 
     * @returns 
    */
    async getJobInfoByJobNumber(reqObj: SPS_C_ProcJobNumberRequest): Promise<SPS_R_JobInfoDetailedResponse> {
        const { jobNumber, unitCode, companyCode, iNeedBundles, iNeedColSizeQty, iNeedDepBundlesInfo, iNeedDepOpSkuInfo, iNeedFeatures, iNeedTrims } = reqObj;
        const processingJobsInfo: SPS_R_ProcJobInfoModel[] = [];
        let processingSerial: number = null;
        let processingType: ProcessTypeEnum = null;
        console.log(jobNumber)
        const processingJobInfo = await this.jobGroupRepo.findOne({ where: { jobNumber, unitCode, companyCode } });
        if (!processingJobInfo) {
            throw new ErrorResponse(0, 'Processing jobs information not found. Please check and try again');
        }
        processingSerial = processingJobInfo.processingSerial;
        processingType = processingJobInfo.processType;
        const productCodeJobsMap = new Map<string, SJobPslEntity[]>();
        const jobSubLineInfo = await this.jobPslMap.find({ where: { jobNumber, unitCode, companyCode } });
        const subLineFeaturesMap = new Map<number, ProductSubLineFeaturesEntity>();
        const jobPslObjects: SPS_R_JobPslQtyModel[] = []
        for (const eachSubLine of jobSubLineInfo) {
            const jobPslObj = new SPS_R_JobPslQtyModel(eachSubLine.moProductSubLineId, eachSubLine.quantity, eachSubLine.cancelledQuantity, eachSubLine.reJobGenQty)
            jobPslObjects.push(jobPslObj);
            if (!subLineFeaturesMap.has(eachSubLine.moProductSubLineId)) {
                const featuresInfo = await this.poSubLineFeatures.findOne({ where: { processingSerial, unitCode, companyCode, moProductSubLineId: eachSubLine.moProductSubLineId, isActive: true } });
                subLineFeaturesMap.set(eachSubLine.moProductSubLineId, featuresInfo);
            }
            const featuresInfo = subLineFeaturesMap.get(eachSubLine.moProductSubLineId);
            if (!productCodeJobsMap.has(featuresInfo.productCode)) {
                productCodeJobsMap.set(featuresInfo.productCode, []);
            }
            productCodeJobsMap.get(featuresInfo.productCode).push(eachSubLine);
        }
        for (const [product, subLineInfo] of productCodeJobsMap) {
            const moNumbersSet = new Set<string>();
            const moProductSubLineIdsSet = new Set<number>();
            const trims: SPS_R_ProcJobTrimsModel[] = [];
            const jobDepSkuInfo: SPS_R_JobDepOpSkuInfo[] = [];
            let jobFeatures: SPS_R_JobFeaturesModel = null;
            const bundlesInfo: SPS_R_JobBundles[] = [];
            const colorSizeQty: SPS_R_JobColorSizeModel[] = [];
            const depBundlesInfo: SPS_R_JobDepBundlesModel[] = []
            let quantity = 0;;
            const style = new Set<string>();
            const color = new Set<string>();
            const delDate = new Set<string>();
            const vpo = new Set<string>();
            const soNo = new Set<string>();
            const destination = new Set<string>();
            const soLineNo = new Set<string>();
            const buyer = new Set<string>();
            const colorSizeQtyMap = new Map<string, Map<string, number>>();
            const colorSizePslIds = new Map<string, Map<string, Set<number>>>();

            for (const eachSubLine of subLineInfo) {
                const featuresInfoOfSubLine = subLineFeaturesMap.get(eachSubLine.moProductSubLineId);
                if (iNeedColSizeQty) {
                    if (!colorSizeQtyMap.has(featuresInfoOfSubLine.fgColor)) {
                        colorSizeQtyMap.set(featuresInfoOfSubLine.fgColor, new Map<string, number>());
                        colorSizePslIds.set(featuresInfoOfSubLine.fgColor, new Map<string, Set<number>>());
                    }
                    if (!colorSizeQtyMap.get(featuresInfoOfSubLine.fgColor).has(featuresInfoOfSubLine.size)) {
                        colorSizeQtyMap.get(featuresInfoOfSubLine.fgColor).set(featuresInfoOfSubLine.size, 0);
                        colorSizePslIds.get(featuresInfoOfSubLine.fgColor).set(featuresInfoOfSubLine.size, new Set<number>());
                    }
                    const preQty = colorSizeQtyMap.get(featuresInfoOfSubLine.fgColor).get(featuresInfoOfSubLine.size);
                    colorSizeQtyMap.get(featuresInfoOfSubLine.fgColor).set(featuresInfoOfSubLine.size, preQty + eachSubLine.quantity);
                    colorSizePslIds.get(featuresInfoOfSubLine.fgColor).get(featuresInfoOfSubLine.size).add(featuresInfoOfSubLine.moProductSubLineId);
                }
                const featuresInfo = subLineFeaturesMap.get(featuresInfoOfSubLine.moProductSubLineId);
                moNumbersSet.add(featuresInfo.moNumber);
                quantity += eachSubLine.quantity;
                moProductSubLineIdsSet.add(featuresInfoOfSubLine.moProductSubLineId);
                if (iNeedFeatures) {
                    style.add(featuresInfo.styleCode);
                    color.add(featuresInfo.fgColor);
                    delDate.add(featuresInfo.deliveryDate);
                    vpo.add(featuresInfo.coNumber);
                    soNo.add(featuresInfo.soNumber);
                    destination.add(featuresInfo.destination);
                    soLineNo.add(featuresInfo.soLineNumber);
                    buyer.add(featuresInfo.customerCode);
                }
            };
            if (iNeedBundles || iNeedDepBundlesInfo) {
                const jobBundlesInfo = await this.sJobSubLineRepo.find({ where: { sJobLineId: processingJobInfo.id, unitCode, companyCode } });
                for (const eachBundle of jobBundlesInfo) {
                    const jobBundleObj = new SPS_R_JobBundles(eachBundle.bundleNumber, eachBundle.qty, eachBundle.moProductSubLineId);
                    bundlesInfo.push(jobBundleObj);
                }
            }
            if (iNeedFeatures) {
                const featuresInfo = new SPS_R_JobFeaturesModel(Array.from(style).toString(), Array.from(color), Array.from(delDate), Array.from(vpo), Array.from(soNo), Array.from(destination), Array.from(soLineNo), Array.from(buyer));
                jobFeatures = featuresInfo;
            }
            if (iNeedColSizeQty) {
                for (const [color, colorDetail] of colorSizeQtyMap) {
                    for (const [size, qty] of colorDetail) {
                        const colSizeObj = new SPS_R_JobColorSizeModel(color, size, qty, Array.from(colorSizePslIds?.get(color)?.get(size)));
                        colorSizeQty.push(colSizeObj);
                    }
                }
            }
            if (iNeedTrims) {
                const trimsInfoForJob = await this.jobWhMaterialRepo.find({ where: { jobNumber, processingSerial, processType: processingType, unitCode, companyCode, isActive: true, isRequestNeeded: true, itemType: PhItemCategoryEnum.TRIM } });
                const itemCodeTrimInfo = new Map<string, PoWhJobMaterialEntity[]>();
                for (const eachTrimInfo of trimsInfoForJob) {
                    if (!itemCodeTrimInfo.has(eachTrimInfo.itemCode)) {
                        itemCodeTrimInfo.set(eachTrimInfo.itemCode, [])
                    }
                    itemCodeTrimInfo.get(eachTrimInfo.itemCode).push(eachTrimInfo);
                }
                for (const [itemCode, trimInfo] of itemCodeTrimInfo) {
                    const itemCodeDetailRef = trimInfo[0];
                    let requiredQty = 0;
                    let issuedQty = 0;
                    let allocatedQty = 0;
                    let totalPerPieceConsumption = 0;
                    for (const eachTrim of trimInfo) {
                        requiredQty += Number(eachTrim.requiredQty);
                        issuedQty += Number(eachTrim.issuedQty);
                        allocatedQty += Number(eachTrim.allocatedQty);
                        totalPerPieceConsumption += Number(eachTrim.consumption);
                    }
                    const issuanceData = await this.poWhJobMaterialIssuanceHistoryRepository.findOne({ where: { unitCode: reqObj.unitCode, companyCode: reqObj.companyCode, itemCode: itemCode, jobNumber: reqObj.jobNumber }, order: { createdAt: 'DESC' } });
                    const trimsObj = new SPS_R_ProcJobTrimsModel(itemCode, itemCodeDetailRef.itemDescription, itemCodeDetailRef.itemType, itemCodeDetailRef.itemName, totalPerPieceConsumption, requiredQty, issuedQty, issuanceData ? moment(issuanceData.createdAt).format('YYYY-MM-DD') : null, itemCodeDetailRef.createdUser, itemCodeDetailRef.uom, allocatedQty);
                    trims.push(trimsObj);
                }
            }
            if (iNeedDepOpSkuInfo) {
                const trimsInfoForJob = await this.jobWhMaterialRepo.find({ where: { jobNumber, processingSerial, unitCode, companyCode, isActive: true, isRequestNeeded: true, bomItemType: In([BomItemTypeEnum.SFG, BomItemTypeEnum.PANEL]) } });
                for (const itemCodeDetailRef of trimsInfoForJob) {
                    const jobDepSkuInfoObj = new SPS_R_JobDepOpSkuInfo(itemCodeDetailRef.depProcessType, itemCodeDetailRef.depSubProcessName, itemCodeDetailRef.itemCode, true, itemCodeDetailRef.issuedQty, itemCodeDetailRef.allocatedQty, itemCodeDetailRef.fgColor, itemCodeDetailRef.size);
                    jobDepSkuInfo.push(jobDepSkuInfoObj);
                }
            }
            if (iNeedDepBundlesInfo) {
                const trimsInfoForJob = await this.jobWhMaterialRepo.find({ where: { jobNumber, processingSerial, processType: processingType, unitCode, companyCode, isActive: true, isRequestNeeded: true, bomItemType: BomItemTypeEnum.SFG } });
                for (const eachSubProcess of trimsInfoForJob) {
                    const depSubProcessInfo = new SPS_R_JobDepBundlesModel(eachSubProcess.depProcessType, eachSubProcess.itemCode, eachSubProcess.depSubProcessName, bundlesInfo);
                    depBundlesInfo.push(depSubProcessInfo);
                }

            };
            const poSerialInfo = await this.poRepo.findOne({ where: { processingSerial, unitCode, companyCode }, select: ['isActualTracking'] });
            if (!poSerialInfo) {
                throw new ErrorResponse(0, 'Processing Serial info not found. Please check and try again')
            }
            const moProductSubLineIds: number[] = Array.from(moProductSubLineIdsSet);
            const jobObj = new SPS_R_ProcJobInfoModel(processingSerial, processingType, product, jobNumber, Array.from(moNumbersSet).toString(), quantity, trims, jobDepSkuInfo, jobFeatures, bundlesInfo, colorSizeQty, depBundlesInfo, moProductSubLineIds, jobPslObjects, poSerialInfo?.isActualTracking, processingJobInfo.subProcessName);
            processingJobsInfo.push(jobObj);
        }
        return new SPS_R_JobInfoDetailedResponse(true, 0, 'Job Info Retrieved Successfully', processingJobsInfo);
    }

    /**
     * Service to get the Jobs under the location which requires trims / rm but not yet issues
     * Usually calls from the Trims issue dashboard by passing the iNeedTrims true
     * TODO: requested on and issued on should take from the history tables
     * @param reqObj 
     * @param config
     * @returns 
    */
    async getRMInProgressJobsForLocation(reqObj: IPS_C_LocationCodeRequest): Promise<IPS_R_LocationJobsResponse> {
        const { locationCode, unitCode, companyCode, iNeedBomReqStatus, iNeedJobFeatures, iNeedJobs, iNeedTrackingStatus, iNeedTrimsStatus } = reqObj;
        const locationWiseJobInfo: IPS_R_LocationJobsModel[] = [];
        const jobPlanInfo = await this.jobPlanRepo.getFilteredJobPlans(locationCode, unitCode, companyCode);
        const locationWiseJobMap = new Map<string, SJobLinePlanEntity[]>();
        for (const eachJob of jobPlanInfo) {
            if (!locationWiseJobMap.has(eachJob.locationCode)) {
                locationWiseJobMap.set(eachJob.locationCode, []);
            }
            locationWiseJobMap.get(eachJob.locationCode).push(eachJob);
        }
        for (const [locationCode, jobsInfo] of locationWiseJobMap) {
            const eachJobObj: IPS_R_JobModel[] = [];
            if (iNeedJobs) {
                for (const eachJob of jobsInfo) {
                    const jobNumber = eachJob.jobNumber;
                    const processingSerial = eachJob.processingSerial;
                    const processingType = eachJob.processType;
                    const processingJobInfo = await this.jobGroupRepo.findOne({ where: { jobNumber, unitCode, companyCode } });
                    if (!processingJobInfo) {
                        throw new ErrorResponse(0, 'Processing jobs information not found. Please check and try again');
                    }
                    const productCodeJobsMap = new Map<string, SJobPslEntity[]>();
                    const jobSubLineInfo = await this.jobPslMap.find({ where: { jobNumber, unitCode, companyCode } });
                    const subLineFeaturesMap = new Map<number, ProductSubLineFeaturesEntity>();
                    for (const eachSubLine of jobSubLineInfo) {
                        if (!subLineFeaturesMap.has(eachSubLine.moProductSubLineId)) {
                            const featuresInfo = await this.poSubLineFeatures.findOne({ where: { processingSerial, unitCode, companyCode, moProductSubLineId: eachSubLine.moProductSubLineId, isActive: true } });
                            subLineFeaturesMap.set(eachSubLine.moProductSubLineId, featuresInfo);
                        }
                        const featuresInfo = subLineFeaturesMap.get(eachSubLine.moProductSubLineId);
                        if (!productCodeJobsMap.has(featuresInfo.productCode)) {
                            productCodeJobsMap.set(featuresInfo.productCode, []);
                        }
                        productCodeJobsMap.get(featuresInfo.productCode).push(eachSubLine);
                    }
                    for (const [product, subLineInfo] of productCodeJobsMap) {
                        let qty = subLineInfo.reduce((acc, curr) => {
                            return acc + (curr.quantity + curr.reJobGenQty);
                        }, 0);
                        let jobFeatures: SPS_R_JobFeaturesModel = null;
                        const colorSizeQty: SPS_R_JobColorSizeModel[] = [];
                        let trimsStatus: IPS_R_JobTrimStatusModel = null;
                        let depBomStatus: IPS_R_JobTrimStatusModel = null
                        const depBomItemStatus: IPS_R_JobDepBomItemStatusModel[] = [];
                        const trackingStatus: IPS_R_JobTrackingStatusModel[] = [];
                        const style = new Set<string>();
                        const color = new Set<string>();
                        const delDate = new Set<string>();
                        const vpo = new Set<string>();
                        const soNo = new Set<string>();
                        const destination = new Set<string>();
                        const soLineNo = new Set<string>();
                        const buyer = new Set<string>();
                        const colorSizeQtyMap = new Map<string, Map<string, number>>();
                        for (const eachSubLine of subLineInfo) {
                            const actFeatureInfo = subLineFeaturesMap.get(eachSubLine.moProductSubLineId);
                            if (!colorSizeQtyMap.has(actFeatureInfo.fgColor)) {
                                colorSizeQtyMap.set(actFeatureInfo.fgColor, new Map<string, number>());
                            }
                            if (!colorSizeQtyMap.get(actFeatureInfo.fgColor).has(actFeatureInfo.size)) {
                                colorSizeQtyMap.get(actFeatureInfo.fgColor).set(actFeatureInfo.size, 0);
                            }
                            const preQty = colorSizeQtyMap.get(actFeatureInfo.fgColor).get(actFeatureInfo.size);
                            colorSizeQtyMap.get(actFeatureInfo.fgColor).set(actFeatureInfo.size, preQty + (eachSubLine.quantity + eachSubLine.reJobGenQty));
                            const featuresInfo = subLineFeaturesMap.get(eachSubLine.moProductSubLineId);
                            if (iNeedJobFeatures) {
                                style.add(featuresInfo.styleCode);
                                color.add(featuresInfo.fgColor);
                                delDate.add(featuresInfo.deliveryDate);
                                vpo.add(featuresInfo.coNumber);
                                soNo.add(featuresInfo.soNumber);
                                destination.add(featuresInfo.destination);
                                soLineNo.add(featuresInfo.soLineNumber);
                                buyer.add(featuresInfo.customerCode);
                            }
                        }
                        if (iNeedJobFeatures) {
                            const featuresInfo = new SPS_R_JobFeaturesModel(Array.from(style).toString(), Array.from(color), Array.from(delDate), Array.from(vpo), Array.from(soNo), Array.from(destination), Array.from(soLineNo), Array.from(buyer));
                            jobFeatures = featuresInfo;
                        }
                        if (iNeedBomReqStatus) {
                            const trimsInfoForJob = await this.jobWhMaterialRepo.find({ where: { jobNumber, processingSerial, processType: processingType, unitCode, companyCode, isActive: true, isRequestNeeded: true, bomItemType: BomItemTypeEnum.SFG } });
                            for (const eachSubProcess of trimsInfoForJob) {
                                const planInfo = jobPlanInfo.find(job => job.jobNumber == jobNumber);
                                const depSubProcessInfo = new IPS_R_JobDepBomItemStatusModel(eachSubProcess.depProcessType, planInfo.itemSkuStatus, eachSubProcess.allocatedQty, eachSubProcess.issuedQty, null, null);
                                depBomItemStatus.push(depSubProcessInfo);
                            }
                        }
                        if (iNeedTrackingStatus) {
                            const jobOpInfo = await this.jobOperationsRepo.find({ where: { jobNumber, unitCode, companyCode } });
                            for (const eachOp of jobOpInfo) {
                                const tackInfo = new IPS_R_JobTrackingStatusModel(eachOp.operationGroup, eachOp.goodQty, eachOp.rejectionQty);
                                trackingStatus.push(tackInfo);
                            }
                        }
                        if (iNeedTrimsStatus) {
                            const materialReqDetails = await this.phWhReqLineRepo.findOne({ where: { jobNumber, processingSerial, processType: processingType, unitCode, companyCode }, order: { 'createdAt': 'ASC', } });
                            const planInfo = jobPlanInfo.find(job => job.jobNumber == jobNumber);
                            if (materialReqDetails) {
                                const issuanceData = await this.poWhJobMaterialIssuanceHistoryRepository.findOne({ where: { unitCode: reqObj.unitCode, companyCode: reqObj.companyCode, whReqId: materialReqDetails.id, jobNumber }, order: { createdAt: 'DESC' } });
                                trimsStatus = new IPS_R_JobTrimStatusModel(moment(materialReqDetails.createdAt).format('YYYY-MM-DD'), issuanceData ? moment(issuanceData.createdAt).format('YYYY-MM-DD') : null, planInfo.rawMaterialStatus);
                            } else {
                                trimsStatus = new IPS_R_JobTrimStatusModel(null, null, planInfo.rawMaterialStatus);
                            };

                            const materialReqDetailsForItem = await this.phWhReqLineRepo.findOne({ where: { jobNumber, processingSerial, processType: processingType, unitCode, companyCode, bomItemType: In([BomItemTypeEnum.PANEL, BomItemTypeEnum.SFG]) }, order: { 'createdAt': 'ASC', } });
                            const planInfoForItem = jobPlanInfo.find(job => job.jobNumber == jobNumber);
                            if (materialReqDetailsForItem) {
                                const issuanceData = await this.poWhJobMaterialIssuanceHistoryRepository.findOne({ where: { unitCode: reqObj.unitCode, companyCode: reqObj.companyCode, whReqId: materialReqDetailsForItem.id, jobNumber }, order: { createdAt: 'DESC' } });
                                depBomStatus = new IPS_R_JobTrimStatusModel(moment(materialReqDetailsForItem.createdAt).format('YYYY-MM-DD'), issuanceData ? moment(issuanceData.createdAt).format('YYYY-MM-DD') : null, planInfoForItem.itemSkuStatus);
                            } else {
                                depBomStatus = new IPS_R_JobTrimStatusModel(null, null, planInfo.itemSkuStatus);
                            }
                        }
                        for (const [color, sizeDetail] of colorSizeQtyMap) {
                            for (const [size, qty] of sizeDetail) {
                                const sizeColorObj = new SPS_R_JobColorSizeModel(color, size, qty, []);
                                colorSizeQty.push(sizeColorObj);
                            }
                        };
                        const statusGetReq = new SPS_C_ProcJobNumberRequest(null, unitCode, companyCode, null, eachJob.jobNumber, false, false, false, false, false, false)
                        const statusObj: IPS_R_JobStatusModel = await this.getJobDetailsForInputDashboard(statusGetReq);
                        const jobObj = new IPS_R_JobModel(eachJob.jobNumber, eachJob.processType, eachJob.processingSerial, product, qty, colorSizeQty, jobFeatures, trimsStatus, depBomItemStatus, trackingStatus, statusObj, depBomStatus);
                        eachJobObj.push(jobObj);
                    }

                }
            }
            const locationJobObj = new IPS_R_LocationJobsModel(locationCode, jobsInfo.length, eachJobObj);
            locationWiseJobInfo.push(locationJobObj);
        }
        return new IPS_R_LocationJobsResponse(true, 0, 'RM inprogress jobs retrieved successfully', locationWiseJobInfo);


    }

    async deleteProcessingJobs(reqObj: DeleteSewingJobsRequest): Promise<GlobalResponseObject> {
        const { jobPreferenceId, unitCode, companyCode, userId, username } = reqObj;
        const manager = new GenericTransactionManager(this.dataSource);
        let routId = 0;
        let checkFlag = true;
        try {
            const checkSJobPreference = await this.jobPreferencesRepository.findOne({ where: { id: jobPreferenceId, companyCode: companyCode, unitCode: unitCode } });
            if (!checkSJobPreference) {
                throw new ErrorResponse(26056, 'No sewing jobs found');
            };
            const processingSerial = checkSJobPreference.processingSerial;
            const processType = checkSJobPreference.processType;
            const routingDetails = await this.poRoutingRepo.findOne({ where: { processingSerial, processType, unitCode, companyCode } });
            if (!routingDetails) {
                throw new ErrorResponse(0, 'Routing Information not found for the given processing order. Please check and try again')
            };
            if (routingDetails.jobsGenStatus != JobsGenStatusEnum.OPEN) {
                throw new ErrorResponse(0, 'Processing jobs are in progress. Please check and try again')
            };
            routId = routingDetails.id;
            await this.poRoutingRepo.update({ id: routingDetails.id }, { jobsGenStatus: JobsGenStatusEnum.IN_PROGRESS });
            checkFlag = false;
            const getSJobHeaderIds = (await this.jobHeaderRepo.find({ where: { jobPrefId: checkSJobPreference.id }, select: ['id'] }))?.map(eachId => eachId.id);;
            const getSJobLineIds = (await this.jobGroupRepo.find({ where: { sJobHeaderId: In(getSJobHeaderIds) }, select: ['id'] }))?.map(eachId => eachId.id);
            const jobNumbers = (await this.jobGroupRepo.find({ where: { sJobHeaderId: In(getSJobHeaderIds) }, select: ['jobNumber'] }))?.map(eachId => eachId.jobNumber);
            const getInprogressJobs = (await this.jobPlanRepo.find({ where: { jobNumber: In(jobNumbers), unitCode, companyCode, processingSerial, processType, status: SewingJobPlanStatusEnum.IN_PROGRESS }, select: ['id'] }))?.map(eachId => eachId.id)
            if (getInprogressJobs.length) {
                throw new ErrorResponse(26057, 'sewing jobs already planned');
            };

            const getSJobSubLineIds = (await this.sJobSubLineRepo.find({ where: { sJobLineId: In(getSJobLineIds) }, select: ['id'] }))
                ?.map(eachId => eachId.id);
            const getSJobLineOperationIds = (await this.jobOperationsRepo.find({ where: { jobNumber: In(jobNumbers) }, select: ['id'] }))
                ?.map(eachId => eachId.id);
            const moProductSubLineId = (await this.jobPslMap.find({ where: { jobNumber: In(jobNumbers), unitCode, companyCode }, select: ['moProductSubLineId'] }))?.map(eachId => eachId.moProductSubLineId)
            await manager.startTransaction();
            await manager.getRepository(SJobLineOperationsEntity).delete({ id: In(getSJobLineOperationIds) }); // delete the job line operations
            await manager.getRepository(SJobLineEntity).delete({ id: In(getSJobLineIds) });
            await manager.getRepository(SJobHeaderEntity).delete({ id: In(getSJobHeaderIds) });
            await manager.getRepository(SJobLinePlanEntity).delete({ jobNumber: In(jobNumbers), unitCode, companyCode, processingSerial, processType: processType });
            await manager.getRepository(SJobBundleEntity).delete({ id: In(getSJobSubLineIds) });
            await manager.getRepository(PoSubLineBundleEntity).update({ moProductSubLineId: In(moProductSubLineId), unitCode, companyCode, processingSerial, procType: processType }, { isJobGenerated: false, updatedUser: username });
            await manager.getRepository(PoWhJobMaterialEntity).delete({ jobNumber: In(jobNumbers), unitCode, companyCode, processingSerial, processType: processType });
            await manager.getRepository(SJobPslEntity).delete({ jobNumber: In(jobNumbers), unitCode, companyCode, processingSerial, processType: processType });
            await manager.getRepository(SJobPreferences).delete({ id: checkSJobPreference.id });
            await manager.completeTransaction();
            await this.poRoutingRepo.update({ id: routingDetails.id }, { jobsGenStatus: JobsGenStatusEnum.OPEN });
            // call the PTS API
            await this.procJobHelperService.triggerDeleteJobsOfProcSerialToPts(processingSerial, processType, companyCode, unitCode, username);
            return new GlobalResponseObject(true, 0, 'Processing Jobs Deleted Successfully');
        } catch (err) {
            await manager.releaseTransaction();
            if (!checkFlag) {
                await this.poRoutingRepo.update({ id: routId }, { jobsGenStatus: JobsGenStatusEnum.OPEN });
            }
            throw err;
        }
    }


    async getBarcodeDetailsByJobNumber(req: SPS_C_ProcJobNumberRequest): Promise<SewingJobBarcodeInfoResp> {
        const sJobLineInfo = await this.jobGroupRepo.findOne({ where: { jobNumber: req.jobNumber, unitCode: req.unitCode, companyCode: req.companyCode } });
        if (!sJobLineInfo) {
            throw new ErrorResponse(0, 'Job Details Not found Please check and try again')
        }
        const sJobBundleInfo = await this.sJobSubLineRepo.find({ where: { sJobLineId: sJobLineInfo.id, unitCode: req.unitCode, companyCode: req.companyCode }, select: ['id'] });
        if (!sJobBundleInfo.length) {
            throw new ErrorResponse(0, `No Actual Bundles Found for the given sewing job. Please allocate`)
        }
        const queryResp = await this.jobGroupRepo.getBarcodeDetails(req.jobNumber, req.unitCode, req.companyCode)
        return new SewingJobBarcodeInfoResp(true, 26062, 'Barcode details retrieved successfully', queryResp)
    }

    /**
     * END POINT: Once user clicks on sewing job number Need to call this api to show the abstract info including dependent job group tabs
     * @param sewSerial 
     * @param jobNumber 
     * @param unitCode 
     * @param companyCode 
    */
    async getSewingJobQtyAndPropsInfoByJobNumber(jobNumber: string, unitCode: string, companyCode: string): Promise<SewingJobPropsResp> {
        const jobInfo = await this.jobGroupRepo.findOne({ where: { jobNumber: jobNumber, unitCode, companyCode }, select: ['id', 'processType'] });
        if (!jobInfo) {
            throw new ErrorResponse(0, 'Job Details not found the given job' + jobNumber);
        };
        const jobProps: SewingJobPropsModel = await this.jobGroupRepo.getJobPropsByJobNumber(jobNumber, unitCode, companyCode);
        const totalInputReportedQty = await this.jobOperationsRepo.getInputReportedQtyByJobNo(jobNumber, unitCode, companyCode);
        // const totalInputQty = await this.jobOperationsRepo.getInputReportedQtyByJobNo(jobNumber, unitCode, companyCode);
        const totalOutPutReportedQty = await this.jobOperationsRepo.getOutReportedQtyByJobNo(jobNumber, unitCode, companyCode);
        const totalBundleCount = await this.sJobSubLineRepo.count({ where: { sJobLineId: jobInfo.id, unitCode, companyCode } });
        const wip = (totalInputReportedQty - totalOutPutReportedQty);
        const pendingToInputQty = Number(jobProps.jobQty) - Number(totalInputReportedQty);
        const resourceInfo = await this.jobPlanRepo.findOne({ where: { jobNumber, unitCode, companyCode } });
        // if (!resourceInfo.locationCode) {
        //     throw new ErrorResponse(0, 'Job not yet planned please plan and try again')
        // }
        jobProps.inputReportedQty = totalInputReportedQty;
        jobProps.moduleNumber = resourceInfo.locationCode;
        jobProps.noOfJobBundles = totalBundleCount;
        jobProps.outputReportedQty = totalOutPutReportedQty;
        jobProps.wip = wip;
        jobProps.pendingToInputQty = pendingToInputQty;
        const dependentJobGroupInfo = await this.getDependentJobQtyForJobForAll(jobNumber, unitCode, companyCode);
        // let eligibleQty = Number(totalInputQty) - Number(totalInputReportedQty);
        let eligibleQty = 0;
        const depProcessTypeWiseInfo = new Map<any, DependentJobGroupInfo[]>();
        for (const eachDependentJobGroup of dependentJobGroupInfo) {
            if (!depProcessTypeWiseInfo.has(eachDependentJobGroup.depJobGroup)) {
                depProcessTypeWiseInfo.set(eachDependentJobGroup.depJobGroup, []);
            }
            depProcessTypeWiseInfo.get(eachDependentJobGroup.depJobGroup).push(eachDependentJobGroup);
        };
        for (const [depProcessType, eachDependentJobGroup] of depProcessTypeWiseInfo) {
            const totalIssuedQty = eachDependentJobGroup.reduce((pre, cur) => {
                return pre + Number(cur.issuedQty);
            }, 0);
            const eligibleToReportQtyForProcessType = (totalIssuedQty - totalInputReportedQty);
            if (eligibleToReportQtyForProcessType == 0) {
                break;
            }
            if (eligibleQty == 0) {
                eligibleQty = eligibleToReportQtyForProcessType;
            } else if (eligibleToReportQtyForProcessType < eligibleQty) {
                eligibleQty = eligibleToReportQtyForProcessType;
            }
        };
        jobProps.dependentJobsInfo = dependentJobGroupInfo;
        jobProps.eligibleToReportQty = eligibleQty;
        jobProps.jobNumber = jobNumber;
        jobProps.processingType = jobInfo.processType;
        return new SewingJobPropsResp(true, 0, 'Process job header properties retrieved successfully', jobProps)
    }


    /**
     * TODO: Need to get this info from the PTS
     * @param jobNumber 
     * @param unitCode 
     * @param companyCode 
     * @returns 
    */
    async getDependentJobQtyForJob(jobNumber: string, unitCode: string, companyCode: string): Promise<DependentJobGroupInfo[]> {
        const jobInfo = await this.jobWhMaterialRepo.find({ where: { jobNumber, unitCode, companyCode, isRequestNeeded: true, bomItemType: In([BomItemTypeEnum.SFG, BomItemTypeEnum.PANEL]) } });
        const allDependencies: DependentJobGroupInfo[] = [];
        for (const eachDepMaterial of jobInfo) {
            const depMatObj = new DependentJobGroupInfo(eachDepMaterial.depSubProcessName, eachDepMaterial.depProcessType, eachDepMaterial.itemCode, 0, eachDepMaterial.allocatedQty, eachDepMaterial.issuedQty);
            allDependencies.push(depMatObj);
        };
        return allDependencies;
    }


    async getJobsInfoByLocation(reqObj: IPS_C_LocationCodeRequest): Promise<IPS_R_LocationJobsResponse> {
        const { locationCode, unitCode, companyCode, iNeedBomReqStatus, iNeedJobFeatures, iNeedJobs, iNeedTrackingStatus, iNeedTrimsStatus } = reqObj;
        const locationWiseJobInfo: IPS_R_LocationJobsModel[] = [];
        const jobPlanInfo = await this.jobPlanRepo.find({ where: { locationCode: In(locationCode), unitCode, companyCode, isActive: true, status: SewingJobPlanStatusEnum.IN_PROGRESS } });
        const locationWiseJobMap = new Map<string, SJobLinePlanEntity[]>();
        for (const eachJob of jobPlanInfo) {
            if (!locationWiseJobMap.has(eachJob.locationCode)) {
                locationWiseJobMap.set(eachJob.locationCode, []);
            }
            locationWiseJobMap.get(eachJob.locationCode).push(eachJob);
        }
        for (const [locationCode, jobsInfo] of locationWiseJobMap) {
            const eachJobObj: IPS_R_JobModel[] = [];
            if (iNeedJobs) {
                for (const eachJob of jobsInfo) {
                    const jobNumber = eachJob.jobNumber;
                    const processingSerial = eachJob.processingSerial;
                    const processingType = eachJob.processType;
                    const processingJobInfo = await this.jobGroupRepo.findOne({ where: { jobNumber, unitCode, companyCode } });
                    if (!processingJobInfo) {
                        throw new ErrorResponse(0, 'Processing jobs information not found. Please check and try again');
                    }
                    const productCodeJobsMap = new Map<string, SJobPslEntity[]>();
                    const jobSubLineInfo = await this.jobPslMap.find({ where: { jobNumber, unitCode, companyCode } });
                    const subLineFeaturesMap = new Map<number, ProductSubLineFeaturesEntity>();
                    for (const eachSubLine of jobSubLineInfo) {
                        if (!subLineFeaturesMap.has(eachSubLine.moProductSubLineId)) {
                            const featuresInfo = await this.poSubLineFeatures.findOne({ where: { processingSerial, unitCode, companyCode, moProductSubLineId: eachSubLine.moProductSubLineId, isActive: true } });
                            subLineFeaturesMap.set(eachSubLine.moProductSubLineId, featuresInfo);
                        }
                        const featuresInfo = subLineFeaturesMap.get(eachSubLine.moProductSubLineId);
                        if (!productCodeJobsMap.has(featuresInfo.productCode)) {
                            productCodeJobsMap.set(featuresInfo.productCode, []);
                        }
                        productCodeJobsMap.get(featuresInfo.productCode).push(eachSubLine);
                    }
                    for (const [product, subLineInfo] of productCodeJobsMap) {
                        let qty = subLineInfo.reduce((acc, curr) => {
                            return acc + curr.quantity;
                        }, 0);
                        let jobFeatures: SPS_R_JobFeaturesModel = null;
                        const colorSizeQty: SPS_R_JobColorSizeModel[] = [];
                        let trimsStatus: IPS_R_JobTrimStatusModel = null;
                        let depBomStatus: IPS_R_JobTrimStatusModel = null;
                        const depBomItemStatus: IPS_R_JobDepBomItemStatusModel[] = [];
                        const trackingStatus: IPS_R_JobTrackingStatusModel[] = [];
                        const style = new Set<string>();
                        const color = new Set<string>();
                        const delDate = new Set<string>();
                        const vpo = new Set<string>();
                        const soNo = new Set<string>();
                        const destination = new Set<string>();
                        const soLineNo = new Set<string>();
                        const buyer = new Set<string>();
                        const colorSizeQtyMap = new Map<string, Map<string, number>>();
                        for (const eachSubLine of subLineInfo) {
                            const subLineInfoForSubLine = subLineFeaturesMap.get(eachSubLine.moProductSubLineId)
                            if (!colorSizeQtyMap.has(subLineInfoForSubLine.fgColor)) {
                                colorSizeQtyMap.set(subLineInfoForSubLine.fgColor, new Map<string, number>());
                            }
                            if (!colorSizeQtyMap.get(subLineInfoForSubLine.fgColor).has(subLineInfoForSubLine.size)) {
                                colorSizeQtyMap.get(subLineInfoForSubLine.fgColor).set(subLineInfoForSubLine.size, 0);
                            }
                            const preQty = colorSizeQtyMap.get(subLineInfoForSubLine.fgColor).get(subLineInfoForSubLine.size);
                            colorSizeQtyMap.get(subLineInfoForSubLine.fgColor).set(subLineInfoForSubLine.size, preQty + eachSubLine.quantity);
                            const featuresInfo = subLineFeaturesMap.get(eachSubLine.moProductSubLineId);
                            if (iNeedJobFeatures) {
                                style.add(featuresInfo.styleCode);
                                color.add(featuresInfo.fgColor);
                                delDate.add(featuresInfo.deliveryDate);
                                vpo.add(featuresInfo.coNumber);
                                soNo.add(featuresInfo.soNumber);
                                destination.add(featuresInfo.destination);
                                soLineNo.add(featuresInfo.soLineNumber);
                                buyer.add(featuresInfo.customerCode);
                            }
                        }
                        if (iNeedJobFeatures) {
                            const featuresInfo = new SPS_R_JobFeaturesModel(Array.from(style).toString(), Array.from(color), Array.from(delDate), Array.from(vpo), Array.from(soNo), Array.from(destination), Array.from(soLineNo), Array.from(buyer));
                            jobFeatures = featuresInfo;
                        }
                        if (iNeedBomReqStatus) {
                            const trimsInfoForJob = await this.jobWhMaterialRepo.find({ where: { jobNumber, processingSerial, processType: processingType, unitCode, companyCode, isActive: true, isRequestNeeded: true, bomItemType: BomItemTypeEnum.SFG } });
                            for (const eachSubProcess of trimsInfoForJob) {
                                const planInfo = jobPlanInfo.find(job => job.jobNumber == jobNumber);
                                const depSubProcessInfo = new IPS_R_JobDepBomItemStatusModel(eachSubProcess.depProcessType, planInfo.itemSkuStatus, eachSubProcess.allocatedQty, eachSubProcess.issuedQty, null, null);
                                depBomItemStatus.push(depSubProcessInfo);
                            }
                        }
                        if (iNeedTrackingStatus) {
                            const jobOpInfo = await this.jobOperationsRepo.find({ where: { jobNumber, unitCode, companyCode } });
                            for (const eachOp of jobOpInfo) {
                                const tackInfo = new IPS_R_JobTrackingStatusModel(eachOp.operationGroup, eachOp.goodQty, eachOp.rejectionQty);
                                trackingStatus.push(tackInfo);
                            }
                        }
                        if (iNeedTrimsStatus) {
                            const materialReqDetails = await this.phWhReqLineRepo.findOne({ where: { jobNumber, processingSerial, processType: processingType, unitCode, companyCode, bomItemType: BomItemTypeEnum.RM }, order: { 'createdAt': 'ASC', } });
                            const planInfo = jobPlanInfo.find(job => job.jobNumber == jobNumber);
                            if (materialReqDetails) {
                                const issuanceData = await this.poWhJobMaterialIssuanceHistoryRepository.findOne({ where: { unitCode: reqObj.unitCode, companyCode: reqObj.companyCode, whReqId: materialReqDetails.id, jobNumber }, order: { createdAt: 'DESC' } });
                                trimsStatus = new IPS_R_JobTrimStatusModel(moment(materialReqDetails.createdAt).format('YYYY-MM-DD'), issuanceData ? moment(issuanceData.createdAt).format('YYYY-MM-DD') : null, planInfo.rawMaterialStatus);
                            } else {
                                trimsStatus = new IPS_R_JobTrimStatusModel(null, null, planInfo.rawMaterialStatus);
                            };


                            const materialReqDetailsForItem = await this.phWhReqLineRepo.findOne({ where: { jobNumber, processingSerial, processType: processingType, unitCode, companyCode, bomItemType: In([BomItemTypeEnum.PANEL, BomItemTypeEnum.SFG]) }, order: { 'createdAt': 'ASC', } });
                            const planInfoForItem = jobPlanInfo.find(job => job.jobNumber == jobNumber);
                            if (materialReqDetailsForItem) {
                                const issuanceData = await this.poWhJobMaterialIssuanceHistoryRepository.findOne({ where: { unitCode: reqObj.unitCode, companyCode: reqObj.companyCode, whReqId: materialReqDetailsForItem.id, jobNumber }, order: { createdAt: 'DESC' } });
                                depBomStatus = new IPS_R_JobTrimStatusModel(moment(materialReqDetailsForItem.createdAt).format('YYYY-MM-DD'), issuanceData ? moment(issuanceData.createdAt).format('YYYY-MM-DD') : null, planInfoForItem.itemSkuStatus);
                            } else {
                                depBomStatus = new IPS_R_JobTrimStatusModel(null, null, planInfo.itemSkuStatus);
                            }
                        }
                        for (const [color, sizeDetail] of colorSizeQtyMap) {
                            for (const [size, qty] of sizeDetail) {
                                const sizeColorObj = new SPS_R_JobColorSizeModel(color, size, qty, []);
                                colorSizeQty.push(sizeColorObj);
                            }
                        }
                        const statusGetReq = new SPS_C_ProcJobNumberRequest(null, unitCode, companyCode, null, eachJob.jobNumber, false, false, false, false, false, false)
                        const statusObj = await this.getJobDetailsForInputDashboard(statusGetReq);
                        const jobObj = new IPS_R_JobModel(eachJob.jobNumber, eachJob.processType, eachJob.processingSerial, product, qty, colorSizeQty, jobFeatures, trimsStatus, depBomItemStatus, trackingStatus, statusObj, depBomStatus);
                        eachJobObj.push(jobObj);
                    }

                }
            }
            const locationJobObj = new IPS_R_LocationJobsModel(locationCode, jobsInfo.length, eachJobObj);
            locationWiseJobInfo.push(locationJobObj);
        }
        return new IPS_R_LocationJobsResponse(true, 0, 'RM inprogress jobs retrieved successfully', locationWiseJobInfo);

    }


    /**
     * Service to get job details for input dashboard
     * @param req 
     * @returns 
    */
    async getJobDetailsForInputDashboard(req: SPS_C_ProcJobNumberRequest): Promise<IPS_R_JobStatusModel> {
        const jobPropsAndInfo = await this.getSewingJobQtyAndPropsInfoByJobNumber(req.jobNumber, req.unitCode, req.companyCode);
        if (!jobPropsAndInfo.status) {
            throw new ErrorResponse(jobPropsAndInfo.errorCode, jobPropsAndInfo.internalMessage)
        };
        const jobProps = jobPropsAndInfo.data;
        const jobLinePlanObj = await this.jobPlanRepo.findOne({ where: { jobNumber: req.jobNumber, unitCode: req.unitCode, companyCode: req.companyCode } });
        let status: string;
        let shape: string;
        let color: string;
        const actMaterialStatus = this.getMinimumTrimStatus(jobLinePlanObj.rawMaterialStatus, jobLinePlanObj.itemSkuStatus);
        if (actMaterialStatus == TrimStatusEnum.OPEN) {
            status = "RM Not Requested";
            shape = "circle";
            color = "gray";
        } else if (actMaterialStatus == TrimStatusEnum.REQUESTED) {
            status = "RM Requested & Waiting For RM";
            shape = "circle";
            color = "green";
        } else if (actMaterialStatus == TrimStatusEnum.PARTIALLY_ISSUED) {
            status = "RM Partially Issued";
            shape = "circle";
            color = "orange";
        } else {
            if (jobProps.pendingToInputQty < 0 || jobProps.eligibleToReportQty < 0) {
                shape = "triangle";
                status = "Invalid Quantity Values";
                color = "red";
            }
            // else if (jobProps.pendingToInputQty > 0 && jobProps.eligibleToReportQty > 0) {
            //     if (jobProps.eligibleToReportQty < jobProps.pendingToInputQty) {
            //         shape = "square";
            //         status = "Partially Eligible To Give Input To Line";
            //         color = "orange";
            //     } else {
            //         shape = "square";
            //         status = "Fully Eligible To Give Input To Line";
            //         color = "green";
            //     }
            // }
            // else if (jobProps.pendingToInputQty > 0 && jobProps.eligibleToReportQty == 0) {
            //     status = "No Eligible Qty To Give Input To Line";
            //     shape = "square";
            //     color = "gray";
            // }
            else if (jobProps.pendingToInputQty > 0) {
                status = "Input To Line";
                shape = "square";
                color = "gray";
            }
            else if (jobProps.pendingToInputQty == 0) {
                shape = "square";
                status = "Input Fully Reported AND WIP";
                color = "green";
            }
        }
        return new IPS_R_JobStatusModel(status, shape, color, jobProps.wip);
    }

    getMinimumTrimStatus(status1: TrimStatusEnum, status2: TrimStatusEnum): TrimStatusEnum {
        const priorityOrder: TrimStatusEnum[] = [
            TrimStatusEnum.OPEN,
            TrimStatusEnum.REQUESTED,
            TrimStatusEnum.PARTIALLY_ISSUED,
            TrimStatusEnum.ISSUED,
            TrimStatusEnum.NR
        ];
        for (const status of priorityOrder) {
            if (status1 === status || status2 === status) {
                return status;
            }
        }
        // Fallback - should only reach here if both are NR
        return TrimStatusEnum.NR;
    }


    /**
     * TODO: Need to get this info from the PTS
     * @param jobNumber 
     * @param unitCode 
     * @param companyCode 
     * @returns 
    */
    async getDependentJobQtyForJobForAll(jobNumber: string, unitCode: string, companyCode: string): Promise<DependentJobGroupInfo[]> {
        const jobInfo = await this.jobWhMaterialRepo.find({ where: { jobNumber, unitCode, companyCode, bomItemType: In([BomItemTypeEnum.SFG, BomItemTypeEnum.PANEL]) } });
        const allDependencies: DependentJobGroupInfo[] = [];
        for (const eachDepMaterial of jobInfo) {
            const depMatObj = new DependentJobGroupInfo(eachDepMaterial.depSubProcessName, eachDepMaterial.depProcessType, eachDepMaterial.itemCode, 0, eachDepMaterial.allocatedQty, eachDepMaterial.issuedQty);
            allDependencies.push(depMatObj);
        };
        return allDependencies;
    }
}


