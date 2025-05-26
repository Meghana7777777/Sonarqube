import { Injectable } from '@nestjs/common';
import { SJobHeaderRepo } from '../entities/repository/s-job-header.repository';
import { SJobSubLineRepo } from '../entities/repository/s-job-sub-line.repository';
import { DocketGenerationServices } from '@xpparel/shared-services';
import { ErrorResponse } from '@xpparel/backend-utils';
import { DataSource } from 'typeorm';
import { SJobPreferencesRepo } from '../entities/repository/s-job-preference.repository';
import { SJobLineOperationsRepo } from '../entities/repository/s-job-line-operations';
import { SJobLinePlanRepo } from '../entities/repository/s-job-line-plan.repository';
import { BundleFgModel, JobBundleFgInfoModel, JobBundleFgInfoResponse, JobNumberRequest, OslIdFgsSpsModel, OslIdFgsSpsResponse, OslRefIdRequest } from '@xpparel/shared-models';
const util = require('util');
@Injectable()
export class SewingJobInfoServiceForMO {
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
    ) {

    }

    /**
     * Service to get bundle info by job
     * @param reqObj 
     * @returns 
    */
    async getBundleInfoByJob(reqObj: JobNumberRequest): Promise<JobBundleFgInfoResponse> {
        const {unitCode, companyCode, procSerial, jobNumber} = reqObj;
        // const jobFgInfo = await this.jobFg.getBundleWiseFgsByJobNumber(sewSerial, jobNumber, unitCode, companyCode);
        // if (!jobFgInfo.length) {
        //     throw new ErrorResponse(0, 'Fgs not found for the given job number');
        // };
        const jobFgs: number[] = [];
        const operationsInfo = await this.jobOperationsRepo.getDistinctOperationsByJobNo(jobNumber, unitCode, companyCode);
        // const bundleInfoForJob = jobFgInfo.map((bundleInfo) => {
        //     jobFgs.push(...bundleInfo.fgNumbers);
        //     return new BundleFgModel(bundleInfo.bundleNo, [new OslIdFgsSpsModel(bundleInfo.fgNumbers, sewSerial, bundleInfo.osl_ref_id)]);
        // });
        // const jobBundleFgInfo = new JobBundleFgInfoModel(reqObj.jobNumber, reqObj.jobNumber, jobFgs, bundleInfoForJob, jobFgInfo[0].job_group,  operationsInfo, jobFgs.length, sewSerial)
        // return new JobBundleFgInfoResponse(true, 0, 'job bundles retrieved', [jobBundleFgInfo])
        return null;
    }

    async getFgInfoByOSLRefIds(req: OslRefIdRequest): Promise<OslIdFgsSpsResponse> {
        const {unitCode, companyCode} = req;
        const oslRefIdsInfo: OslIdFgsSpsModel[] = [];
        for (const oslRefId of req.oslRefId) {
            // const fgInfo = await this.sewFgRepo.find({where: {oslRefId, unitCode, companyCode, isActive: true}, select: ['fgNumber', 'sewSerial']});
            // if (!fgInfo.length) {
            //     throw new ErrorResponse(0, 'Fg info not found fot the OSL ref Id' + oslRefId);
            // }
            // const fgs = fgInfo.map(fg => Number(fg.fgNumber));
            // const oslFgObj = new OslIdFgsSpsModel(fgs, fgInfo[0].sewSerial, oslRefId);
            // oslRefIdsInfo.push(oslFgObj);
            return null;
        }
        return new OslIdFgsSpsResponse(true, 0, 'Sewing Fg Info retrieved successfully for Given OSL ref Id', oslRefIdsInfo);
    }

}