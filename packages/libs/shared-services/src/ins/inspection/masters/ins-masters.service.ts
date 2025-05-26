
import { AxiosRequestConfig } from "axios";
import { INSCommonAxiosService } from "../../common-axios-service";
import { GlobalResponseObject, InsReasonsActivateRequest, InsReasonsCategoryRequest, InsReasonsCreateRequest, InsReasonsResponse, InsTypesRequest, InsTypesResponse } from "@xpparel/shared-models";
import { assignAndGetLoaingReqStatusForHeaders } from "../../../loading-helper";

export class InsMasterService extends INSCommonAxiosService {

    private getUrlWithMainEndPoint(childUrl: string) {
        return '/inspection-masters/' + childUrl;
    }

    async createInsType(req?: InsTypesRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('createInsType'), req, config)
    }

    async deleteInsType(req?: InsTypesRequest, config?: AxiosRequestConfig): Promise<InsTypesResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('deleteInsType'), req, config)
    }

    async updateInsType(req?: any, config?: AxiosRequestConfig): Promise<InsTypesResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('updateInsType'), req, config)
    }

    async getInsType(req?: InsTypesRequest, config?: AxiosRequestConfig): Promise<InsTypesResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('deleteInsType'), req, config)
    }

    async createReasons(reqModel: InsReasonsCreateRequest, config?: AxiosRequestConfig) {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('createReasons'), reqModel, config);
    }

    async ActivateDeactivateReasons(reqModel: InsReasonsActivateRequest, config?: AxiosRequestConfig) {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('ActivateDeactivateReasons'), reqModel, config);
    }

    async getAllReasonsData(reqModel: InsReasonsCategoryRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<InsReasonsResponse> {
        const modifiedConfig = assignAndGetLoaingReqStatusForHeaders(dontNeedLoadingSymbol, config);
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('insGetAllReasonsData'), reqModel, modifiedConfig);
    }

    async getReasonsAgainstCategory(req: InsReasonsCategoryRequest, config?: AxiosRequestConfig): Promise<InsReasonsResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getReasonsAgainstCategory'), req, config);
    }
}
