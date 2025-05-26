import { CommonIdReqModal, CommonRequestAttrs, CommonResponse, MaterialTypeRequestModel, MaterialTypesResponse, WareHouseModel, WareHouseResponse } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { PKMSCommonAxiosService } from "../../pkms-common-axios-service";

export class WareHouseService extends PKMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/warehouse/' + childUrl;
    }

    async createWareHouse(req: WareHouseModel, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createWareHouse'), req, config);
    }

    async getAllWareHouse(req: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<WareHouseResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllWareHouse'), req, config);
    }

    async getWareHouseDropDown(req: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<WareHouseResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getWareHouseDropDown'), req, config);
    }

    async toggleWareHouse(req: CommonIdReqModal, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('toggleWareHouse'), req, config)
    }

    async getWareHouseToRacks(req: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getWareHouseToRacks'), req, config)
    }

    async getWareHouseDropDownToRacks(req: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getWareHouseDropDownToRacks'), req, config)
    }
}