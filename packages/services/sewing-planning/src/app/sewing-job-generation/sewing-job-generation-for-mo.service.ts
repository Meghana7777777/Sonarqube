import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SJobHeaderRepo } from '../entities/repository/s-job-header.repository';
import { SJobSubLineRepo } from '../entities/repository/s-job-sub-line.repository';
import { CGDetails, ColorSizeCompModel, CompWiseBundleInfo, ConsumedBundleInfoRequest, CutBundleInfoModel, CutBundleInfoResponse, CutDetails, CutEligibilityInfoResp, CutInfo, DeleteSewingJobsRequest, DependentJobGroupInfo, DocBundleInfoForFgsResp, DocketBundleInfo, DocketBundleWiseCutReportInfo, DocketDetails, EligibleFgNumbersForSewJob, FeatureGroupCutDetailsResp, FeatureGroupDetails, FgColorSizeCompRequest, FgFindingOptions, GetReportedBundleReqModel, GlobalResponseObject, GroupedSewingJobFeatureResult, IPlannningJobModel, IPlannningJobModelResponse, JobDetailQueryResponse, JobGroupVersionInfoForSewSerial, JobGroupVersionInfoResp, JobLine, JobNumberRequest, JobOpUpdateRequest, JobSewSerialReq, jobStatusTypeModel, JobWithDocBundlesResp, MinEligibleCompPanelsResp, MOSewOrderQtyModel, ProcessTypeEnum, PanelReqForJobInfoResp, PanelReqForJobModel, PanelRequestCreationModel, PtsBankElgResponse, PtsBankRequestBundleTrackModel, PtsBankRequestCreateRequest, PtsBankRequestDepJobModel, PtsBankRequestMainJobModel, PtsBundelInfoBasicModel, PtsJobNumberDepJgRequest, SewingCreationOptionsEnum, SewingIJobNoRequest, SewingJobBarcodeInfoResp, SewingJobBatchDetails, SewingJobBatchInfoResp, SewingJobConfirmedReqInfoForActualGenFeatureGroup, SewingJobFeatureGroupReq as SewingJobFeatureGroupReq, SewingJobInfoModel, SewingJobLineInfo, SewingJobOperationLineInfo, SewingJobOperationWiseSummaryModel, SewingJobOperationWiseSummaryResponse, SewingJobPlanStatusEnum, SewingJobPreviewForActualGenFeatureGroup, SewingJobPreviewHeaderInfo, SewingJobPreviewModelResp, SewingJobPropsModel, SewingJobPropsResp, SewingJobSizeWiseSummaryModel, SewingJobSizeWiseSummaryResponse, SewingJobSummaryFeatureGroupForMo, SewingJobSummaryForSewingOrder, SewingJobSummaryForSewOrderResp, SewingJobWisePreviewModel, SewingOrderDetailsForGivenFeatureGroup, SewingOrderIdRequest, SewingOrderLineInfo, SewingOrderReq, SewJobGenReqForActualAndFeatureGroup, SewJobGenReqForBgMOAndFeatureGroup, SewJobPreviewForFeatureGroupResp, SewJobSummaryForFeatureGroupResp, SewJoGenRefTypeEnum, SewOrderDetailForFeatureGroupResponse, SewSerialBundleGroupReq, SewSerialDepGroupReq, SewSerialFgNumberReq, SewSerialRequest, SizeQtyDetails, SubLine, SummaryOperationQtyDetails, SummaryQtyDetails, TrackingEntityEnum, TransactionIdFgNumbersReq, TransactionLockStatusEnum, TrimStatusEnum } from '@xpparel/shared-models';
import { CutReportingService, DocketGenerationServices, FgBankService, FgCreationService, FgReportingService } from '@xpparel/shared-services';
import { ErrorResponse } from '@xpparel/backend-utils';
import { SJobHeaderEntity } from '../entities/s-job-header.entity';
import { GenericTransactionManager } from '../../database/typeorm-transactions';
import { DataSource, In } from 'typeorm';
import { SJobLineEntity } from '../entities/s-job-line.entity';
import { SJobLineOperationsEntity } from '../entities/s-job-line-operations';
import { SJobLinePlanEntity } from '../entities/s-job-line-plan';
import { SJobBundleEntity } from '../entities/s-job-bundle.entity';
import { SJobPreferences } from '../entities/s-job-preferences.entity';
import { SJobPreferencesRepo } from '../entities/repository/s-job-preference.repository';
import { SJobLineOperationsRepo } from '../entities/repository/s-job-line-operations';
import { SJobLinePlanRepo } from '../entities/repository/s-job-line-plan.repository';
import moment from 'moment';
import { SJobPreviewLog } from '../entities/s-job-preview-log.entity';
import { SJobLineOperationsHistoryEntity } from '../entities/s-job-line-operations-history';
import { SJobLineOperationsHistoryRepo } from '../entities/repository/s-job-line-operations-history.repo';
const util = require('util');
@Injectable()
export class SewingJobGenerationServiceForMO {
    constructor(
        private dataSource: DataSource,
        private jobHeaderRepo: SJobHeaderRepo,
        private jobBundleRepo: SJobSubLineRepo,
        private jobPreferencesRepository: SJobPreferencesRepo,
        private jobOperationsRepo: SJobLineOperationsRepo,
        private jobPlanRepo: SJobLinePlanRepo,
        private sJobSubLineRepo: SJobSubLineRepo,
        private sjobLineOperationsRepo: SJobLineOperationsRepo,
        private sJobLinePlanRepo: SJobLinePlanRepo,
        private docGenService: DocketGenerationServices,
        private fgBankService: FgBankService,
        private fgReportingService: FgReportingService,
        private fgCreationService: FgCreationService,
        private sJobLineOperationsHistoryRepo: SJobLineOperationsHistoryRepo,
    ) {

    }

    /**
     * END POINT:  Service to get sewing job summary details for the given sewing order
     * @param reqModel 
     * @returns 
    */
    // async getSewingJobSummaryForSewingOrderAndBundleGroup(reqModel: SewSerialBundleGroupReq, oslRefIds?: number[]): Promise<SewingJobSummaryForSewOrderResp> {
    //     const { sewSerial, unitCode, companyCode } = reqModel;
    //     const sewingOrderInfo = await this.sewOrderRepo.findOne({ select: ['id', 'desc', 'orderRefNo', 'sewSerial'], where: { sewSerial: sewSerial, unitCode, companyCode, isActive: true } });
    //     if (!sewingOrderInfo) {
    //         throw new ErrorResponse(26140, `Sewing Order details not found for the given id please check and try again sew Serial: ${sewSerial}`)
    //     }
    //     const sewingOrderLineInfoObj: SewingOrderLineInfo[] = [];
    //     const sewingOrderLineInfo = await this.sewOrderLineRepo.find({ where: { sOrderId: sewingOrderInfo.id, unitCode, companyCode, isActive: true }, select: ['id', 'orderLineRefNo', 'productType', 'productName'] });
    //     for (const eachSewingOrderLine of sewingOrderLineInfo) {
    //         const colorSizeQtyInfo = new Map<string, Map<string, number>>();
    //         const colorSizeOrderSubInfo = new Map<string, Map<string, number[]>>();
    //         const sewingOrderSubLineInfoObj: SizeQtyDetails[] = [];
    //         const sewingOrderSubLineInfo = await this.sewOrderSubLineRepo.find({ where: { sOrderLineGroupId: eachSewingOrderLine.id, unitCode, companyCode } });
    //         let fgColor = '';
    //         for (const eachSubLine of sewingOrderSubLineInfo) {
    //             if (oslRefIds) {
    //                 if (!oslRefIds.includes(eachSubLine.oslRefId)) {
    //                     continue;
    //                 }
    //             }
    //             const subLineProps = await this.subLineProps.findOne({ where: { sewSerial, oslRefId: eachSubLine.oslRefId, unitCode, companyCode } });
    //             fgColor = subLineProps.fgColor;
    //             if (!colorSizeQtyInfo.has(subLineProps.fgColor)) {
    //                 colorSizeQtyInfo.set(subLineProps.fgColor, new Map<string, number>());
    //                 colorSizeOrderSubInfo.set(subLineProps.fgColor, new Map<string, number[]>());
    //             }
    //             if (!colorSizeQtyInfo.get(subLineProps.fgColor).has(subLineProps.size)) {
    //                 colorSizeQtyInfo.get(subLineProps.fgColor).set(subLineProps.size, 0);
    //                 colorSizeOrderSubInfo.get(subLineProps.fgColor).set(subLineProps.size, []);
    //             }
    //             const preQty = colorSizeQtyInfo.get(subLineProps.fgColor).get(subLineProps.size);
    //             colorSizeQtyInfo.get(subLineProps.fgColor).set(subLineProps.size, preQty + eachSubLine.quantity);
    //             colorSizeOrderSubInfo.get(subLineProps.fgColor).get(subLineProps.size).push(eachSubLine.id);
    //         }
    //         for (const [fgColor, sizeQtyDetails] of colorSizeQtyInfo) {
    //             for (const [size, qtyDetails] of sizeQtyDetails) {
    //                 const subLineIds = colorSizeOrderSubInfo.get(fgColor).get(size);
    //                 const sewGeneratedQty = await this.sewFgRepo.getSewGeneratedQtyBySubLineIdsAndBundleGroup(subLineIds, unitCode, companyCode, reqModel.bundleGroup);
    //                 const sizeQtyObj = new SizeQtyDetails(size, qtyDetails, sewGeneratedQty, (qtyDetails - sewGeneratedQty), [], []);
    //                 sewingOrderSubLineInfoObj.push(sizeQtyObj);
    //             }
    //         }
    //         const lineInfoObj = new SewingOrderLineInfo(eachSewingOrderLine.id, eachSewingOrderLine.orderLineRefNo, eachSewingOrderLine.productType, eachSewingOrderLine.productName, fgColor, sewingOrderSubLineInfoObj);
    //         if (lineInfoObj.sizeQtyDetails.length) {
    //             sewingOrderLineInfoObj.push(lineInfoObj);
    //         }
    //     }
    //     const sewingOrderInfoObj = new SewingJobSummaryForSewingOrder(sewingOrderInfo.id, sewingOrderInfo.desc, sewingOrderInfo.orderRefNo, sewingOrderInfo.sewSerial, sewingOrderLineInfoObj);
    //     return new SewingJobSummaryForSewOrderResp(true, 26049, 'Sewing order info retrieved successfully', sewingOrderInfoObj);

    // }

    /**
     * END POINT: Service to get sewing job summary details for the given sewing order and given feature detauks
     * @param reqModel 
     * @returns 
    */
    // async getSewingJobSummaryForSewingOrderAndBundleGroupAndFeatures(reqModel: SewingJobFeatureGroupReq): Promise<SewJobSummaryForFeatureGroupResp> {
    //     const { sewSerial, unitCode, companyCode } = reqModel;
    //     const sewingOrderInfo = await this.sewOrderRepo.findOne({ select: ['id', 'desc', 'orderRefNo', 'sewSerial'], where: { sewSerial: sewSerial, unitCode, companyCode, isActive: true } });
    //     if (!sewingOrderInfo) {
    //         throw new ErrorResponse(26140, `Sewing Order details not found for the given id please check and try again sew Serial: ${sewSerial}`)
    //     }
    //     const sewingOrderInfoObj: SewingJobSummaryFeatureGroupForMo[] = [];
    //     const groupedOptionsInfo = await this.sewFgRepo.getGroupedSewingJobFeatures(reqModel);
    //     const promises = groupedOptionsInfo.map(async (eachGroupOptions) => {
    //         const oslRefIds = eachGroupOptions.osl_ref_id.split(',').map(res => Number(res));
    //         const summaryInfo = (await this.getSewingJobSummaryForSewingOrderAndBundleGroup(reqModel, oslRefIds))?.data;
    //         return new SewingJobSummaryFeatureGroupForMo(sewingOrderInfo.id, summaryInfo, eachGroupOptions);
    //     });
    //     const results = await Promise.all(promises); // Execute all promises concurrently
    //     for (const eachDocBundleInfoForFeature of results) {
    //         sewingOrderInfoObj.push(eachDocBundleInfoForFeature);
    //     }
    //     return new SewJobSummaryForFeatureGroupResp(true, 26049, 'Sewing order info retrieved successfully', sewingOrderInfoObj);
    // }

    /**
     * ENDPOINT: Service to get sewing jobs preview for the bundle group and feature group by selecting job quantity and logical bundle quantity
     * @param reqModel 
     * @returns 
    */
    // async getSewingJobsPreviewForBGAndFeatureGroup(reqModel: SewJobGenReqForBgMOAndFeatureGroup): Promise<SewingJobPreviewModelResp> {
    //     const { sewingOrderId, unitCode, companyCode } = reqModel;
    //     const sewingOrderInfo = await this.sewOrderRepo.findOne({ select: ['id', 'desc', 'orderRefNo', 'sewSerial', 'desc'], where: { id: sewingOrderId, unitCode, companyCode, isActive: true } });
    //     if (!sewingOrderInfo) {
    //         throw new ErrorResponse(26052, `Sewing Order details not found for the given id please check and try again sewSerial: ${sewingOrderId}`);
    //     }
    //     if (reqModel.sewingJobQty < reqModel.logicalBundleQty) {
    //         throw new ErrorResponse(26037, 'Sewing job quantity should be more than logical bundle qty')
    //     }
    //     const sewSerial = sewingOrderInfo.sewSerial;
    //     const moDetailsForFeatureGroup = await this.sewOrderSubLineRepo.getEligibleQtyForSewJobByFeatures(reqModel.groupInfo, unitCode, companyCode, sewSerial);
    //     const virtualJobs = this.distributeJobs(moDetailsForFeatureGroup, reqModel.sewingJobQty, reqModel.multiColor, reqModel.multiSize);
    //     const jobsPreview = await this.getSewingJobPreviewForVirtualJobs(virtualJobs, unitCode, companyCode, reqModel.bundleGroup, sewSerial, reqModel.logicalBundleQty);
    //     jobsPreview.sewOrderDesc = sewingOrderInfo.desc;
    //     jobsPreview.multiColor = reqModel.multiColor;
    //     jobsPreview.multiSize = reqModel.multiSize;
    //     jobsPreview.logicalBundleQty = reqModel.logicalBundleQty;
    //     return new SewingJobPreviewModelResp(true, 26038, 'Jobs Preview For the Bundle Group and features Retrieved successfully', jobsPreview)
    // }

    /**
     * HELPER: Function to distribute orders into jobs with job numbers, grouping by multiColor and multiSize
     * @param {MOSewOrderQtyModel[]} orders - Array of MOSewOrderQtyModel objects
     * @param {number} jobQuantity - The maximum quantity per job
     * @param {boolean} multiColor - Whether a job can include multiple colors
     * @param {boolean} multiSize - Whether a job can include multiple sizes
     * @returns {Array} - Array of jobs, each with a jobNumber and associated MO info
     */
    distributeJobs(orders: MOSewOrderQtyModel[], jobQuantity: number, multiColor: boolean, multiSize: boolean) {
        const jobs: {
            jobNumber: number;
            bundles: MOSewOrderQtyModel[]
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
        Object.values(groupedOrders).forEach(group => {
            let groupRemainingQuantity = group.reduce((prev, curr) => prev + Number(curr.quantity), 0);

            while (groupRemainingQuantity > 0) {
                let remainingJobQuantity = jobQuantity; // Reset job capacity for each new job

                group.forEach(order => {
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
                            oslRefId: order.oslRefId,
                            productType: order.productType,
                            productName: order.productName,
                            fgColor: order.fgColor,
                            size: order.size,
                            quantity: bundleQuantity,
                            fgNumbers: [] // Always an empty array
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
    // async getSewingJobPreviewForVirtualJobs(moWiseJobInfo: { jobNumber: number; bundles: MOSewOrderQtyModel[] }[], unitCode: string, companyCode: string, bundleGroup: number, sewSerial: number, logicalBundleQty: number) {
    //     const refProductName = moWiseJobInfo[0].bundles[0].productName;
    //     const bundleGroupInfo = await this.sewOpsInfo.getProcessTypeAndGroupInfoByBundleGroup(sewSerial, refProductName, unitCode, companyCode, bundleGroup);
    //     let totalJobQty = 0;
    //     let totalBundleCount = 0;
    //     const operations = [];
    //     bundleGroupInfo.jobGroupInfo.forEach((jg) => {
    //         operations.push(...jg.operations);
    //     });
    //     const jobWisePreviewModel: SewingJobWisePreviewModel[] = [];
    //     for (const eachJob of moWiseJobInfo) {
    //         const oslRefIds = eachJob.bundles.map(mo => mo.oslRefId);
    //         const moFeatures = await this.subLineProps.getMoPropertiesByOslRefIds(oslRefIds, unitCode, companyCode, sewSerial);
    //         const totalQty = eachJob.bundles.reduce((pre, curr) => {
    //             return pre + Number(curr.quantity);
    //         }, 0);
    //         totalJobQty += totalQty;
    //         const noOfBundles = Math.round(totalQty / logicalBundleQty);
    //         totalBundleCount += noOfBundles;

    //         const jobWisePreview = new SewingJobWisePreviewModel(`J-${eachJob.jobNumber}`, noOfBundles, totalQty, moFeatures);
    //         jobWisePreviewModel.push(jobWisePreview);
    //     }
    //     const previewInfo = new SewingJobPreviewHeaderInfo(bundleGroupInfo.processingType, moWiseJobInfo.length, totalJobQty, totalBundleCount, bundleGroupInfo.jobGroupInfo.length, operations, sewSerial, null, null, null, jobWisePreviewModel, 0);
    //     return previewInfo;
    // }

    /**
     * END POINT -> Once user confirms the sewing jobs this will be called
     * @param reqModel 
     * @returns 
    */
    // async generateSewingJobsForBGAndFeatureGroup(reqModel: SewJobGenReqForBgMOAndFeatureGroup): Promise<GlobalResponseObject> {
    //     const transManager = new GenericTransactionManager(this.dataSource);
    //     try {
    //         const { sewingOrderId, unitCode, companyCode, logicalBundleQty, userId, username } = reqModel;
    //         const sewingOrderInfo = await this.sewOrderRepo.findOne({ select: ['id', 'desc', 'orderRefNo', 'sewSerial'], where: { id: sewingOrderId, unitCode, companyCode, isActive: true } });
    //         if (!sewingOrderInfo) {
    //             throw new ErrorResponse(26052, `Sewing Order details not found for the given id please check and try again sewSerial: ${sewingOrderId}`);
    //         }
    //         const sewSerial = sewingOrderInfo.sewSerial;
    //         // TODO: need to get last header no for sew serial and add
    //         // TODO: need to get the job groups info for the sew order serial, product type and product name 
    //         const sewSerialReq = new SewSerialBundleGroupReq(username, unitCode, companyCode, userId, sewSerial, reqModel.bundleGroup);
    //         const sewSerialOpsInfoResp: JobGroupVersionInfoResp = await this.sewOpsInfo.getJobGroupVersionInfoForBundleGroup(sewSerialReq);
    //         if (!sewSerialOpsInfoResp.status || !sewSerialOpsInfoResp.data.length) {
    //             throw new ErrorResponse(sewSerialOpsInfoResp.errorCode, sewSerialOpsInfoResp.internalMessage)
    //         }
    //         const sewSerialOpsInfo = sewSerialOpsInfoResp.data[0];
    //         let jobHeaderStartNo = 1;
    //         const moDetailsForFeatureGroup = await this.sewOrderSubLineRepo.getEligibleQtyForSewJobByFeatures(reqModel.groupInfo, unitCode, companyCode, sewSerial);
    //         const virtualJobs = this.distributeJobs(moDetailsForFeatureGroup, reqModel.sewingJobQty, reqModel.multiColor, reqModel.multiSize);

    //         // Need to keep this in case the requirement is for MO
    //         // const moWiseFilledFgNumbers = await this.jobFg.getMoWiseFilledFgNumbersForSewJobGen(sewSerial, unitCode, companyCode, reqModel.bundleGroup, reqModel.groupInfo);
    //         // const moWiseFgNumbersToFill = new Map<string, number[]>();
    //         // for (const eachMoFilledFgs of moWiseFilledFgNumbers) {
    //         //     if (!moWiseFgNumbersToFill.has(eachMoFilledFgs.moNumber)) {
    //         //         const eligibleFgs = await this.sewFgRepo.getEligibleFgNumbersForSewJobGenForMo(eachMoFilledFgs.moNumber, sewSerial, unitCode, companyCode, reqModel.bundleGroup, reqModel.groupInfo, eachMoFilledFgs.fgNumbers);
    //         //         moWiseFgNumbersToFill.set(eachMoFilledFgs.moNumber, eligibleFgs);
    //         //     }
    //         // }
    //         // const moWiseJobQty = new Map<string, number>();
    //         // for (const eachSewJob of virtualJobs) {
    //         //     for (const eachMoBundle of eachSewJob.moWiseInfo) {
    //         //         if (!moWiseJobQty.has(eachMoBundle.moNumber)) {
    //         //             moWiseJobQty.set(eachMoBundle.moNumber, 0);
    //         //         }
    //         //         const preQty = moWiseJobQty.get(eachMoBundle.moNumber);
    //         //         moWiseJobQty.set(eachMoBundle.moNumber, preQty + Number(eachMoBundle.quantity));
    //         //     }
    //         // }
    //         // for (const [mo, eachJobMoQty] of moWiseJobQty) {
    //         //     const eligibleFgs = moWiseFgNumbersToFill.get(mo);
    //         //     if (!eligibleFgs || (eligibleFgs.length < eachJobMoQty)) {
    //         //         throw new ErrorResponse(0, 'Eligible Fgs not found for the given Mo' + mo);
    //         //     }
    //         // }
    //         const allOslRefIds = [];
    //         for (const eachSewJob of virtualJobs) {
    //             for (const eachMoBundle of eachSewJob.bundles) {
    //                 allOslRefIds.push(eachMoBundle.oslRefId)
    //             }
    //         }
    //         const eligibleFgs = await this.sewFgRepo.getEligibleFgNumbersForSewJobGenForOslRefIds(sewSerial, unitCode, companyCode, allOslRefIds);
    //         for (const eachSewJob of virtualJobs) {
    //             const oslRefIdsForJob = [];
    //             let totalQty = 0;
    //             for (const eachMoBundle of eachSewJob.bundles) {
    //                 oslRefIdsForJob.push(eachMoBundle.oslRefId);
    //                 totalQty += eachMoBundle.quantity;
    //             }

    //             for (const eachMoBundle of eachSewJob.bundles) {
    //                 const respectiveFgs = eligibleFgs.find(fg => fg.oslRefId == eachMoBundle.oslRefId);
    //                 if (!respectiveFgs || (respectiveFgs.fgNumbers.length < eachMoBundle.quantity)) {
    //                     throw new ErrorResponse(26039, 'Fgs not found for the OSL REF Id ' + eachMoBundle.oslRefId);
    //                 }
    //                 eachMoBundle.fgNumbers = respectiveFgs.fgNumbers.splice(0, eachMoBundle.quantity);
    //             }
    //         }
    //         // console.log(util.inspect(virtualJobs, false, null, true));
    //         await transManager.startTransaction();
    //         const jobPreferObj = new SJobPreferences();
    //         jobPreferObj.companyCode = companyCode;
    //         jobPreferObj.createdUser = reqModel.username;
    //         jobPreferObj.groupInfo = JSON.stringify(reqModel.groupInfo);
    //         jobPreferObj.logicalBundleQty = reqModel.logicalBundleQty;
    //         jobPreferObj.multiColor = reqModel.multiColor;
    //         jobPreferObj.multiSize = reqModel.multiSize;
    //         jobPreferObj.sOrderId = reqModel.sewingOrderId;
    //         jobPreferObj.sewSerial = sewSerial;
    //         jobPreferObj.unitCode = reqModel.unitCode;
    //         jobPreferObj.companyCode = reqModel.companyCode;
    //         jobPreferObj.sewingJobQty = reqModel.sewingJobQty;
    //         const jobPrefEntity = await transManager.getRepository(SJobPreferences).save(jobPreferObj);
    //         const sewingJobs = new Set<string>();
    //         for (const eachSewJob of virtualJobs) {
    //             let subBundleNumber = 1;
    //             const planProdDate = new Set<string>();
    //             // Job bundle detail saving part
    //             // Splitting logical bundles and assigning Fgs to bundles
    //             // Its same for all the job groups
    //             const logicalBundles: SJobSubLineEntity[] = [];
    //             const bundleWiseFgInfo = new Map<string, SJobFgEntity[]>();
    //             eachSewJob.bundles.forEach((moInfo: MOSewOrderQtyModel) => {
    //                 let remainingQty = moInfo.quantity;
    //                 let runningNum = 0;
    //                 while (remainingQty > 0) {
    //                     const splitQty = Math.min(logicalBundleQty, remainingQty);
    //                     // Need to construct the logical bundles here
    //                     const sewBundleRef = `${subBundleNumber}`;
    //                     const jobSubLineObj = new SJobSubLineEntity();
    //                     jobSubLineObj.companyCode = companyCode;
    //                     jobSubLineObj.color = moInfo.fgColor;
    //                     jobSubLineObj.createdUser = reqModel.username;
    //                     jobSubLineObj.qty = splitQty;
    //                     jobSubLineObj.sJobLineId = null;
    //                     jobSubLineObj.size = moInfo.size;
    //                     jobSubLineObj.unitCode = unitCode;
    //                     jobSubLineObj.productName = moInfo.productName;
    //                     jobSubLineObj.productType = moInfo.productType;
    //                     jobSubLineObj.bundleNumber = sewBundleRef;
    //                     remainingQty -= splitQty;
    //                     logicalBundles.push(jobSubLineObj);
    //                     for (let i = 0; i < splitQty; i++) {
    //                         const sFgObj = new SJobFgEntity();
    //                         sFgObj.bundleNo = sewBundleRef;
    //                         sFgObj.companyCode = companyCode;
    //                         sFgObj.createdUser = reqModel.username;
    //                         sFgObj.jobNo = null;
    //                         sFgObj.sJobSubLineId = null;
    //                         sFgObj.sewFgNumber = moInfo.fgNumbers[runningNum];
    //                         sFgObj.fgNumber = moInfo.fgNumbers[runningNum];
    //                         ++runningNum;
    //                         sFgObj.sewSerial = sewSerial;
    //                         sFgObj.trackingEntityType = TrackingEntityEnum.PLANNED;
    //                         sFgObj.unitCode = unitCode;
    //                         sFgObj.oslRefId = moInfo.oslRefId;
    //                         if (!bundleWiseFgInfo.has(sewBundleRef)) {
    //                             bundleWiseFgInfo.set(sewBundleRef, []);
    //                         }
    //                         bundleWiseFgInfo.get(sewBundleRef).push(sFgObj);
    //                     }
    //                     subBundleNumber++;
    //                 }
    //             });
    //             const jobHeaderInfo = new SJobHeaderEntity();
    //             jobHeaderInfo.companyCode = companyCode;
    //             jobHeaderInfo.createdUser = reqModel.username;
    //             jobHeaderInfo.jobHeaderNo = jobHeaderStartNo++;
    //             jobHeaderInfo.refId = `${sewSerial}-${reqModel.bundleGroup}`;
    //             jobHeaderInfo.refType = SewJoGenRefTypeEnum.CUT;
    //             jobHeaderInfo.sOrderId = sewingOrderId;
    //             jobHeaderInfo.sewSerial = sewSerial;
    //             jobHeaderInfo.unitCode = unitCode;
    //             jobHeaderInfo.jobPrefId = jobPrefEntity.id;
    //             const jobHeaderEntity = await transManager.getRepository(SJobHeaderEntity).save(jobHeaderInfo);
    //             await transManager.getRepository(SJobHeaderEntity).update({ id: jobHeaderEntity.id }, { jobHeaderNo: jobHeaderEntity.id })
    //             // generating sewing jobs
    //             let jobQty = 0;
    //             for (const eachJobGroup of sewSerialOpsInfo.jobGroupInfo) {
    //                 const sewingJobNumber = `${eachJobGroup.jobGroupType}-${jobHeaderEntity.id}-${reqModel.bundleGroup}-${eachJobGroup.jobGroupId}`;
    //                 const jobLineObj = new SJobLineEntity();
    //                 jobLineObj.companyCode = companyCode;
    //                 jobLineObj.createdUser = reqModel.username;
    //                 jobLineObj.groupNo = eachJobGroup.jobGroupId;
    //                 jobLineObj.jobNo = sewingJobNumber;
    //                 // jobLineObj.jobType = eachJobGroup.jobGroupType;
    //                 jobLineObj.planProductionDate = Array.from(planProdDate).toString();
    //                 jobLineObj.sJobHeaderId = jobHeaderEntity.id;
    //                 jobLineObj.unitCode = unitCode;
    //                 jobLineObj.sewSerial = sewSerial;
    //                 jobLineObj.jobType = eachJobGroup.jobGroupType;
    //                 jobLineObj.bundleGroup = reqModel.bundleGroup;
    //                 const jobGroupEntity = await transManager.getRepository(SJobLineEntity).save(jobLineObj);
    //                 const jobPlanObj = new SJobLinePlanEntity();
    //                 jobPlanObj.companyCode = companyCode;
    //                 jobPlanObj.createdUser = reqModel.username;
    //                 jobPlanObj.jobNo = sewingJobNumber;
    //                 jobPlanObj.moduleNo = null;
    //                 jobPlanObj.status = SewingJobPlanStatusEnum.OPEN;
    //                 jobPlanObj.planInputDate = null;
    //                 jobPlanObj.rawMaterialStatus = TrimStatusEnum.OPEN;
    //                 jobPlanObj.sJobLineId = jobGroupEntity.id;
    //                 jobPlanObj.unitCode = unitCode;
    //                 jobPlanObj.companyCode = companyCode;
    //                 jobPlanObj.sewSerial = sewSerial;
    //                 jobPlanObj.smv = eachJobGroup.operations.reduce((acc, curr) => {
    //                     return acc + curr.smv;
    //                 }, 0);
    //                 let logicalBundleNo = 1;
    //                 await transManager.getRepository(SJobLinePlanEntity).save(jobPlanObj);
    //                 // Need to assign fgs to each docket bundle
    //                 for (const eachLogicalBundle of logicalBundles) {
    //                     const bundleRef = eachLogicalBundle.bundleNumber;
    //                     const clonedLogicalBundle: SJobSubLineEntity = JSON.parse(JSON.stringify(eachLogicalBundle));
    //                     clonedLogicalBundle.sJobLineId = jobGroupEntity.id;
    //                     clonedLogicalBundle.sewSerial = sewSerial;
    //                     clonedLogicalBundle.bundleNumber = `${eachJobGroup.jobGroupType}-LB-${jobHeaderEntity.id}-${reqModel.bundleGroup}-${logicalBundleNo++}`;
    //                     jobQty += clonedLogicalBundle.qty;
    //                     const jobSubLineEntity = await transManager.getRepository(SJobSubLineEntity).save(clonedLogicalBundle);
    //                     const jobFgEntities: SJobFgEntity[] = [];
    //                     for (const eachFg of bundleWiseFgInfo.get(bundleRef)) {
    //                         const fgClone: SJobFgEntity = JSON.parse(JSON.stringify(eachFg));
    //                         fgClone.jobNo = sewingJobNumber;
    //                         fgClone.sJobSubLineId = jobSubLineEntity.id;
    //                         fgClone.bundlingGroup = reqModel.bundleGroup;
    //                         fgClone.jobGroup = eachJobGroup.jobGroupId;
    //                         fgClone.bundleNo = clonedLogicalBundle.bundleNumber;
    //                         jobFgEntities.push(fgClone);
    //                     }
    //                     await transManager.getRepository(SJobFgEntity).save(jobFgEntities);
    //                 }
    //                 // job operations
    //                 let opsSeq = 1;
    //                 for (const eachOperation of eachJobGroup.operations) {
    //                     const jobLineOps = new SJobLineOperationsEntity();
    //                     jobLineOps.companyCode = companyCode;
    //                     jobLineOps.inputQty = jobQty;
    //                     jobLineOps.jobNo = sewingJobNumber;
    //                     jobLineOps.operationCode = eachOperation.operationCode;
    //                     jobLineOps.originalQty = jobQty;
    //                     jobLineOps.sJobLineId = String(jobGroupEntity.id);
    //                     jobLineOps.unitCode = unitCode;
    //                     jobLineOps.smv = eachOperation.smv;
    //                     jobLineOps.goodQty = 0;
    //                     jobLineOps.rejectionQty = 0;
    //                     jobLineOps.openRejections = 0;
    //                     jobLineOps.operationSequence = opsSeq++;
    //                     jobLineOps.sewSerial = sewSerial;
    //                     const jobOperationEntity = await transManager.getRepository(SJobLineOperationsEntity).save(jobLineOps);
    //                 }
    //                 // job materials
    //                 for (const eachMaterialInfo of eachJobGroup.materialInfo) {
    //                     const jobMaterialObj = new SJobTrimGroupsEntity();
    //                     jobMaterialObj.companyCode = companyCode;
    //                     jobMaterialObj.createdUser = reqModel.username;
    //                     jobMaterialObj.jobNo = sewingJobNumber;
    //                     jobMaterialObj.sJobLineId = jobGroupEntity.id;
    //                     jobMaterialObj.unitCode = unitCode;
    //                     jobMaterialObj.trimGroup = eachMaterialInfo.trimGroup;
    //                     jobMaterialObj.status = TrimStatusEnum.OPEN;
    //                     jobMaterialObj.sewSerial = sewSerial;
    //                     const trimGroupEntity = await transManager.getRepository(SJobTrimGroupsEntity).save(jobMaterialObj);
    //                     for (const eachMaterial of eachMaterialInfo.trimGroupInfo) {
    //                         const jobMaterialItemObj = new SJobTrimItemsEntity();
    //                         jobMaterialItemObj.companyCode = companyCode;
    //                         jobMaterialItemObj.createdUser = reqModel.username;
    //                         jobMaterialItemObj.jobNo = sewingJobNumber;
    //                         jobMaterialItemObj.sJobTrimGroupId = trimGroupEntity.id;
    //                         jobMaterialItemObj.trimGroup = eachMaterialInfo.trimGroup;
    //                         jobMaterialItemObj.unitCode = unitCode;
    //                         jobMaterialItemObj.itemCode = eachMaterial.itemCode;
    //                         jobMaterialItemObj.consumption = eachMaterial.consumption;
    //                         jobMaterialItemObj.status = TrimStatusEnum.OPEN;
    //                         jobMaterialItemObj.uom = eachMaterial.uom;
    //                         jobMaterialItemObj.sJobLineId = jobGroupEntity.id;
    //                         jobMaterialItemObj.sewSerial = sewSerial;
    //                         jobMaterialItemObj.totalQuantity = eachMaterial.consumption * jobQty;
    //                         jobMaterialItemObj.issuedQuantity = 0; ``
    //                         const trimEntity = await transManager.getRepository(SJobTrimItemsEntity).save(jobMaterialItemObj);
    //                     }
    //                 }
    //                 sewingJobs.add(sewingJobNumber);
    //             }
    //         }
    //         await transManager.completeTransaction();
    //         for (const eachJob of sewingJobs) {
    //             const req = new JobNumberRequest(null, reqModel.unitCode, reqModel.companyCode, 0, eachJob, sewSerial);
    //             await this.fgCreationService.createFgCompsForJob(req);
    //         }
    //         return new GlobalResponseObject(true, 26040, 'Sewing jobs saved sucssfully');
    //     } catch (err) {
    //         await transManager.releaseTransaction();
    //         throw err;
    //     }
    // }

    /**
     * END POINT:  TO DELETE SEWING JOBS
     * @param req 
     * @returns 
    */
    // async deleteSewingJobs(req: DeleteSewingJobsRequest): Promise<GlobalResponseObject> {
    //     const transManager = new GenericTransactionManager(this.dataSource);
    //     const checkSJobPreference = await this.jobPreferencesRepository.findOne({ where: { id: req.jobPreferenceId, companyCode: req.companyCode, unitCode: req.unitCode } });
    //     if (!checkSJobPreference) {
    //         throw new ErrorResponse(26041, 'No sewing jobs found');
    //     }
    //     const getSJobHeaderIds = (await this.jobHeaderRepo.find({ where: { jobPrefId: checkSJobPreference.id }, select: ['id'] }))?.map(eachId => eachId.id);;
    //     const getSJobLineIds = (await this.jobGroupRepo.find({ where: { sJobHeaderId: In(getSJobHeaderIds) }, select: ['id'] }))?.map(eachId => eachId.id);
    //     const jobNumbers = (await this.jobGroupRepo.find({ where: { sJobHeaderId: In(getSJobHeaderIds) }, select: ['jobNo'] }))?.map(eachId => eachId.jobNo);
    //     const getInprogressJobs = (await this.sJobLinePlanRepo.find({ where: { sJobLineId: In(getSJobLineIds), status: In([SewingJobPlanStatusEnum.IN_PROGRESS, SewingJobPlanStatusEnum.COMPLETED]) }, select: ['id'] }))?.map(eachId => eachId.id)
    //     if (getInprogressJobs.length) {
    //         throw new ErrorResponse(26042, 'sewing jobs already planned');
    //     }
    //     const getSJobLineOperationIds = (await this.sjobLineOperationsRepo.find({ where: { sJobLineId: In(getSJobLineIds) }, select: ['id'] }))
    //         ?.map(eachId => eachId.id);
    //     const getSJobTrimGroups = (await this.sJobTrimGroupsRepo.find({ where: { sJobLineId: In(getSJobLineIds) }, select: ['id'] }))?.map(eachId => eachId.id);
    //     const getSJobTrimItems = (await this.sJobTrimItems.find({ where: { sJobTrimGroupId: In(getSJobTrimGroups) }, select: ['id'] }))?.map(eachId => eachId.id);
    //     // serial -> product -> color -> size -> fgnumber[];
    //     await transManager.startTransaction();
    //     const deleteJobTrims = await transManager.getRepository(SJobTrimItemsEntity).delete({ id: In(getSJobTrimItems) });
    //     const deleteJobTrimGroups = await transManager.getRepository(SJobTrimGroupsEntity).delete({ id: In(getSJobTrimGroups) });
    //     const deleteJoboperations = await transManager.getRepository(SJobLineOperationsEntity).delete({ id: In(getSJobLineOperationIds) });
    //     const deleteJobLines = await transManager.getRepository(SJobLineEntity).delete({ id: In(getSJobLineIds) });
    //     await transManager.getRepository(SJobSubLineEntity).delete({ sJobLineId: In(getSJobLineIds) });
    //     const deleteJobHeader = await transManager.getRepository(SJobHeaderEntity).delete({ id: In(getSJobHeaderIds) });
    //     const deletePlannedSewingJobs = await transManager.getRepository(SJobLinePlanEntity).delete({ id: In(getSJobLineIds) });
    //     await transManager.getRepository(SJobFgEntity).delete({ jobNo: In(jobNumbers) });
    //     await transManager.completeTransaction();
    //     return new GlobalResponseObject(true, 26043, "Sewing Jobs Deleted Succesfully");


    // }


    /**
     * END POINT: Once user clicks on sewing job number Need to call this api to show the abstract info including dependent job group tabs
     * @param sewSerial 
     * @param jobNumber 
     * @param unitCode 
     * @param companyCode 
    */
    // async getSewingJobQtyAndPropsInfoByJobNumber(jobNumber: string, unitCode: string, companyCode: string): Promise<SewingJobPropsResp> {
    //     const jobInfo = await this.jobGroupRepo.findOne({ where: { jobNo: jobNumber, unitCode, companyCode }, select: ['id', 'sewSerial', 'jobType'] });
    //     if (!jobInfo) {
    //         throw new ErrorResponse(26143, 'Job Details not found the given job' + jobNumber);
    //     }
    //     const sewSerial = jobInfo.sewSerial;
    //     const jobProps: SewingJobPropsModel = await this.sJobFgRepo.getJobPropsByJobNumber(sewSerial, jobNumber, unitCode, companyCode);
    //     const totalInputReportedQty = await this.jobOperationsRepo.getInputReportedQtyByJobNo(jobNumber, unitCode, companyCode);
    //     const totalOutPutReportedQty = await this.jobOperationsRepo.getOutReportedQtyByJobNo(jobNumber, unitCode, companyCode);
    //     const totalRejectedQty = await this.jobOperationsRepo.getTotalRejectedQtyByJobNo(jobNumber, unitCode, companyCode);
    //     const totalBundleCount = await this.jobBundleRepo.count({ where: { sJobLineId: jobInfo.id, unitCode, companyCode } });
    //     console.log(totalOutPutReportedQty + '----------' + totalInputReportedQty);
    //     const wip = (totalInputReportedQty - totalOutPutReportedQty);
    //     const pendingToInputQty = Number(jobProps.jobQty) - Number(totalInputReportedQty);
    //     const resourceInfo = await this.jobPlanRepo.findOne({ where: { jobNo: jobNumber, unitCode, companyCode } });
    //     if (!resourceInfo.moduleNo) {
    //         throw new ErrorResponse(26044, 'Job not yet planned please plan and try again')
    //     }
    //     jobProps.inputReportedQty = totalInputReportedQty;
    //     jobProps.moduleNumber = resourceInfo.moduleNo;
    //     jobProps.noOfJobBundles = totalBundleCount;
    //     jobProps.outputReportedQty = totalOutPutReportedQty;
    //     jobProps.wip = wip;
    //     jobProps.pendingToInputQty = pendingToInputQty;
    //     jobProps.sewSerial = sewSerial;
    //     jobProps.processingType = jobInfo.jobType;
    //     const dependentJobGroupInfo = await this.getDependentJobQtyForJob(jobNumber, unitCode, companyCode, jobProps.productName);
    //     let eligibleQty = 0;
    //     for (const eachDependentJobGroup of dependentJobGroupInfo) {
    //         eachDependentJobGroup.eligibleToReportQty = (eachDependentJobGroup.issuedQty - totalInputReportedQty);
    //         if (eligibleQty == 0) {
    //             eligibleQty = eachDependentJobGroup.eligibleToReportQty;
    //         } else if (eachDependentJobGroup.eligibleToReportQty < eligibleQty) {
    //             eligibleQty = eachDependentJobGroup.eligibleToReportQty;
    //         }
    //     }
    //     jobProps.dependentJobsInfo = dependentJobGroupInfo;
    //     jobProps.eligibleToReportQty = eligibleQty;
    //     jobProps.rejectedQty = Number(totalRejectedQty);
    //     jobProps.jobNumber = jobNumber;
    //     return new SewingJobPropsResp(true, 26045, 'Process job header properties retrieved successfully', jobProps)
    // }




    /**
     * END POINT: Need to trigger when pending to reported qty > 0 and dependent job group category is panel form
     * @param sewSerial 
     * @param jobNumber 
     * @param unitCode 
     * @param companyCode 
    */
    // async getComponentBundlesForSewingJob(jobNumber: string, unitCode: string, companyCode: string): Promise<PanelReqForJobInfoResp> {
    //     const jobInfo = await this.jobGroupRepo.findOne({ where: { jobNo: jobNumber, unitCode, companyCode }, select: ['groupNo', 'bundleGroup', 'id', 'sewSerial', 'jobType', 'groupNo'] });
    //     if (!jobInfo) {
    //         throw new ErrorResponse(26143, 'Job Details not found the given job' + jobNumber);
    //     }
    //     const sewSerial = jobInfo.sewSerial;
    //     const allDepRequests: PanelReqForJobModel[] = [];
    //     const prodColorSizeInfo = await this.sJobSubLineRepo.getColorSizeQtyInfoByJobId(jobInfo.id, unitCode, companyCode);
    //     const dependentJobsInfo = await this.getDependentJobQtyForJob(jobNumber, unitCode, companyCode, prodColorSizeInfo[0].productName);
    //     for (const eachDepGroup of dependentJobsInfo) {
    //         const seqInfo = await this.opsSeq.findOne({ where: { group: eachDepGroup.depJobGroup, sewSerial, unitCode, companyCode }, select: ['jobType'] });
    //         eachDepGroup.operationCategory = seqInfo.jobType;
    //     }
    //     const panelFormInfo = dependentJobsInfo.filter(form => form.operationCategory == ProcessTypeEnum.KNIT);
    //     const otherJgInfo = dependentJobsInfo.filter(form => form.operationCategory != ProcessTypeEnum.KNIT);
    //     console.log(otherJgInfo);
    //     if (panelFormInfo.length > 0) {
    //         const colorSizeCompBundleInfo = [];
    //         const jobProps = await this.sJobFgRepo.getSoAndSoLineByJobNumber(sewSerial, jobNumber, unitCode, companyCode);
    //         for (const eachColorSizeInfo of prodColorSizeInfo) {
    //             const eachCompBundleReqData: CompWiseBundleInfo[] = [];
    //             for (const eachReqComp of panelFormInfo) {
    //                 const pendingToReq = (eachColorSizeInfo.quantity - eachReqComp.requestedQty);
    //                 const getRepBundleReq = new GetReportedBundleReqModel(jobProps.soNumber, jobProps.soLineNumber, eachColorSizeInfo.productName, eachColorSizeInfo.fgColor, eachColorSizeInfo.size, [eachReqComp.dependentComp], pendingToReq);
    //                 const docketBundleInfo = await this.docGenService.getReportedBundleInfo(getRepBundleReq);
    //                 if (!docketBundleInfo.status) {
    //                     throw new ErrorResponse(docketBundleInfo.errorCode, docketBundleInfo.internalMessage);
    //                 }
    //                 const componentBundles = docketBundleInfo.data;
    //                 const bundleReqModels: PtsBankRequestBundleTrackModel[] = [];
    //                 for (const eachDocBundle of componentBundles) {
    //                     const bundleReq = new PtsBankRequestBundleTrackModel();
    //                     bundleReq.brcd = eachDocBundle.bundleNumber.toString();
    //                     bundleReq.iQty = 0;
    //                     bundleReq.orgQty = 0;
    //                     bundleReq.rQty = eachDocBundle.quantity;
    //                     const bundleProps = new PtsBundelInfoBasicModel();
    //                     bundleProps.brcd = eachDocBundle.bundleNumber.toString();
    //                     bundleProps.bundleNo = eachDocBundle.bundleNumber.toString();
    //                     bundleProps.color = eachColorSizeInfo.fgColor;
    //                     bundleProps.component = eachReqComp.dependentComp;
    //                     bundleProps.jobNo = eachDocBundle.docketNumber;
    //                     bundleProps.moNo = eachDocBundle.moNumber;
    //                     bundleProps.size = eachColorSizeInfo.size;
    //                     bundleProps.poSerial = eachDocBundle.poSerial;
    //                     bundleProps.jobGroup = eachReqComp.depJobGroup;
    //                     bundleReq.bundleProps = bundleProps;
    //                     bundleReqModels.push(bundleReq);
    //                 }
    //                 const compWiseBundle = new CompWiseBundleInfo(eachReqComp.dependentComp, bundleReqModels);
    //                 eachCompBundleReqData.push(compWiseBundle);
    //             }
    //             const colorSizeReqModel = new ColorSizeCompModel(eachColorSizeInfo.productName, eachColorSizeInfo.fgColor, eachColorSizeInfo.size, eachCompBundleReqData);
    //             colorSizeCompBundleInfo.push(colorSizeReqModel);
    //         }
    //         const reqPanelInfo = new PanelReqForJobModel(jobNumber, colorSizeCompBundleInfo, null, panelFormInfo[0].depJobGroup, panelFormInfo[0].operationCategory);
    //         allDepRequests.push(reqPanelInfo);
    //     }
    //     // else {
    //     for (const depGroup of otherJgInfo) {
    //         const colorSizeCompBundleInfo = [];
    //         const bankReqObj = new PtsJobNumberDepJgRequest(null, unitCode, companyCode, 1, jobNumber, Number(depGroup.depJobGroup), sewSerial);
    //         const depJgInfo: PtsBankElgResponse = await this.fgBankService.getPreJgElgBundlesForJob(bankReqObj);
    //         if (!depJgInfo.status) {
    //             throw new ErrorResponse(depJgInfo.errorCode, depJgInfo.internalMessage);
    //         }
    //         const depJgDetails: PtsBankRequestDepJobModel[] = depJgInfo.data;
    //         const respectiveBundles: PtsBankRequestBundleTrackModel[] = [];
    //         for (const eachDepJgDetail of depJgDetails) {
    //             for (const eachBundle of eachDepJgDetail.bundles) {
    //                 respectiveBundles.push(eachBundle);
    //             }
    //         }
    //         for (const eachColorSizeInfo of prodColorSizeInfo) {
    //             const colorSizeBundles = respectiveBundles.filter(bun => (bun.bundleProps.color == eachColorSizeInfo.fgColor && bun.bundleProps.size == eachColorSizeInfo.size));
    //             for (const bundle of colorSizeBundles) {
    //                 bundle.bundleProps.jobGroup = depGroup.depJobGroup;
    //             }
    //             let bundleReqModels: PtsBankRequestBundleTrackModel[] = [];
    //             if (colorSizeBundles) {
    //                 bundleReqModels = colorSizeBundles;
    //             } else {
    //                 bundleReqModels = [];
    //             }
    //             const compWiseBundle = new CompWiseBundleInfo(depGroup.dependentComp, bundleReqModels);
    //             const colorSizeReqModel = new ColorSizeCompModel(eachColorSizeInfo.productName, eachColorSizeInfo.fgColor, eachColorSizeInfo.size, [compWiseBundle]);
    //             colorSizeCompBundleInfo.push(colorSizeReqModel);
    //         }
    //         const reqPanelInfo = new PanelReqForJobModel(jobNumber, colorSizeCompBundleInfo, null, depGroup.depJobGroup, depGroup.operationCategory);
    //         allDepRequests.push(reqPanelInfo);
    //     }
    //     // }
    //     return new PanelReqForJobInfoResp(true, 0, 'Required Panel Info retrieved successfully', allDepRequests)
    // }

    /**
     * END POINT: when user clicks on create request against to panel form dependent tab need to call this
     * @param requestedBundles 
    */
    // async createPanelFormRequestForSewingJob(bankReq: PanelRequestCreationModel): Promise<any> {

    //     const currentAvailability = await this.getComponentBundlesForSewingJob(bankReq.jobNumber, bankReq.unitCode, bankReq.companyCode);
    //     if (!currentAvailability.status) {
    //         throw new ErrorResponse(currentAvailability.errorCode, currentAvailability.internalMessage)
    //     }
    //     const requestedBundles = currentAvailability.data.map((bun) => {
    //         return bun;
    //     });
    //     bankReq.requestBundleDetails = requestedBundles;
    //     const ptsBankReq = new PtsBankRequestCreateRequest(bankReq.username, bankReq.unitCode, bankReq.companyCode, bankReq.userId);
    //     ptsBankReq.fulfillmentDateTime = bankReq.fulfillmentDateTime;
    //     ptsBankReq.requestedBy = bankReq.requestedBy;
    //     ptsBankReq.sewSerial = bankReq.sewSerial;
    //     const mainJobInfo: PtsBankRequestMainJobModel[] = [];
    //     for (const eachBankReq of bankReq.requestBundleDetails) {
    //         const jobWiseBankReq = new PtsBankRequestMainJobModel();
    //         jobWiseBankReq.mainJob = eachBankReq.jobNumber;
    //         jobWiseBankReq.opCategory = eachBankReq.processType;
    //         const docketWiseBundles = new Map<string, PtsBankRequestBundleTrackModel[]>();
    //         for (const eachColorSizeInfo of eachBankReq.productColorSizeCompWiseInfo) {
    //             for (const compBundle of eachColorSizeInfo.componentWiseBundleInfo) {
    //                 for (const eachBundle of compBundle.bundleInfo) {
    //                     if (!docketWiseBundles.has(eachBundle.bundleProps.jobNo)) {
    //                         docketWiseBundles.set(eachBundle.bundleProps.jobNo, [])
    //                     }
    //                     docketWiseBundles.get(eachBundle.bundleProps.jobNo).push(eachBundle);
    //                 }
    //             }
    //         }
    //         const depJobWiseReq: PtsBankRequestDepJobModel[] = []
    //         for (const [docket, docBundle] of docketWiseBundles) {
    //             const depJobReq = new PtsBankRequestDepJobModel();
    //             depJobReq.bundles = docBundle;
    //             depJobReq.depJobNumber = docket;
    //             depJobReq.opCategory = eachBankReq.processType;
    //             depJobReq.depJobGroup = docBundle[0]?.bundleProps.jobGroup;
    //             depJobWiseReq.push(depJobReq);
    //         }
    //         jobWiseBankReq.dependentJobs = depJobWiseReq;
    //         jobWiseBankReq.resourceInfo = jobWiseBankReq.resourceInfo;
    //         mainJobInfo.push(jobWiseBankReq);
    //     }
    //     ptsBankReq.mainJobs = mainJobInfo;
    //     for (const eachBankReq of bankReq.requestBundleDetails) {
    //         // Need to update the consumed status against to each bundle + comp
    //         if (eachBankReq.processType == ProcessTypeEnum.KNIT) {
    //             const cutBundleRequests: CutBundleInfoModel[] = [];
    //             for (const eachColorSizeInfo of eachBankReq.productColorSizeCompWiseInfo) {
    //                 for (const compBundle of eachColorSizeInfo.componentWiseBundleInfo) {
    //                     for (const eachBundle of compBundle.bundleInfo) {
    //                         const bundleReq = new CutBundleInfoModel();
    //                         bundleReq.bundleNumber = eachBundle.bundleProps.bundleNo;
    //                         bundleReq.component = eachBundle.bundleProps.component;
    //                         bundleReq.docketNumber = eachBundle.bundleProps.jobNo;
    //                         bundleReq.fgNumbers = [];
    //                         bundleReq.moNumber = eachBundle.bundleProps.moNo;
    //                         bundleReq.poSerial = eachBundle.bundleProps.poSerial;
    //                         bundleReq.quantity = eachBundle.rQty;
    //                         cutBundleRequests.push(bundleReq)
    //                     }
    //                 }
    //             }
    //             const dcpReq = new ConsumedBundleInfoRequest(bankReq.username, bankReq.userId, bankReq.unitCode, bankReq.companyCode, cutBundleRequests);
    //             const responseFromCps: CutBundleInfoResponse = await this.docGenService.updateConsumedStatusAgainstToCompBundle(dcpReq);
    //             if (!responseFromCps.status) {
    //                 throw new ErrorResponse(responseFromCps.errorCode, responseFromCps.internalMessage);
    //             }
    //             const bunlesWithFgs = responseFromCps.data;
    //             for (const eachJob of ptsBankReq.mainJobs) {
    //                 for (const eachBundle of eachJob.dependentJobs) {
    //                     for (const bundle of eachBundle.bundles) {
    //                         const actBundle = bunlesWithFgs.find(bun => bun.bundleNumber == bundle.brcd);
    //                         if (actBundle) {
    //                             bundle.fgNumbers = actBundle.fgNumbers;
    //                             bundle.componentName = bundle?.bundleProps?.component;
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //     for (const eachDepJg of ptsBankReq.mainJobs) {
    //         const ptsReq  = new PtsBankRequestCreateRequest(ptsBankReq.username, ptsBankReq.unitCode, ptsBankReq.companyCode, ptsBankReq.userId);
    //         ptsReq.fulfillmentDateTime = bankReq.fulfillmentDateTime;
    //         ptsReq.requestedBy = bankReq.requestedBy;
    //         ptsReq.sewSerial = bankReq.sewSerial;
    //         ptsReq.mainJobs = [eachDepJg];
    //         const bankReqSave = await this.fgBankService.createBankRequest(ptsReq);
    //         if (!bankReqSave.status) {
    //             throw new ErrorResponse(bankReqSave.errorCode, bankReqSave.internalMessage)
    //         }
    //     }



    //     await this.jobPlanRepo.update({ jobNo: bankReq.jobNumber, unitCode: bankReq.unitCode, companyCode: bankReq.companyCode }, { rawMaterialStatus: TrimStatusEnum.ISSUED })
    //     // TODO: Need to call PTS api to create bank request
    //     return new GlobalResponseObject(true, 0, 'Request Created Successfully');
    // }

    /**
     * TODO: Need to get this info from the PTS
     * @param jobNumber 
     * @param unitCode 
     * @param companyCode 
     * @returns 
    */
    // async getDependentJobQtyForJob(jobNumber: string, unitCode: string, companyCode: string, productName): Promise<DependentJobGroupInfo[]> {
    //     const jobInfo = await this.jobGroupRepo.findOne({ where: { jobNo: jobNumber, unitCode, companyCode } });
    //     // return await this.sewOpsInfo.getDependentComponentsForJobGroup(jobInfo.sewSerial, jobInfo.groupNo, unitCode, companyCode, productName);
    //     const jobReq = new JobNumberRequest(null, unitCode, companyCode, 1, jobNumber, 0)
    //     const depGroupInfo = await this.fgBankService.getOpDepGroupInfoByJobNumber(jobReq);
    //     if (!depGroupInfo.status) {
    //         throw new ErrorResponse(depGroupInfo.errorCode, depGroupInfo.internalMessage);
    //     }
    //     return depGroupInfo.data;
    // }

    /**
     * Service to get job details for input dashboard
     * @param req 
     * @returns 
    */
    // async getJobDetailsForInputDashboard(req: SewingIJobNoRequest): Promise<IPlannningJobModelResponse> {
    //     const jobPropsAndInfo = await this.getSewingJobQtyAndPropsInfoByJobNumber(req.jobNo, req.unitCode, req.companyCode);
    //     if (!jobPropsAndInfo.status) {
    //         throw new ErrorResponse(jobPropsAndInfo.errorCode, jobPropsAndInfo.internalMessage)
    //     };
    //     const jobProps = jobPropsAndInfo.data;
    //     const jobLinePlanObj = await this.sJobLinePlanRepo.findOne({ where: { jobNo: req.jobNo, unitCode: req.unitCode, companyCode: req.companyCode } });
    //     let status: string;
    //     let shape: string;
    //     let color: string;

    //     if (jobLinePlanObj.rawMaterialStatus == TrimStatusEnum.OPEN) {
    //         status = "RM Not Requested";
    //         shape = "circle";
    //         color = "gray";
    //     } else if (jobLinePlanObj.rawMaterialStatus == TrimStatusEnum.REQUESTED) {
    //         status = "RM Requested & Waiting For RM";
    //         shape = "circle";
    //         color = "green";
    //     } else if (jobLinePlanObj.rawMaterialStatus == TrimStatusEnum.PARTIALLY_ISSUED) {
    //         status = "RM Partially Issued";
    //         shape = "circle";
    //         color = "orange";
    //     } else {
    //         if (jobProps.pendingToInputQty < 0 || jobProps.eligibleToReportQty < 0) {
    //             shape = "triangle";
    //             status = "Invalid Quantity Values";
    //             color = "red";
    //         } else if (jobProps.pendingToInputQty > 0 && jobProps.eligibleToReportQty > 0) {
    //             if (jobProps.eligibleToReportQty < jobProps.pendingToInputQty) {
    //                 shape = "square";
    //                 status = "Partially Eligible To Give Input To Line";
    //                 color = "orange";
    //             } else {
    //                 shape = "square";
    //                 status = "Fully Eligible To Give Input To Line";
    //                 color = "green";
    //             }
    //         }
    //         else if (jobProps.pendingToInputQty > 0 && jobProps.eligibleToReportQty == 0) {
    //             status = "No Eligible Qty To Give Input To Line";
    //             shape = "square";
    //             color = "gray";
    //         }
    //         else if (jobProps.pendingToInputQty == 0) {
    //             shape = "square";
    //             status = "Input Fully Reported AND WIP";
    //             color = "green";
    //         }

    //     }
    //     const jobCompletionPercentage = (jobProps.outputReportedQty / jobProps.inputReportedQty) * 100;
    //     const jobStatusType = new jobStatusTypeModel(status, shape, color);
    //     const jobPlanData = new IPlannningJobModel(jobProps.sewSerial, req.jobNo, jobStatusType, jobProps.moNumber, jobProps.moLineNumbers, jobProps.productName, null, null, jobProps.rejectedQty > 0 ? true : false, jobCompletionPercentage, jobProps.wip)
    //     return new IPlannningJobModelResponse(true, 0, 'Job Info Retrieved Successfully', jobPlanData)
    // }

    // async getSewingJobSizeWiseSummaryData(reqModel: SewSerialRequest): Promise<SewingJobSizeWiseSummaryResponse> {
    //     const { poSerial, unitCode, companyCode } = reqModel;
    //     const sewSerial = poSerial;
    //     const sewingOrderInfo = await this.sewOrderRepo.findOne({ select: ['id', 'desc', 'orderRefNo', 'sewSerial'], where: { sewSerial: sewSerial, unitCode, companyCode, isActive: true } });
    //     if (!sewingOrderInfo) {
    //         throw new ErrorResponse(0, `Sewing Order details not found for the given id please check and try again sew Serial: ${sewSerial}`)
    //     }
    //     const sewingOrderLineInfoObj: SewingJobLineInfo[] = [];
    //     const sewingOrderLineInfo = await this.sewOrderLineRepo.find({ where: { sOrderId: sewingOrderInfo.id, unitCode, companyCode, isActive: true } });
    //     console.log(sewingOrderLineInfo);
    //     for (const eachSewingOrderLine of sewingOrderLineInfo) {
    //         const colorSizeQtyInfo = new Map<string, Map<string, number>>();
    //         const colorSizeOrderSubInfo = new Map<string, Map<string, number[]>>();
    //         const sewingOrderSubLineInfoObj: SummaryQtyDetails[] = [];
    //         const sewingOrderSubLineInfo = await this.sewOrderSubLineRepo.find({ where: { sOrderLineId: eachSewingOrderLine.id, unitCode, companyCode } });
    //         let fgColor = '';
    //         for (const eachSubLine of sewingOrderSubLineInfo) {
    //             const subLineProps = await this.subLineProps.findOne({ where: { sewSerial, oslRefId: eachSubLine.oslRefId, unitCode, companyCode } });
    //             fgColor = subLineProps.fgColor;
    //             if (!colorSizeQtyInfo.has(subLineProps.fgColor)) {
    //                 colorSizeQtyInfo.set(subLineProps.fgColor, new Map<string, number>());
    //                 colorSizeOrderSubInfo.set(subLineProps.fgColor, new Map<string, number[]>());
    //             }
    //             if (!colorSizeQtyInfo.get(subLineProps.fgColor).has(subLineProps.size)) {
    //                 colorSizeQtyInfo.get(subLineProps.fgColor).set(subLineProps.size, 0);
    //                 colorSizeOrderSubInfo.get(subLineProps.fgColor).set(subLineProps.size, []);
    //             }
    //             const preQty = colorSizeQtyInfo.get(subLineProps.fgColor).get(subLineProps.size);
    //             colorSizeQtyInfo.get(subLineProps.fgColor).set(subLineProps.size, preQty + eachSubLine.quantity);
    //             colorSizeOrderSubInfo.get(subLineProps.fgColor).get(subLineProps.size).push(eachSubLine.id);
    //         }
    //         for (const [fgColor, sizeQtyDetails] of colorSizeQtyInfo) {
    //             for (const [size, qtyDetails] of sizeQtyDetails) {
    //                 const subLineIds = colorSizeOrderSubInfo.get(fgColor).get(size);
    //                 // Need to ge the FGs of sub line id and get the size level operation reported  info
    //                 const fgNumbersInfo = await this.sFinishedGoodRepo.find({ where: { sOrderSubLineId: In(subLineIds), unitCode, companyCode }, select: ['fgNumber'] });
    //                 const fgNumbers = fgNumbersInfo.map((fg) => {
    //                     return fg.fgNumber;
    //                 });
    //                 const reqObj = new SewSerialFgNumberReq(null, unitCode, companyCode, 1, sewSerial, fgNumbers); 
    //                 const fgReportingInfo = await this.fgReportingService.getOperationLevelFgInfoForGivenFgs(reqObj);

    //                 if (!fgReportingInfo.status) {
    //                     throw new ErrorResponse(fgReportingInfo.errorCode, fgReportingInfo.internalMessage);
    //                 }
    //                 // const sewGeneratedQty = await this.sewFgRepo.getSewGeneratedQtyBySubLineIdsAndBundleGroup(subLineIds, unitCode, companyCode, 2);
    //                 const sizeQtyObj = new SummaryQtyDetails(size, fgNumbers.length, 0, 0, fgReportingInfo.data[0].reportedFgNumbers.length, fgReportingInfo.data[fgReportingInfo.data.length - 1].reportedFgNumbers.length);
    //                 // console.log(sizeQtyObj);
    //                 sewingOrderSubLineInfoObj.push(sizeQtyObj);
    //             }
    //         }
    //         const lineInfoObj = new SewingJobLineInfo(eachSewingOrderLine.id, eachSewingOrderLine.orderLineRefNo, eachSewingOrderLine.productType, eachSewingOrderLine.productName, fgColor, sewingOrderSubLineInfoObj);
    //         // console.log(lineInfoObj);
    //         if (lineInfoObj.sizeQtyDetails.length) {
    //             sewingOrderLineInfoObj.push(lineInfoObj);
    //         }

    //     }
    //     const jobWiseSummary = new SewingJobSizeWiseSummaryModel(sewingOrderInfo.id, sewingOrderInfo.desc, sewingOrderInfo.orderRefNo, sewingOrderInfo.sewSerial, sewingOrderLineInfoObj);
    //     return new SewingJobSizeWiseSummaryResponse(true, 0, '', [jobWiseSummary])
    // }
    // async getSewingJobOperationWiseSummaryData(reqModel: SewSerialRequest): Promise<SewingJobOperationWiseSummaryResponse> {
    //     const { poSerial, unitCode, companyCode } = reqModel;
    //     const sewSerial = poSerial;
    //     const sizeWiseSummary: SewingJobOperationWiseSummaryModel[] = [];
    //     const sewingOrderInfo = await this.sewOrderRepo.findOne({ select: ['id', 'desc', 'orderRefNo', 'sewSerial'], where: { sewSerial: sewSerial, unitCode, companyCode, isActive: true } });
    //     if (!sewingOrderInfo) {
    //         throw new ErrorResponse(0, `Sewing Order details not found for the given id please check and try again sew Serial: ${sewSerial}`)
    //     }
    //     const sewingOrderLineInfoObj: SewingJobOperationLineInfo[] = [];
    //     const sewingOrderLineInfo = await this.sewOrderLineRepo.find({ where: { sOrderId: sewingOrderInfo.id, unitCode, companyCode, isActive: true }, select: ['id', 'orderLineRefNo', 'productType', 'productName'] });
    //     for (const eachSewingOrderLine of sewingOrderLineInfo) {
    //         const colorSizeQtyInfo = new Map<string, Map<string, number>>();
    //         const colorSizeOrderSubInfo = new Map<string, Map<string, number[]>>();
    //         const sewingOrderSubLineInfoObj: SummaryOperationQtyDetails[] = [];
    //         const sewingOrderSubLineInfo = await this.sewOrderSubLineRepo.find({ where: { sOrderLineId: eachSewingOrderLine.id, unitCode, companyCode } });
    //         let fgColor = '';
    //         for (const eachSubLine of sewingOrderSubLineInfo) {
    //             const subLineProps = await this.subLineProps.findOne({ where: { sewSerial, oslRefId: eachSubLine.oslRefId, unitCode, companyCode } });
    //             fgColor = subLineProps.fgColor;
    //             if (!colorSizeQtyInfo.has(subLineProps.fgColor)) {
    //                 colorSizeQtyInfo.set(subLineProps.fgColor, new Map<string, number>());
    //                 colorSizeOrderSubInfo.set(subLineProps.fgColor, new Map<string, number[]>());
    //             }
    //             if (!colorSizeQtyInfo.get(subLineProps.fgColor).has(subLineProps.size)) {
    //                 colorSizeQtyInfo.get(subLineProps.fgColor).set(subLineProps.size, 0);
    //                 colorSizeOrderSubInfo.get(subLineProps.fgColor).set(subLineProps.size, []);
    //             }
    //             const preQty = colorSizeQtyInfo.get(subLineProps.fgColor).get(subLineProps.size);
    //             colorSizeQtyInfo.get(subLineProps.fgColor).set(subLineProps.size, preQty + eachSubLine.quantity);
    //             colorSizeOrderSubInfo.get(subLineProps.fgColor).get(subLineProps.size).push(eachSubLine.id);
    //         }
    //         for (const [fgColor, sizeQtyDetails] of colorSizeQtyInfo) {
    //             for (const [size, qtyDetails] of sizeQtyDetails) {
    //                 const subLineIds = colorSizeOrderSubInfo.get(fgColor).get(size);
    //                 // Need to ge the FGs of sub line id and get the size level operation reported  info
    //                 const fgNumbersInfo = await this.sFinishedGoodRepo.find({ where: { sOrderSubLineId: In(subLineIds), unitCode, companyCode }, select: ['fgNumber'] });
    //                 const fgNumbers = fgNumbersInfo.map((fg) => {
    //                     return fg.fgNumber;
    //                 });
    //                 const reqObj = new SewSerialFgNumberReq(null, unitCode, companyCode, 1, sewSerial, fgNumbers);
    //                 const fgReportingInfo = await this.fgReportingService.getOperationLevelFgInfoForGivenFgs(reqObj);
    //                 if (!fgReportingInfo.status) {
    //                     throw new ErrorResponse(fgReportingInfo.errorCode, fgReportingInfo.internalMessage);
    //                 }
    //                 for (const eachOps of fgReportingInfo.data) {
    //                     const sizeQtyObj = new SummaryOperationQtyDetails(eachOps.operationCode, fgNumbers.length, 0, 0, eachOps.reportedFgNumbers.length, eachOps.reportedFgNumbers.length, size);
    //                     sewingOrderSubLineInfoObj.push(sizeQtyObj);
    //                 }
    //             }
    //         }
    //         const lineInfoObj = new SewingJobOperationLineInfo(eachSewingOrderLine.id, eachSewingOrderLine.orderLineRefNo, eachSewingOrderLine.productType, eachSewingOrderLine.productName, fgColor, sewingOrderSubLineInfoObj);
    //         if (lineInfoObj.sizeQtyDetails.length) {
    //             sewingOrderLineInfoObj.push(lineInfoObj);
    //         }
    //         sizeWiseSummary.push(new SewingJobOperationWiseSummaryModel(sewingOrderInfo.id, sewingOrderInfo.desc, sewingOrderInfo.orderRefNo, sewingOrderInfo.sewSerial, sewingOrderLineInfoObj))
    //     }
    //     return new SewingJobOperationWiseSummaryResponse(true, 0, '', sizeWiseSummary)
    // }

    // async getAvailableComponentBundlesForProcessType(sewSerial: number, processType: ProcessTypeEnum, unitCode: string, companyCode: string): Promise<PanelReqForJobInfoResp> {
    //     const allDepRequests: PanelReqForJobModel[] = [];
    //     const prodColorSizeInfo = await this.sewOrderSubLineRepo.getQtyInfoForSewSerial(unitCode, companyCode, sewSerial);
    //     const dependentJobsInfo = await this.opsSeq.findOne({ where: { sewSerial, unitCode, companyCode, opCategory: processType } });
    //     const groupInfo = dependentJobsInfo;
    //     const components = dependentJobsInfo?.componentNames?.split(',').map(com => com);
    //     if (groupInfo.opCategory == ProcessTypeEnum.KNIT) {
    //         const dependentJobsInfoForKnit = await this.opsSeq.find({ where: { sewSerial, unitCode, companyCode, opCategory: ProcessTypeEnum.KNIT }, select: ['componentNames'] });
    //         const colorSizeCompBundleInfo = [];
    //         const knitComps = [];
    //         dependentJobsInfoForKnit.forEach((g) => {
    //             g.componentNames.split(',').forEach((c) => {
    //                 knitComps.push(c)
    //             })
    //         });
    //         const jobProps = await this.sewOrderSubLineRepo.getSoAndSoLineByJobNumber(sewSerial, unitCode, companyCode);
    //         for (const eachColorSizeInfo of prodColorSizeInfo) {
    //             const eachCompBundleReqData: CompWiseBundleInfo[] = [];
    //             for (const eachReqComp of knitComps) {
    //                 const pendingToReq = (eachColorSizeInfo.quantity);
    //                 const getRepBundleReq = new GetReportedBundleReqModel(jobProps.soNumber, jobProps.soLineNumber, eachColorSizeInfo.productName, eachColorSizeInfo.fgColor, eachColorSizeInfo.size, [eachReqComp], pendingToReq);
    //                 const docketBundleInfo = await this.docGenService.getReportedBundleInfo(getRepBundleReq);
    //                 if (!docketBundleInfo.status) {
    //                     throw new ErrorResponse(docketBundleInfo.errorCode, docketBundleInfo.internalMessage);
    //                 }
    //                 const componentBundles = docketBundleInfo.data;
    //                 const bundleReqModels: PtsBankRequestBundleTrackModel[] = [];
    //                 for (const eachDocBundle of componentBundles) {
    //                     const bundleReq = new PtsBankRequestBundleTrackModel();
    //                     bundleReq.brcd = eachDocBundle.bundleNumber.toString();
    //                     bundleReq.iQty = 0;
    //                     bundleReq.orgQty = 0;
    //                     bundleReq.rQty = eachDocBundle.quantity;
    //                     const bundleProps = new PtsBundelInfoBasicModel();
    //                     bundleProps.brcd = eachDocBundle.bundleNumber.toString();
    //                     bundleProps.bundleNo = eachDocBundle.bundleNumber.toString();
    //                     bundleProps.color = eachColorSizeInfo.fgColor;
    //                     bundleProps.component = eachDocBundle.component;
    //                     bundleProps.jobNo = eachDocBundle.docketNumber;
    //                     bundleProps.moNo = eachDocBundle.moNumber;
    //                     bundleProps.size = eachColorSizeInfo.size;
    //                     bundleProps.poSerial = eachDocBundle.poSerial;
    //                     bundleReq.bundleProps = bundleProps;
    //                     bundleReqModels.push(bundleReq);
    //                 }
    //                 const compWiseBundle = new CompWiseBundleInfo(eachReqComp, bundleReqModels);
    //                 eachCompBundleReqData.push(compWiseBundle);
    //             }
    //             const colorSizeReqModel = new ColorSizeCompModel(eachColorSizeInfo.productName, eachColorSizeInfo.fgColor, eachColorSizeInfo.size, eachCompBundleReqData);
    //             colorSizeCompBundleInfo.push(colorSizeReqModel);
    //         }
    //         const reqPanelInfo = new PanelReqForJobModel(null, colorSizeCompBundleInfo, null, null, null);
    //         allDepRequests.push(reqPanelInfo);
    //     } else {
    //         const colorSizeCompBundleInfo = [];
    //         const bankReqObj = new SewSerialDepGroupReq(sewSerial, unitCode, companyCode, groupInfo.group);
    //         console.log(bankReqObj);
    //         const depJgInfo: PtsBankElgResponse = await this.fgBankService.getElgBundlesForSewSerialAndJg(bankReqObj);
    //         console.log(depJgInfo);
    //         if (!depJgInfo.status) {
    //             throw new ErrorResponse(depJgInfo.errorCode, depJgInfo.internalMessage);
    //         }
    //         const depJgDetails: PtsBankRequestDepJobModel[] = depJgInfo.data;
    //         const respectiveBundles: PtsBankRequestBundleTrackModel[] = [];
    //         for (const eachDepJgDetail of depJgDetails) {
    //             for (const eachBundle of eachDepJgDetail.bundles) {
    //                 respectiveBundles.push(eachBundle);
    //             }
    //         }
    //         for (const eachColorSizeInfo of prodColorSizeInfo) {
    //             const colorSizeBundles = respectiveBundles.filter(bun => bun.bundleProps.color == eachColorSizeInfo.fgColor && bun.bundleProps.size == eachColorSizeInfo.size);
    //             let bundleReqModels: PtsBankRequestBundleTrackModel[] = [];
    //             if (colorSizeBundles) {
    //                 bundleReqModels = colorSizeBundles;
    //             } else {
    //                 bundleReqModels = [];
    //             }
    //             const compWiseBundle = new CompWiseBundleInfo(components.toString(), bundleReqModels);
    //             const colorSizeReqModel = new ColorSizeCompModel(eachColorSizeInfo.productName, eachColorSizeInfo.fgColor, eachColorSizeInfo.size, [compWiseBundle]);
    //             colorSizeCompBundleInfo.push(colorSizeReqModel);
    //         }
    //         const reqPanelInfo = new PanelReqForJobModel(null, colorSizeCompBundleInfo, null, null, null);
    //         allDepRequests.push(reqPanelInfo);
    //     }
    //     return new PanelReqForJobInfoResp(true, 0, 'Required Panel Info retrieved successfully', allDepRequests)
    // }

    // called from PTS
    async updateReportedQtyOfJobAndOp(req: JobOpUpdateRequest): Promise<GlobalResponseObject> {
        const transactionalEntityManager = new GenericTransactionManager(this.dataSource);
        try {
            await transactionalEntityManager.startTransaction();
            const { jobNumber, opCode, gQty, rQty, companyCode, unitCode } = req;
            const jobOpRec = await this.jobOperationsRepo.findOne({ where: { companyCode: companyCode, unitCode: unitCode, jobNumber: jobNumber, operationCodes: opCode } });
            const orgQty = jobOpRec.originalQty;
            const preQty = jobOpRec.goodQty + jobOpRec.rejectionQty;
            let reconciled = false;
            if ((preQty + gQty + rQty) == orgQty) {
                // then the job reconciliation will be true
                reconciled = true;
            }
            const logEntry = this.sJobLineOperationsHistoryRepo.create({
                processingSerial: jobOpRec.processingSerial,
                processType: jobOpRec.processType,
                jobNumber: jobOpRec.jobNumber,
                operationGroup: jobOpRec.operationGroup,
                operationCodes: jobOpRec.operationCodes,
                operationCode: jobOpRec.operationCode,
                originalQty: jobOpRec.originalQty,
                inputQty: jobOpRec.inputQty ?? 0,
                goodQty: gQty,
                rejectionQty: rQty,
                openRejections: jobOpRec.openRejections,
                operationSequence: jobOpRec.operationSequence,
                smv: jobOpRec.smv
            });
            await transactionalEntityManager.getRepository(SJobLineOperationsHistoryEntity).save(logEntry);
            await transactionalEntityManager.getRepository(SJobLineOperationsEntity).update({ jobNumber: jobNumber, companyCode: companyCode, unitCode: unitCode, operationCodes: opCode }, { goodQty: () => `good_qty + ${gQty}`, rejectionQty: () => `rejection_qty + ${rQty}` });
            await transactionalEntityManager.completeTransaction();
            return new GlobalResponseObject(true, 0, 'Job operation updated successfully');
        } catch (error) {
            await transactionalEntityManager.releaseTransaction();
            throw new InternalServerErrorException(`Error updating quantites for job Operations: ${error.message}`);
        }
    }
}
