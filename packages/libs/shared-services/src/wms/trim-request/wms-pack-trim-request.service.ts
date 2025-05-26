import { GlobalResponseObject, PKMS_C_JobTrimReqIdRequest, WhFabReqStatusRequest, WMS_C_IssuanceIdRequest, WMS_C_PTrimIssuanceRequest, WMS_C_WhTrimRequestIdRequest, WMS_R_IssuanceIdItemsResponse, WMS_TRIM_R_JobRequestedTrimResponse } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { WMSCommonAxiosService } from "../common-axios-service";

// We have to discuss on this
export class WmsPackTrimRequestService extends WMSCommonAxiosService {

     private getURLwithMainEndPoint(childUrl: string) {
          return '/wms-pack-trim-request-handling/' + childUrl;
     }

     async allocatePackTrimsByRequestId(req: PKMS_C_JobTrimReqIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
          return await this.axiosPostCall(this.getURLwithMainEndPoint('allocatePackTrimsByRequestId'), req, config);
     }


     async getAllocatedPackMaterialForWhTrimsRequestId(req: WMS_C_WhTrimRequestIdRequest, config?: AxiosRequestConfig): Promise<WMS_TRIM_R_JobRequestedTrimResponse> {
          return await this.axiosPostCall(this.getURLwithMainEndPoint('allocateKnitMaterialByRequestId'), req, config);
     }

     async getAllocatedPackMaterialForExtRefId(req: PKMS_C_JobTrimReqIdRequest, config?: AxiosRequestConfig): Promise<WMS_TRIM_R_JobRequestedTrimResponse> {
          return await this.axiosPostCall(this.getURLwithMainEndPoint('allocateKnitMaterialByRequestId'), req, config);
     }

     async changeWhPTrimReqStatus(req: WhFabReqStatusRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
          return await this.axiosPostCall(this.getURLwithMainEndPoint('changeWhPTrimReqStatus'), req, config);
     }

     async issuePTrimForWhReqId(req: WMS_C_PTrimIssuanceRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
          return await this.axiosPostCall(this.getURLwithMainEndPoint('issuePTrimForWhReqId'), req, config);
     }
     async getIssuedItemsUnderIssuanceId(req: WMS_C_IssuanceIdRequest, config?: AxiosRequestConfig): Promise<WMS_R_IssuanceIdItemsResponse> {
          return await this.axiosPostCall(this.getURLwithMainEndPoint('getIssuedItemsUnderIssuanceId'), req, config);
     }
}


