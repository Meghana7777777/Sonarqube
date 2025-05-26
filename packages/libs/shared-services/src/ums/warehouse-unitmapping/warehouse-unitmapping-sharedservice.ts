import { WarehouseUnitmappingModel, WarehouseUnitmappingIdRequest, WarehouseUnitmappingResponse, WarehouseUnitmappingCreateRequest } from "@xpparel/shared-models";
import { UmsCommonAxiosService } from "../common-axios-service";
import { AxiosRequestConfig } from "axios";

export class WarehouseUnitmappingSharedService extends UmsCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/warehouse-unitmapping/' + childUrl;
    }

    async createWarehouseUnitmapping(reqModel: WarehouseUnitmappingCreateRequest, config?: AxiosRequestConfig): Promise<WarehouseUnitmappingResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createWarehouseUnitmapping'), reqModel, config);
    }

    async deleteWarehouseUnitmapping(reqModel: WarehouseUnitmappingIdRequest, config?: AxiosRequestConfig): Promise<WarehouseUnitmappingResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteWarehouseUnitmapping'), reqModel, config);
    }

    async getWarehouseUnitmapping(reqModel?: WarehouseUnitmappingIdRequest, config?: AxiosRequestConfig): Promise<WarehouseUnitmappingResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getWarehouseUnitmapping'), reqModel, config);
    }

    async updateWarehouseUnitmapping(reqModel: WarehouseUnitmappingModel, config?: AxiosRequestConfig): Promise<WarehouseUnitmappingResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateWarehouseUnitmapping'), reqModel, config);
    }

    async activeDeactiveWarehouseUnitmapping(reqModel: WarehouseUnitmappingIdRequest, config?: AxiosRequestConfig): Promise<WarehouseUnitmappingResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('activeDeactiveWarehouseUnitmapping'), reqModel, config);
    }
}