import { CartonSpecResponse, CommonIdReqModal, CommonRequestAttrs, CommonResponse, PackingSpecResponse, PackSerialNumberReqDto, PackSerialRequest, PackSpecDropDownResponse } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { PKMSCommonAxiosService } from "../../pkms-common-axios-service";

export class  PackingSpecServices extends PKMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/packing-spec/' + childUrl;
    }

    async createPackingSpec(req: any, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createPackingSpec'), req, config);
    }

    async getAllPackingSpecs(req: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<PackingSpecResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllPackingSpecs'), req, config);
    }

    async togglePackingSpec(req: CommonIdReqModal, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('togglePackingSpec'), req, config)
    }

    async getAllSpecDropdownData(req: PackSerialNumberReqDto, config?: AxiosRequestConfig): Promise<PackSpecDropDownResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllSpecDropdownData'), req, config)
    }

    async getCartonSpecData(req: CommonIdReqModal, config?: AxiosRequestConfig): Promise<CartonSpecResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getCartonSpecData'), req, config)
    }

}