import { UnitsCreateRequest, UnitsIdRequest, UnitsModel, UnitsResponse } from "@xpparel/shared-models";
import { UmsCommonAxiosService } from "../common-axios-service";
import { AxiosRequestConfig } from "axios";

export class UnitsSharedService extends UmsCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/units/' + childUrl;
    }

    async createUnits(reqModel: UnitsCreateRequest, config?: AxiosRequestConfig): Promise<UnitsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createUnits'), reqModel, config);
    }

    async deleteUnits(reqModel: UnitsIdRequest, config?: AxiosRequestConfig): Promise<UnitsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteUnits'), reqModel, config);

    }

    async getUnits(reqModel?: UnitsIdRequest, config?: AxiosRequestConfig): Promise<UnitsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getUnits'), reqModel, config);
    }

    async updateUnits(reqModel?: UnitsIdRequest, config?: AxiosRequestConfig): Promise<UnitsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateUnits'), reqModel, config);
    }

    async activeDeactiveUnits(reqModel?: UnitsIdRequest, config?: AxiosRequestConfig): Promise<UnitsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('activeDeactiveUnits'), reqModel, config);
    }
}