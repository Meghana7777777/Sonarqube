
import {  DowntimeRequest, DowntimeResponseModel, DowntimeUpdateRequest, GlobalResponseObject } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { SPSCommonAxiosService } from "../sps-common-axios.service";

export class DowntimeSharedService extends SPSCommonAxiosService {
    private getURLwithMainEndPoint(childUrl: string) {
        return '/downtime/' + childUrl;
    }

    async createDownTime(requestModel: DowntimeRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createDownTime'), requestModel, config)
    }
   

    async updateDowntime( requestModel: DowntimeUpdateRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateDowntime'),requestModel,config)
    }

}