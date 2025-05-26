import { CommonResponse, InsGetInspectionHeaderRollInfoResp, InsInspectionBasicInfoResponse, InsInspectionRequestsFilterRequest, InsInspectionTypeRequest, InsIrIdRequest, InsIrRollsResponse, InsPhIdRequest, InsRollBarcodeInspCategoryReq, RollsCheckListResponse } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { INSCommonAxiosService } from "../../common-axios-service";

export class FabricInspectionInfoService extends INSCommonAxiosService {

    private getUrlWithMainEndPoint(childUrl: string) {
        return '/fabric-inspection-info/' + childUrl;
    }

    async getInspectionDetailsForRequestId(req?: any, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<InsGetInspectionHeaderRollInfoResp> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getInspectionDetailsForRequestId'), req, config)
    }

    async getInspectionRequestBasicInfo(req?: InsInspectionTypeRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<InsInspectionBasicInfoResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getInspectionRequestBasicInfo'), req, config)
    }

    async getInspectionRequestRollsInfo(req?: InsIrIdRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<InsIrRollsResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getInspectionRequestRollsInfo'), req, config)
    }

    async getInspectionRequestBasicInfoByBatchCode(req?: InsInspectionRequestsFilterRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<InsInspectionBasicInfoResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getInspectionRequestBasicInfoByBatchCode'), req, config)
    }

    async getInspectionDetailForRollIdAndInspCategory(req?: InsRollBarcodeInspCategoryReq, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<InsGetInspectionHeaderRollInfoResp> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getInspectionDetailForRollIdAndInspCategory'), req, config)
    }

    async getCheckListPrintData(req?: InsPhIdRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<RollsCheckListResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getCheckListPrintData'), req, config)
    }

    async checkForShowInInventoryUpdate(req?: InsPhIdRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('checkForShowInInventoryUpdate'), req, config)
    }
}