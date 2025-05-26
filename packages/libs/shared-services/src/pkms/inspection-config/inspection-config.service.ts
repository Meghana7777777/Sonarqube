import { InsBuyerCodeRequest, InsFabInsConfigRequest, InsFabInsConfigResponse, InsFgInsConfigRequest, InsFgInsConfigResponse, InsSupplierCodeRequest } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { WMSCommonAxiosService } from "../../wms/common-axios-service";
import { PKMSCommonAxiosService } from "../pkms-common-axios-service";

export class PKMSInspectionConfigService extends PKMSCommonAxiosService {
    FgInsCreateExtRefRequest(arg0: InsBuyerCodeRequest) {
        throw new Error("Method not implemented.");
    }

    private getUrlWithMainEndPoint(childUrl: string) {
        return '/inspection-config/' + childUrl;
    }

    async getFgInsConfigPLLevel(req?: InsBuyerCodeRequest,  config?: AxiosRequestConfig): Promise<InsFgInsConfigResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getFgInsConfigPLLevel'), req, config)
    }
    async savePKMSFgInsConfigPLLevel(req?: InsFgInsConfigRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<InsFgInsConfigResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('savePKMSFgInsConfigPLLevel'), req, config)
    }

}