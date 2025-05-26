import { InsBuyerCodeRequest, InsFabInsConfigRequest, InsFabInsConfigResponse, InsFgInsConfigRequest, InsFgInsConfigResponse, InsSupplierCodeRequest, InsThreadInsConfigRequest, InsThreadInsConfigResponse, InsTrimInsConfigRequest, InsTrimInsConfigResponse, InsYarnInsConfigRequest, InsYarnInsConfigResponse } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { INSCommonAxiosService } from "../../common-axios-service";

export class InspectionConfigService extends INSCommonAxiosService {

    private getUrlWithMainEndPoint(childUrl: string) {
        return '/inspection-config/' + childUrl;
    }

    async saveFabInsConfig(req?: InsFabInsConfigRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<InsFabInsConfigResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('saveFabInsConfig'), req, config)
    }

    async getFabInsConfig(req?: InsSupplierCodeRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<InsFabInsConfigResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getFabInsConfig'), req, config)
    }
    
    async saveFgInsConfig(req?: InsFgInsConfigRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<InsFgInsConfigResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('saveFgInsConfig'), req, config)
    }

    async saveFgInsConfigPLLevel(req?: InsFgInsConfigRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<InsFgInsConfigResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('saveFgInsConfigPLLevel'), req, config)
    }

    async getFgInsConfig(req?: InsBuyerCodeRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<InsFgInsConfigResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getFgInsConfig'), req, config)
    } 

    async getFgInsConfigPLLevel(req?: InsBuyerCodeRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<InsFgInsConfigResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getFgInsConfigPLLevel'), req, config)
    }

    async saveTrimInsConfig(req?: InsTrimInsConfigRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<InsTrimInsConfigResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('saveTrimInsConfig'), req, config)
    }

    async getTrimInsConfig(req?: InsSupplierCodeRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<InsTrimInsConfigResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getTrimInsConfig'), req, config)
    }

    async saveThreadInsConfig(req?: InsThreadInsConfigRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<InsThreadInsConfigResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('saveThreadInsConfig'), req, config)
    }

    async getThreadInsConfig(req?: InsSupplierCodeRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<InsThreadInsConfigResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getThreadInsConfig'), req, config)
    }

    async saveYarnInsConfig(req?: InsYarnInsConfigRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<InsYarnInsConfigResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('saveYarnInsConfig'), req, config)
    }

    async getYarnInsConfig(req?: InsSupplierCodeRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<InsYarnInsConfigResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getYarnInsConfig'), req, config)
    }

}