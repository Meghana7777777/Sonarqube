import { GlobalResponseObject, KJ_KnitJobLocPlanRequest, KJ_locationCodeRequest, KJ_LocationCodesRequest, KJ_LocationCodeWiseQtyResponse, KJ_LocationKnitJobsResponse } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { KMSCommonAxiosService } from "../kms-common-axios-service";

export class KnittingJobPlanningService extends KMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/knitting-jobs-planning/' + childUrl;
    }

    

    /**
     * Service to plan knit jobs to location
     * @param reqObj 
     * @param config 
     * @returns 
    */
    async planKnitJobsToLocation(reqObj: KJ_KnitJobLocPlanRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('planKnitJobsToLocation'), reqObj, config);
    }


    /**
     * Service to get knit jobs information for given location
     * @param reqObj 
     * @param config 
     * @returns 
    */
    async getKnitJobsForGivenLocation(reqObj: KJ_locationCodeRequest, config?: AxiosRequestConfig): Promise<KJ_LocationKnitJobsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getKnitJobsForGivenLocation'), reqObj, config);
    }


    async getPlannedQtyForGivenLocation(reqObj: KJ_LocationCodesRequest, config?: AxiosRequestConfig): Promise<KJ_LocationCodeWiseQtyResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPlannedQtyForGivenLocation'), reqObj, config);
    }




}