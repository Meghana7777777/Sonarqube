import { WarehouseCreateRequest, WarehouseIdRequest, WarehouseModel, WarehouseResponse } from "@xpparel/shared-models";
import { UmsCommonAxiosService } from "../common-axios-service";
import { AxiosRequestConfig } from "axios";

export class WarehouseSharedService extends UmsCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/warehouse/' + childUrl;
    }

    async createWarehouse(reqModel: WarehouseCreateRequest, config?: AxiosRequestConfig): Promise<WarehouseResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createWarehouse'), reqModel, config);
    }

    async deleteWarehouse(reqModel:  WarehouseIdRequest, config?: AxiosRequestConfig): Promise<WarehouseResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteWarehouse'), reqModel, config);
    }

    async getWarehouse(reqModel?: WarehouseIdRequest, config?: AxiosRequestConfig): Promise<WarehouseResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getWarehouse'), reqModel, config);
    }

    async updateWarehouse(reqModel: WarehouseIdRequest, config?: AxiosRequestConfig): Promise<WarehouseResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateWarehouse'), reqModel, config);
    }

    async activateDeactiveWarehouse(reqModel?: WarehouseIdRequest, config?: AxiosRequestConfig): Promise<WarehouseResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('activateDeactiveWarehouse'), reqModel, config);
    }
}