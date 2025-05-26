import { CommonIdReqModal, CommonRequestAttrs, CommonResponse, PackTypeReqModel, PackTypesResponse } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { PKMSCommonAxiosService } from "../../pkms-common-axios-service";

export class PackTypeService extends PKMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/pack-type/' + childUrl;
    }

    async createPackType(req: PackTypeReqModel, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createPackType'), req, config);
    }

    async getAllPackTypes(req: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<PackTypesResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllPackTypes'), req, config);
    }

    async getAllPackTypesDropDown(req: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<PackTypesResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllPackTypesDropDown'), req, config);
    }

    async togglePackType(req: CommonIdReqModal, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('togglePackType'), req, config)
    }

    async getPacksToItems(config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPacksToItems'), config)
    }
}