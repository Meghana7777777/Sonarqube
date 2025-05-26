
import { FgWhHeaderIdReqDto, FgWhLinesResponseModel, FgWhReqHeaderDetailsResponse, FgWhReqHeaderFilterReq, FgWhSrIdPlIdsRequest, FgWhStageReq, FgWhStatusReq, PackJobsResponseForPackList, PKMSFgWhereHouseCreateDto, WhFloorPackListResp, WhFloorRequest, WhRequestDashboardInfoResp, WhRequestHeadResponse } from "@xpparel/shared-models";

import { AxiosRequestConfig } from "axios";
import { PKMSCommonAxiosService } from "../pkms-common-axios-service";

export class PKMSFgWarehouseService extends PKMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/fg-warehouse-req/' + childUrl;
    }

    async saveFgWhereHouseReq(req: PKMSFgWhereHouseCreateDto, config?: AxiosRequestConfig): Promise<PackJobsResponseForPackList> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('saveFgWhereHouseReq'), req, config);
    }

    async getFgWhHeaderReqDetails(req: FgWhReqHeaderFilterReq, config?: AxiosRequestConfig): Promise<FgWhReqHeaderDetailsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getFgWhHeaderReqDetails'), req, config);
    }

    async getFgWhInfoForGivenPackListIds(req: FgWhSrIdPlIdsRequest, config?: AxiosRequestConfig): Promise<WhRequestHeadResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getFgWhInfoForGivenPackListIds'), req, config);
    }

    async getWhFloorInfoForPackListIds(req: FgWhSrIdPlIdsRequest, config?: AxiosRequestConfig): Promise<WhFloorPackListResp> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getWhFloorInfoForPackListIds'), req, config);
    }

    async updateFgWhReqStage(req: FgWhStageReq, config?: AxiosRequestConfig): Promise<WhFloorPackListResp> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateFgWhReqStage'), req, config);
    }

    async updateFgWhReqApprovalStatus(req: FgWhStatusReq, config?: AxiosRequestConfig): Promise<WhFloorPackListResp> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateFgWhReqApprovalStatus'), req, config);
    }


    async getWhRequestDetailsForDashboard(req: WhFloorRequest, config?: AxiosRequestConfig): Promise<WhRequestDashboardInfoResp> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getWhRequestDetailsForDashboard'), req, config);
    }

    async getFgWhReqLines(req: FgWhHeaderIdReqDto, config?: AxiosRequestConfig): Promise<FgWhLinesResponseModel> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getFgWhReqLines'), req, config);
    }


} 