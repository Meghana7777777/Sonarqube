import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import { PoLineRepository } from '../entities/repository/po-line.repo';
import { PoProductRepository } from '../entities/repository/po-product.repo';
import { PoSubLineRepository } from '../entities/repository/po-sub-line.repo';
import { ProcessingOrderRepository } from '../entities/repository/processing-order.repo';
import { ProductSubLineFeaturesRepository } from '../entities/repository/product-sub-line-features.repo';
import { PJ_ProcessingSerialRequest, PJ_ProcessingTypesResponse, PJ_ProcessingJobsSummaryResponse, PJ_ProcessingSerialTypeAndFeatureGroupReq, PJ_ProcessingJobsSummaryForFeaturesResponse, PJ_ProcessingJobPreviewModelResp, PJ_ProcessingJobBatchInfoResp, PJP_UnPlannedProcessingJobsResponse, PJP_PlannedProcessingJobsResponse, GlobalResponseObject, PJP_ProcessingJobPlanningRequest, PJP_LocationCodesRequest, PJP_StyleProductProcessingSerialReq, IPS_C_LocationCodeRequest, IPS_R_LocationJobsResponse, SewingJobPlanStatusEnum, PJP_PlanDateWiseJobsModel, PJP_LocationWiseJobsModel, PJP_PlannedProcessingJobsModel, PJP_UnPlannedProcessingJobsModel, SPS_C_ProcJobNumberRequest, TrimStatusEnum } from '@xpparel/shared-models';
import { GenericTransactionManager } from '../../database/typeorm-transactions';
import { SJobLinePlanRepo } from '../entities/repository/s-job-line-plan.repository';
import { ErrorResponse } from '@xpparel/backend-utils';
import { SJobLinePlanHistoryEntity } from '../entities/s-job-line-plan-history';
import { ProcessingJobsService } from './processing-jobs.service';
import { SJobLinePlanEntity } from '../entities/s-job-line-plan';

@Injectable()
export class ProcessingJobsPlanningService {
    constructor(
        private dataSource: DataSource,
        private poRepo: ProcessingOrderRepository,
        private poLineRepo: PoLineRepository,
        private poSubLineRepo: PoSubLineRepository,
        private poProductRepo: PoProductRepository,
        private poSubLineFeatures: ProductSubLineFeaturesRepository,
        private sJobLinePlanRepo: SJobLinePlanRepo,
        private jobsService: ProcessingJobsService
    ) { }


    /**
     * Service to get the All Unplanned processing jobs for the Given Style , Product , Processing Serial Info
     * Usually Calls from the UI for planning the un planned jobs to workstation
     * @param reqObj 
     * @param config 
     * @returns 
    */
    async getUnPlannedProcessingJobs(reqObj: PJP_StyleProductProcessingSerialReq): Promise<PJP_UnPlannedProcessingJobsResponse> {
        const { unitCode, companyCode, username, userId } = reqObj;
        const jobs = await this.sJobLinePlanRepo.find({ where: { unitCode: reqObj.unitCode, companyCode: reqObj.companyCode, processingSerial: reqObj.processingSerial, processType: reqObj.processingType, status: SewingJobPlanStatusEnum.OPEN } })
        if (!jobs.length) {
            throw new ErrorResponse(1, "Jobs not found for the requested data")
        }
        const unPlannedProcessingJobsModelArray: PJP_UnPlannedProcessingJobsModel[] = []
        for (const unplannedJobs of jobs) {
            const getReq = new SPS_C_ProcJobNumberRequest(unplannedJobs.jobNumber, unitCode, companyCode, null, unplannedJobs.jobNumber, true, true, false, false, false, false)
            const jobDetails = await this.jobsService.getJobInfoByJobNumber(getReq);
            if (!jobDetails.status) {
                throw new ErrorResponse(jobDetails.errorCode, jobDetails.internalMessage);
            };
            const actJobDetails = jobDetails.data[0];
            const unPlannedProcessingJobsModel = new PJP_UnPlannedProcessingJobsModel();
            unPlannedProcessingJobsModel.colorSizeQty = actJobDetails.colorSizeQty
            unPlannedProcessingJobsModel.jobFeatures = actJobDetails.jobFeatures;
            unPlannedProcessingJobsModel.jobNumber = unplannedJobs.jobNumber;
            unPlannedProcessingJobsModel.procSerial = unplannedJobs.processingSerial;
            unPlannedProcessingJobsModel.processType = unplannedJobs.processType;
            unPlannedProcessingJobsModel.productCode = actJobDetails.productCode;
            unPlannedProcessingJobsModel.quantity = actJobDetails.quantity;
            unPlannedProcessingJobsModelArray.push(unPlannedProcessingJobsModel);
        }
        return new PJP_UnPlannedProcessingJobsResponse(true, 11, 'Unplanned Jobs Retrieved Successfully', unPlannedProcessingJobsModelArray);
    }


    /**
     * Service to get the All Planned sewing jobs for the given Section code in order show the same jobs against to each location a
     * Usually calls from the UI to show the already planned jobs . 
     * Returns the jobs under Date + Location
     * @param reqObj 
     * @param config 
     * @returns 
    */
    async getPlannedProcessingJobs(reqObj: PJP_LocationCodesRequest): Promise<PJP_PlannedProcessingJobsResponse> {
        const { unitCode, companyCode } = reqObj;
        const pJP_LocationWiseJobsModelArray: PJP_LocationWiseJobsModel[] = [];

        for (const location of reqObj.locationCodes) {
            const jobs = await this.sJobLinePlanRepo.find({
                where: { unitCode, companyCode, locationCode: location, status: SewingJobPlanStatusEnum.IN_PROGRESS }
            });

            // Group jobs by planned date
            const jobsByDateMap = new Map<string, PJP_PlannedProcessingJobsModel[]>();

            const jobDetailPromises = jobs.map(async jobsPlanned => {
                const getReq = new SPS_C_ProcJobNumberRequest(
                    jobsPlanned.jobNumber,
                    unitCode,
                    companyCode,
                    null,
                    jobsPlanned.jobNumber,
                    true,
                    true,
                    false,
                    false,
                    false,
                    false
                );

                const jobDetails = await this.jobsService.getJobInfoByJobNumber(getReq);
                if (!jobDetails.status) {
                    throw new ErrorResponse(jobDetails.errorCode, jobDetails.internalMessage);
                }

                const actJobDetails = jobDetails.data[0];
                const plannedJob = new PJP_PlannedProcessingJobsModel();
                plannedJob.jobNumber = jobsPlanned.jobNumber;
                plannedJob.processType = jobsPlanned.processType;
                plannedJob.procSerial = jobsPlanned.processingSerial;
                plannedJob.productCode = actJobDetails.productCode;
                plannedJob.quantity = actJobDetails.quantity;
                plannedJob.colorSizeQty = actJobDetails.colorSizeQty;
                plannedJob.jobFeatures = actJobDetails.jobFeatures;
                plannedJob.totalSmv = 0;

                const dateKey = jobsPlanned.planInputDate.toDateString();
                if (!jobsByDateMap.has(dateKey)) {
                    jobsByDateMap.set(dateKey, []);
                }
                jobsByDateMap.get(dateKey)?.push(plannedJob);
            });

            await Promise.all(jobDetailPromises);

            const planDateWiseJobModel: PJP_PlanDateWiseJobsModel[] = Array.from(jobsByDateMap.entries()).map(
                ([dateStr, jobList]) => {
                    const dateWiseModel = new PJP_PlanDateWiseJobsModel();
                    dateWiseModel.plannedDate = dateStr;
                    dateWiseModel.processingJobsModel = jobList;
                    return dateWiseModel;
                }
            );

            const locationWiseModel = new PJP_LocationWiseJobsModel();
            locationWiseModel.locationCode = location;
            locationWiseModel.planDateWiseJobModel = planDateWiseJobModel;
            pJP_LocationWiseJobsModelArray.push(locationWiseModel);
        }

        return new PJP_PlannedProcessingJobsResponse(
            true,
            1,
            'Planned Processing Jobs received successfully',
            pJP_LocationWiseJobsModelArray
        );
    }


    /**
     * Service to update the location code against to job means planning
     * Usually calls from the UI after user plans the processing job into location
     * @param reqObj 
     * @param config 
     * @returns 
    */
    async planProcessingJobToLocation(reqObj: PJP_ProcessingJobPlanningRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {

            const jobs = await this.sJobLinePlanRepo.findOne({ where: { unitCode: reqObj.unitCode, companyCode: reqObj.companyCode, jobNumber: reqObj.jobNumber } })
            if (!jobs) {
                throw new ErrorResponse(1, "Job Number doesn't exists");
            };
            if (jobs.rawMaterialStatus == TrimStatusEnum.REQUESTED || jobs.itemSkuStatus == TrimStatusEnum.REQUESTED) {
                throw new ErrorResponse(0, 'Material already been requested you cannot change the location.')
            }
            await transManager.startTransaction();
            const statusNeedToUpdate = reqObj.locationCode ? SewingJobPlanStatusEnum.IN_PROGRESS : SewingJobPlanStatusEnum.OPEN;
            const locationCodeUpdate = reqObj.locationCode ? reqObj.locationCode : null
            await transManager.getRepository(SJobLinePlanEntity).update(
                { id: jobs.id }, // WHERE conditions
                { locationCode: locationCodeUpdate, updatedUser: reqObj.username, status: statusNeedToUpdate, planInputDate: reqObj.plannedDate } // Fields to update
            );

            const sJobJobPlanHistoryObj = new SJobLinePlanHistoryEntity();
            sJobJobPlanHistoryObj.companyCode = reqObj.companyCode
            sJobJobPlanHistoryObj.unitCode = reqObj.unitCode
            sJobJobPlanHistoryObj.createdUser = reqObj.username
            sJobJobPlanHistoryObj.itemSkuStatus = jobs.itemSkuStatus
            sJobJobPlanHistoryObj.jobNumber = reqObj.jobNumber
            sJobJobPlanHistoryObj.jobPriority = jobs.jobPriority
            sJobJobPlanHistoryObj.locationCode = reqObj.locationCode
            sJobJobPlanHistoryObj.planInputDate = reqObj.plannedDate;
            sJobJobPlanHistoryObj.processType = jobs.processType
            sJobJobPlanHistoryObj.processingSerial = sJobJobPlanHistoryObj.processingSerial
            sJobJobPlanHistoryObj.rawMaterialStatus = jobs.rawMaterialStatus
            sJobJobPlanHistoryObj.remarks = jobs.remarks
            sJobJobPlanHistoryObj.smv = jobs.smv
            sJobJobPlanHistoryObj.status = jobs.status
            sJobJobPlanHistoryObj.processingSerial = jobs.processingSerial;
            sJobJobPlanHistoryObj.processType = jobs.processType;

            const saveData = await transManager.getRepository(SJobLinePlanHistoryEntity).save(sJobJobPlanHistoryObj);
            await transManager.completeTransaction();
            return new GlobalResponseObject(true, 1, "Location updated successfully");

        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }
    }
}