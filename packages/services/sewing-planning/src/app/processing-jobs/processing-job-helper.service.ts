import { Injectable } from '@nestjs/common';
import { SJobHeaderRepo } from '../entities/repository/s-job-header.repository';
import { SJobSubLineRepo } from '../entities/repository/s-job-sub-line.repository';
import { DocketGenerationServices, FgCreationService, OpReportingService } from '@xpparel/shared-services';
import { ErrorResponse } from '@xpparel/backend-utils';
import { DataSource } from 'typeorm';
import { SJobPreferencesRepo } from '../entities/repository/s-job-preference.repository';
import { SJobLineOperationsRepo } from '../entities/repository/s-job-line-operations';
import { SJobLinePlanRepo } from '../entities/repository/s-job-line-plan.repository';
import { BundleFgModel, GlobalResponseObject, JobBundleFgInfoModel, JobBundleFgInfoResponse, JobNumberRequest, OslIdFgsSpsModel, OslIdFgsSpsResponse, OslRefIdRequest, ProcessingOrderInfoRequest, ProcessTypeEnum, PTS_C_TranLogIdPublishAckRequest, PTS_C_TranLogIdRequest, PTS_R_TranLogIdInfoModel, PtsExtSystemNamesEnum } from '@xpparel/shared-models';
const util = require('util');


// NOTE: This service is only for external service communications
@Injectable()
export class ProcessingJobHelperService {

    constructor(
        private dataSource: DataSource,
        private opRepService: OpReportingService,
        private ptsFgCreationService: FgCreationService
    ) {

    }

    // Called after the bundle / job reporting for any given job under whole SPS
    async getTranLogInfoForTranIds(tranIds: number[], companyCode: string, unitCode: string): Promise<PTS_R_TranLogIdInfoModel[]> {
        const req = new PTS_C_TranLogIdRequest(null, unitCode, companyCode, 0, tranIds);
        // get the tran log info from the PTS
        const tranLogInfoRes = await this.opRepService.getReportedInfoForTranIds(req);
        if(!tranLogInfoRes.status) {
            throw new ErrorResponse(0, `PTS says : ${tranLogInfoRes.internalMessage} `);
        }
        console.log(tranLogInfoRes);
        return tranLogInfoRes.data;
    }

    async sendTranIdProcessedAckToPts(tranIds: number[], companyCode: string, unitCode: string, username: string): Promise<boolean> {
        const req = new PTS_C_TranLogIdPublishAckRequest(username, unitCode, companyCode, 0, tranIds, PtsExtSystemNamesEnum.SPS);
        // get the tran log info from the PTS
        const tranLogInfoRes = await this.opRepService.updateExtSystemAckStatusForTranLogId(req);
        if(!tranLogInfoRes.status) {
            throw new ErrorResponse(0, `PTS says : ${tranLogInfoRes.internalMessage} `);
        }
        return true;
    }

    async triggerPopulateJobsOfProcSerialToPts(procSerial: number, procType: ProcessTypeEnum, companyCode: string, unitCode: string, username: string ): Promise<boolean> {
        try {
            const m1 = new ProcessingOrderInfoRequest(username, unitCode, companyCode, 0, procSerial, procType, false, false, false, false, false, false, false, false, false);
            const res = await this.ptsFgCreationService.triggerMapJobsForProcSerial(m1);
            if(!res.status) {
                throw new ErrorResponse(0, `PTS Says : ${res.internalMessage}`);
            }
            return true;
        } catch (error) {
            throw error;
        }
    }

    async triggerDeleteJobsOfProcSerialToPts(procSerial: number, procType: ProcessTypeEnum, companyCode: string, unitCode: string, username: string ): Promise<boolean> {
        try {
            const m1 = new ProcessingOrderInfoRequest(username, unitCode, companyCode, 0, procSerial, procType, false, false, false, false, false, false, false, false, false);
            const res = await this.ptsFgCreationService.deleteJobNumbersForProcSerial(m1);
            if(!res.status) {
                throw new ErrorResponse(0, `PTS Says : ${res.internalMessage}`);
            }
            return true;
        } catch (error) {
            throw error;
        }
    } 
}
