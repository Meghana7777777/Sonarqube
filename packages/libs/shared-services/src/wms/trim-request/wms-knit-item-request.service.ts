import { GlobalResponseObject, KMS_C_JobMainMaterialReqIdRequest, WhFabReqStatusRequest, WMS_C_IssuanceIdRequest, WMS_C_KnitMaterialIssuanceRequest, WMS_C_WhKnitMaterialRequestIdRequest, WMS_MAINMAT_R_JobRequestedMainMatResponse, WMS_R_IssuanceIdItemsResponse } from "@xpparel/shared-models";
import { WMSCommonAxiosService } from "@xpparel/shared-services";
import { AxiosRequestConfig } from "axios";

export class WmsKnitItemRequestService extends WMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/wms-knit-request/' + childUrl;
    }


    async allocateKnitMaterialByRequestId(req: KMS_C_JobMainMaterialReqIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('allocateKnitMaterialByRequestId'), req, config);
    }

    async getAllocatedKnitMaterialForWhRequestId(req: WMS_C_WhKnitMaterialRequestIdRequest, config?: AxiosRequestConfig): Promise<WMS_MAINMAT_R_JobRequestedMainMatResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllocatedKnitMaterialForWhRequestId'), req, config);
    }

    async getAllocatedKnitMaterialForExtRefId(req: KMS_C_JobMainMaterialReqIdRequest, config?: AxiosRequestConfig): Promise<WMS_MAINMAT_R_JobRequestedMainMatResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllocatedKnitMaterialForExtRefId'), req, config);
    }

    async issueKnitMaterialForWhReqId(req: WMS_C_KnitMaterialIssuanceRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('issueKnitMaterialForWhReqId'), req, config);
    }

    async changeWhYarnReqStatus(req: WhFabReqStatusRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('changeWhYarnReqStatus'), req, config);
    }

    async getIssuedItemsUnderIssuanceId(req: WMS_C_IssuanceIdRequest, config?: AxiosRequestConfig): Promise<WMS_R_IssuanceIdItemsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getIssuedItemsUnderIssuanceId'), req, config);
    }
}


