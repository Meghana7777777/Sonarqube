import { ItemCodesRequest, ItemCreateRequest, ItemIdRequest, ItemResponse } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { OMSCommonAxiosService } from "../../oms-old/oms-common-axios-service";

export class ItemSharedService extends OMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/item/' + childUrl;
    }

    async createItem(reqModel: ItemCreateRequest, config?: AxiosRequestConfig): Promise<ItemResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createItem'), reqModel, config);
    }

    async deleteItem(reqModel: ItemIdRequest, config?: AxiosRequestConfig): Promise<ItemResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteItem'), reqModel, config);
    }

    async getAllItem(reqModel: ItemIdRequest, config?: AxiosRequestConfig): Promise<ItemResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllItem'), reqModel, config);
    }

    async activateDeactivateItem(reqModel: ItemIdRequest, config?: AxiosRequestConfig): Promise<ItemResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('activateDeactivateItem'), reqModel, config);
    }

    async getBomItemByItemCode(reqModel: ItemIdRequest, config?: AxiosRequestConfig): Promise<ItemResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getBomItemByItemCode'), reqModel, config);
    }

    async checkAndSaveItems(reqModel: ItemCreateRequest, config?: AxiosRequestConfig): Promise<ItemResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('checkAndSaveItems'), reqModel, config);
    }

    async getItemNamesOfItemCodes(reqModel: ItemCodesRequest, config?: AxiosRequestConfig): Promise<ItemResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getItemNamesOfItemCodes'), reqModel, config);
    }
}