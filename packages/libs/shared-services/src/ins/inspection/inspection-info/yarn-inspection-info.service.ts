import { InsConeBarcodeInspCategoryReq, InsGetInspectionHeaderRollInfoResp, InsIrIdRequest, YarnInsInspectionRequestsFilterRequest, YarnInsIrRollsResponse, YarnInspectionBasicInfoResponse, YarnInspectionHeaderRollInfoResp, YarnInspectionTypeRequest } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { INSCommonAxiosService } from "../../common-axios-service";

export class YarnInspectionInfoService extends INSCommonAxiosService {

    private getUrlWithMainEndPoint(childUrl: string) {
        return '/yarn-inspection-info/' + childUrl;
    }

    async getInspectionMaterialPendingData(req?: YarnInspectionTypeRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<YarnInspectionBasicInfoResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getInspectionMaterialPendingData'), req, config)
    }

    async getInspectionRequestSpollsInfo(req?: InsIrIdRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<YarnInsIrRollsResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getInspectionRequestSpollsInfo'), req, config)
    } 


    async getYarnInspectionDetailsForRequestId(req?: InsIrIdRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<YarnInspectionHeaderRollInfoResp> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getYarnInspectionDetailsForRequestId'), req, config)
    }

      async getInspectionDetailForConeIdAndInspCategory(req?: InsConeBarcodeInspCategoryReq, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<YarnInspectionHeaderRollInfoResp> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getInspectionDetailForConeIdAndInspCategory'), req, config)
    }

      async getYarnInspectionRequestBasicInfoByLotCode(req?: YarnInsInspectionRequestsFilterRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<YarnInspectionBasicInfoResponse> {
            return await this.axiosPostCall(this.getUrlWithMainEndPoint('getYarnInspectionRequestBasicInfoByLotCode'), req, config)
        }


}