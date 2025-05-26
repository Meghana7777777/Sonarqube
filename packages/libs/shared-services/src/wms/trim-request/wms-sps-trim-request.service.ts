import { GlobalResponseObject, Rm_C_OutExtRefIdToGetAllocationsRequest, Rm_R_OutAllocationInfoAndBundlesResponse, SPS_C_JobTrimReqIdRequest, WhFabReqStatusRequest, WMS_C_IssuanceIdRequest, WMS_C_STrimIssuanceRequest, WMS_C_WhTrimRequestIdRequest, WMS_R_IssuanceIdItemsResponse, WMS_TRIM_R_JobRequestedTrimResponse } from "@xpparel/shared-models";
import { WMSCommonAxiosService } from "../common-axios-service";
import { AxiosRequestConfig } from "axios";

export class WmsSpsTrimRequestService extends WMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/wms-strim-request-handling/' + childUrl;
    }

    async allocateSTrimsForAJobByRequestId(req: SPS_C_JobTrimReqIdRequest, config?: AxiosRequestConfig): Promise<WMS_TRIM_R_JobRequestedTrimResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('allocateSTrimsForAJobByRequestId'), req, config);
    }

    async getAllocatedMaterialForWhSTrimsRequestId(req: WMS_C_WhTrimRequestIdRequest, config?: AxiosRequestConfig): Promise<WMS_TRIM_R_JobRequestedTrimResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllocatedMaterialForWhSTrimsRequestId'), req, config);
    }

    async getAllocatedSTrimMaterialForExtRefId(req: WMS_C_WhTrimRequestIdRequest, config?: AxiosRequestConfig): Promise<WMS_TRIM_R_JobRequestedTrimResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllocatedSTrimMaterialForExtRefId'), req, config);
    }

    async issueSTrimForWhReqId(req: WMS_C_STrimIssuanceRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('issueSTrimForWhReqId'), req, config);
    }

    async changeWhSTrimReqStatus(req: WhFabReqStatusRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('changeWhSTrimReqStatus'), req, config);
    }

    async getIssuedItemsUnderIssuanceId(req: WMS_C_IssuanceIdRequest, config?: AxiosRequestConfig): Promise<WMS_R_IssuanceIdItemsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getIssuedItemsUnderIssuanceId'), req, config);
    }

    async getRmAllocatedMaterialForRequestRefId(req: Rm_C_OutExtRefIdToGetAllocationsRequest, config?: AxiosRequestConfig): Promise<Rm_R_OutAllocationInfoAndBundlesResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getRmAllocatedMaterialForRequestRefId'), req, config);
    }
}


