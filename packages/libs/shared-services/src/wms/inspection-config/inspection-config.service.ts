import { GlobalResponseObject, InsFabInsConfigRequest, InsFabInsConfigResponse, InsSupplierCodeRequest, PackListIdRequest } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { WMSCommonAxiosService } from "../common-axios-service";

export class WMSInspectionConfigService extends WMSCommonAxiosService {

    private getUrlWithMainEndPoint(childUrl: string) {
        return '/inspection-config/' + childUrl;
    }

    async getFabInsConfigPLLevel(req?: InsSupplierCodeRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<InsFabInsConfigResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getFabInsConfigPLLevel'), req, config)
    }
    async saveFabInsConfigPLLevel(req?: InsFabInsConfigRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<InsFabInsConfigResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('saveFabInsConfigPLLevel'), req, config)
    }

    async isAllInsConfigurationsSaved(req?: PackListIdRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('isAllInsConfigurationsSaved'), req, config)
    }

}