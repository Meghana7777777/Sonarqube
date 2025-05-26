import { GlobalResponseObject, PackJobsByPackListIdsRequest, PackJobsResponseForPackList, PackMAterialRequest, PackMaterialResponse, PackMaterialSummaryResponse, PackMatReqID, PackMatReqModel, PK_MaterialRequirementDetailResp, PKMS_C_JobTrimReqIdRequest, PKMS_R_JobTrimResponse, WMS_C_IssuanceIdRequest } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { PKMSCommonAxiosService } from "../pkms-common-axios-service";

export class PackMaterialReqServices extends PKMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/pack-material-req/' + childUrl;
    }

    async getPackJobsForPackListIds(req: PackJobsByPackListIdsRequest, config?: AxiosRequestConfig): Promise<PackJobsResponseForPackList> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPackJobsForPackListIds'), req, config);
    }

    async createMaterialRequest(req: PackMatReqModel, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createMaterialRequest'), req, config);
    }

    async getBOMInfoForPackJobs(req: PackMatReqModel, config?: AxiosRequestConfig): Promise<PK_MaterialRequirementDetailResp> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getBOMInfoForPackJobs'), req, config);
    }



    async getPAckMaterialsByPackListID(req: PackMAterialRequest, config?: AxiosRequestConfig): Promise<PackMaterialResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPAckMaterialsByPackListID'), req, config)
    }

    async getPackMaterialSummaryDataById(req: PackMatReqID, config?: AxiosRequestConfig): Promise<PackMaterialSummaryResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPackMaterialSummaryDataById'), req, config)
    }
    async getRequestedTrimMaterialForReqId(reqObj: PKMS_C_JobTrimReqIdRequest, config?: AxiosRequestConfig): Promise<PKMS_R_JobTrimResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getRequestedTrimMaterialForReqId'), reqObj, config)
    }
    async approvePMRNo(req: PackMatReqID, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('approvePMRNo'), req, config)
    }

    async RejectPMRNo(req: any, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('RejectPMRNo'), req, config)
    }

    async updateIssuedPackMaterialFromWms(req: WMS_C_IssuanceIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateIssuedPackMaterialFromWms'), req, config);
    }
} 