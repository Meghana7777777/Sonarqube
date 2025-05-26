import { GlobalResponseObject, PJP_PlannedProcessingJobsResponse, PJP_ProcessingJobPlanningRequest, PJP_LocationCodesRequest, PJP_StyleProductProcessingSerialReq, PJP_UnPlannedProcessingJobsResponse, SPS_C_ProcJobNumberRequest, SPS_R_JobInfoDetailedResponse } from "@xpparel/shared-models";
import { SPSCommonAxiosService } from "../sps-common-axios.service";
import { AxiosRequestConfig } from "axios";

export class IPSDashboardService extends SPSCommonAxiosService {
    private getURLwithMainEndPoint(childUrl: string) {
        return '/ips-dashboard/' + childUrl;
    }


    async getJobsInfoByLocation() {
        
    }

     // will be only called from the IPS
     async getJobInfoByJobNumber(req: SPS_C_ProcJobNumberRequest): Promise<SPS_R_JobInfoDetailedResponse> {
        return null;
    }




    

}