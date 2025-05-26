import { CommonIdReqModal, CommonRequestAttrs, CommonResponse, ItemsResponse, ItemsTypeModel, MaterialReqModel, PackSerialNumberReqDto } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { PKMSCommonAxiosService } from "../../pkms-common-axios-service";

export class ItemsServices extends PKMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/items/' + childUrl;
    }

    async createItems(req: ItemsTypeModel[], config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createItems'), req, config);
    }

    async getAllItems(req: MaterialReqModel, config?: AxiosRequestConfig): Promise<ItemsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllItems'), req, config);
    }

    async toggleItems(req: CommonIdReqModal, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('toggleItems'), req, config)
    }

    async getItemsToPackingSpec(req: MaterialReqModel, config?: AxiosRequestConfig): Promise<ItemsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getItemsToPackingSpec'), req, config)
    }

    async getUnMappedItemsToSpecByPo(req: PackSerialNumberReqDto, config?: AxiosRequestConfig): Promise<ItemsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getUnMappedItemsToSpecByPo'), req, config)
    }

}
