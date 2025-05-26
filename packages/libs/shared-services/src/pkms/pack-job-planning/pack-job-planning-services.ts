import { CommonRequestAttrs, CommonResponse, PackingTableJobsResponse, PackJobPlanningRequest, PlanPackJobModel, CommonIdReqModal, PackJobsResponse, PoIdRequest, PoPackJobResponse } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { PKMSCommonAxiosService } from "../pkms-common-axios-service";

export class PackJobPlanningServices extends PKMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/job-planning/' + childUrl;
    }


    async getYetToPlanPackJobs(req: CommonIdReqModal, config?: AxiosRequestConfig): Promise<PackJobsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getYetToPlanPackJobs'), req, config);
    }

    async planPackJobToPackTable(req: PlanPackJobModel, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('planPackJobToPackTable'), req, config)
    }

    async unPlanPackJobRequestsFromPackTable(reqData: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('unPlanPackJobRequestsFromPackTable'), reqData, config)
    }

    async getPlannedPackJobRequestsOfPackTable(req: PackJobPlanningRequest, config?: AxiosRequestConfig): Promise<PackingTableJobsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPlannedPackJobRequestsOfPackTable'), req, config)
    }
    
    async getPackJobsForPo(req: PoIdRequest, config?: AxiosRequestConfig): Promise<PoPackJobResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPackJobsForPo'), req, config)
    }

}