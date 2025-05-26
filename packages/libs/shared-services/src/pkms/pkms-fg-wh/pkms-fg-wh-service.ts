
import { FgWhHeaderIdReqDto, FgWhLinesResponseModel, FgWhReqHeaderDetailsResponse, FgWhReqHeaderFilterReq, FgwhSecurityUpdateReq, FgWhSrIdPlIdsRequest, FgWhStageReq, FgWhStatusReq, PackJobsResponseForPackList, PKMSFgWhereHouseCreateDto, WhFloorPackListResp, WhFloorRequest, WhRequestDashboardInfoResp, WhRequestHeadResponse, CartonBarcodeRequest, CartonHeadInfoResponse, GlobalResponseObject, FgwhPackListIdsResponse, CartonBarcodeLocationRequest, CommonResponse, PKMSFgWhReqIdDto, PKMSWhCodeReqDto, FgWhReportResponseModel, PKMSPackJobIdReqDto, PKMSFgWhReqNoResponseModel, PKMSReqItemTruckMapCreateDto, CartonBarCodesReqDto, UpdateFgWhOurReqDto } from "@xpparel/shared-models";


import { AxiosRequestConfig } from "axios";
import { PKMSCommonAxiosService } from "../pkms-common-axios-service";

export class PKMSFgWarehouseService extends PKMSCommonAxiosService {


    private getURLwithMainEndPoint(childUrl: string) {
        return '/fg-warehouse-req/' + childUrl;
    }

    async saveFgWhereHouseReq(req: PKMSFgWhereHouseCreateDto, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
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

    async updateFgWhReqRejectedStatus(req: FgWhStatusReq, config?: AxiosRequestConfig): Promise<WhFloorPackListResp> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateFgWhReqRejectedStatus'), req, config);
    }


    async getWhRequestDetailsForDashboard(req: WhFloorRequest, config?: AxiosRequestConfig): Promise<WhRequestDashboardInfoResp> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getWhRequestDetailsForDashboard'), req, config);
    }

    async getFgWhReqLines(req: FgWhHeaderIdReqDto, config?: AxiosRequestConfig): Promise<FgWhLinesResponseModel> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getFgWhReqLines'), req, config);
    }

    async updateSecurityDetails(req: FgwhSecurityUpdateReq, config?: AxiosRequestConfig): Promise<WhFloorPackListResp> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateSecurityDetails'), req, config);
    }

    async getPackListIdsForHeaderReqId(req: FgWhHeaderIdReqDto, config?: AxiosRequestConfig): Promise<FgwhPackListIdsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPackListIdsForHeaderReqId'), req, config);
    }


    async FgWarehouseInBarcodeFgIn(req: CartonBarcodeRequest, config?: AxiosRequestConfig): Promise<CartonHeadInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('FgWarehouseInBarcodeFgIn'), req, config);
    }

    async FgWarehouseInBarcodeFgOut(req: CartonBarcodeRequest, config?: AxiosRequestConfig): Promise<CartonHeadInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('FgWarehouseInBarcodeFgOut'), req, config);
    }

    async FgWarehouseInBarcodeLocationOut(req: CartonBarcodeRequest, config?: AxiosRequestConfig): Promise<CartonHeadInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('FgWarehouseInBarcodeLocationOut'), req, config);
    }


    async FgWarehouseInBarcodeLocationMapping(req: CartonBarcodeLocationRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('FgWarehouseInBarcodeLocationMapping'), req, config);
    }

    async getCountAgainstCurrentStage(req: FgWhReqHeaderFilterReq, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getCountAgainstCurrentStage'), req, config);
    }

    async startFgInReqSession(req: PKMSFgWhReqIdDto, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('startFgInReqSession'), req, config);
    }

    async getWhReqReport(req: PKMSWhCodeReqDto, config?: AxiosRequestConfig): Promise<FgWhReportResponseModel> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getWhReqReport'), req, config);
    }

    async getFgReqNoAgainstToPackJobNo(req: PKMSPackJobIdReqDto, config?: AxiosRequestConfig): Promise<PKMSFgWhReqNoResponseModel> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getFgReqNoAgainstToPackJobNo'), req, config);
    }

    async savePkmsItemRequestTruckMap(req: PKMSReqItemTruckMapCreateDto, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('savePkmsItemRequestTruckMap'), req, config);
    }

    async getFgWareHouseIdsByCartons(req: CartonBarCodesReqDto, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getFgWareHouseIdsByCartons'), req, config);
    }

    async updateFgWareHouseRejected(req: UpdateFgWhOurReqDto, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateFgWareHouseRejected'), req, config);
    }

}    