import { GlobalResponseObject, PJP_PlannedProcessingJobsResponse, PJP_ProcessingJobPlanningRequest, PJP_LocationCodesRequest, PJP_StyleProductProcessingSerialReq, PJP_UnPlannedProcessingJobsResponse, ProcessTypeEnum } from "@xpparel/shared-models";
import { SPSCommonAxiosService } from "../sps-common-axios.service";
import { AxiosRequestConfig } from "axios";

export class ProcessingJobsPlanningService extends SPSCommonAxiosService {
    private getURLwithMainEndPoint(childUrl: string) {
        return '/processing-jobs/' + childUrl;
    }


    /**
     * Service to get the All Unplanned processing jobs for the Given Style , Product , Processing Serial Info
     * Usually Calls from the UI for planning the un planned jobs to workstation
     * @param reqObj 
     * @param config 
     * @returns 
    */
    async getUnPlannedProcessingJobs(reqObj: PJP_StyleProductProcessingSerialReq, config?: AxiosRequestConfig): Promise<PJP_UnPlannedProcessingJobsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getUnPlannedProcessingJobs'), reqObj, config);
    }

    /**
     * Service to get the All Planned sewing jobs for the given Section code in order show the same jobs against to each location a
     * Usually calls from the UI to show the already planned jobs . 
     * Returns the jobs under Date + Location
     * @param reqObj 
     * @param config 
     * @returns 
    */
    async getPlannedProcessingJobs(reqObj: PJP_LocationCodesRequest, config?: AxiosRequestConfig): Promise<PJP_PlannedProcessingJobsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPlannedProcessingJobs'), reqObj, config);
    }

    /**
     * Service to update the location code against to job means planning
     * Usually calls from the UI after user plans the processing job into location
     * @param reqObj 
     * @param config 
     * @returns 
    */
    async planProcessingJobToLocation(reqObj: PJP_ProcessingJobPlanningRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('planProcessingJobToLocation'), reqObj, config);
    }

}