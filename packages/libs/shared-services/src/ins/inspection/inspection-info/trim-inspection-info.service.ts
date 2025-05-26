import { InsBoxBarcodeInspCategoryReq, InsIrIdRequest, TrimInsInspectionRequestsFilterRequest, TrimInsIrRollsResponse, TrimInspectionBasicInfoResponse, TrimInspectionHeaderRollInfoResp, TrimInspectionTypeRequest } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { INSCommonAxiosService } from "../../common-axios-service";

export class TrimInspectionInfoService extends INSCommonAxiosService {

    private getUrlWithMainEndPoint(childUrl: string) {
        return '/trim-inspection-info/' + childUrl;
    }

    async getInspectionMaterialPendingData(req?: TrimInspectionTypeRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<TrimInspectionBasicInfoResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getInspectionMaterialPendingData'), req, config)
    }

    async getInspectionRequestSpollsInfo(req?: InsIrIdRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<TrimInsIrRollsResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getInspectionRequestSpollsInfo'), req, config)
    }


    async getTrimInspectionDetailsForRequestId(req?: InsIrIdRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<TrimInspectionHeaderRollInfoResp> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getTrimInspectionDetailsForRequestId'), req, config)
    }

    async getTrimInspectionRequestBasicInfoByLotCode(req?: TrimInsInspectionRequestsFilterRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<TrimInspectionBasicInfoResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getTrimInspectionRequestBasicInfoByLotCode'), req, config)
    }

    async getInspectionDetailForBoxIdAndInspCategory(req?: InsBoxBarcodeInspCategoryReq, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<TrimInspectionHeaderRollInfoResp> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getInspectionDetailForBoxIdAndInspCategory'), req, config)
    }




}