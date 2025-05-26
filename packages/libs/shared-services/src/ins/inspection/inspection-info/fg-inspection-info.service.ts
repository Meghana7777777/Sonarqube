import { AxiosRequestConfig } from "axios";
import { INSCommonAxiosService } from "../../common-axios-service";
import { CommonResponse, GlobalResponseObject, InsGetInspectionHeaderRollInfoResp, InsIrIdRequest, InsPackListAndPoIdsReqDto, PKMSInsReqIdDto } from "@xpparel/shared-models";

export class FgInspectionInfoService extends INSCommonAxiosService {

    private getUrlWithMainEndPoint(childUrl: string) {
        return '/fg-inspection-info/' + childUrl;
    }

    async getFgInspectionDetailsForRequestId(req?: InsIrIdRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<InsGetInspectionHeaderRollInfoResp> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getFgInspectionDetailsForRequestId'), req, config)
    }

    async getInspectionMaterialPendingData(req?: InsPackListAndPoIdsReqDto, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getInspectionMaterialPendingData'), req, config)
    }
    async getInsCartonsSummary(req?: PKMSInsReqIdDto, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getInsCartonsSummary'), req, config)
    }

    async getPKMSInsCartonsData(req?: PKMSInsReqIdDto, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getPKMSInsCartonsData'), req, config)
    }
}