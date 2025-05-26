import { InsGetInspectionHeaderRollInfoResp, InsInspectionBasicInfoResponse, InsInspectionRequestsFilterRequest, InsInspectionTypeRequest, InsIrIdRequest, InsIrRollsResponse, InsRollBarcodeInspCategoryReq, InsSpoolBarcodeInspCategoryReq, ThreadInsInspectionRequestsFilterRequest, ThreadInsIrRollsResponse, ThreadInspectionBasicInfoResponse, ThreadInspectionHeaderRollInfoResp, ThreadInspectionTypeRequest } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { INSCommonAxiosService } from "../../common-axios-service";

export class ThreadInspectionInfoService extends INSCommonAxiosService {

    private getUrlWithMainEndPoint(childUrl: string) {
        return '/thread-inspection-info/' + childUrl;
    }

    async getThreadInspectionDetailsForRequestId(req?: InsIrIdRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<ThreadInspectionHeaderRollInfoResp> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getThreadInspectionDetailsForRequestId'), req, config)
    }

    async getThreadInspectionMaterialPendingData(req?: ThreadInspectionTypeRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<ThreadInspectionBasicInfoResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getThreadInspectionMaterialPendingData'), req, config)
    }

    async getInspectionRequestSpollsInfo(req?: InsIrIdRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<ThreadInsIrRollsResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getInspectionRequestSpollsInfo'), req, config)
    }


    async getInspectionDetailForSpoolIdAndInspCategory(req?: InsSpoolBarcodeInspCategoryReq, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<ThreadInspectionHeaderRollInfoResp> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getInspectionDetailForSpoolIdAndInspCategory'), req, config)
    }

    async getThreadInspectionRequestBasicInfoByLotCode(req?: ThreadInsInspectionRequestsFilterRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<ThreadInspectionBasicInfoResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getThreadInspectionRequestBasicInfoByLotCode'), req, config)
    }
}