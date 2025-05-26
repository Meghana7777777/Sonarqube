import { ProcessTypeCreateRequest, ProcessTypeIdRequest, ProcessTypeModel, ProcessTypeResponse } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { OMSCommonAxiosService } from "../oms-common-axios-service";

export class ProcessTypeSharedService extends OMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/processType/' + childUrl;
    }

    async createProcessType(reqModel: ProcessTypeCreateRequest, config?: AxiosRequestConfig): Promise<ProcessTypeResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createProcessType'), reqModel, config);
    }

    async deleteProcessType(reqModel: ProcessTypeIdRequest, config?: AxiosRequestConfig): Promise<ProcessTypeResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteProcessType'), reqModel, config);
    }

    async getAllProcessType(reqModel?: ProcessTypeIdRequest, config?: AxiosRequestConfig): Promise<ProcessTypeResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllProcessType'), reqModel, config);
    }

    async activateDeactivateProcessType(reqModel?: ProcessTypeIdRequest, config?: AxiosRequestConfig): Promise<ProcessTypeResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('activateDeactivateProcessType'), reqModel, config);
    }

    async updateImagePath(reqModel?: FormData, config?: AxiosRequestConfig): Promise<ProcessTypeResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateImagePath'), reqModel, config);
    }

}
