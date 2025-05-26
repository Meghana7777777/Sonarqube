import { CommonResponse, DateRequest, GlobalResponseObject, ProcessTypeEnum, QMS_BarcodeInfoResponse, QMS_BarcodeReq, QMS_CommonDatesReq, QMS_DefectRatesReqDto, QMS_DefectRatesResponse, QMS_LocVsQualitytypeDefectsResponse, QMS_ReportingStatsResponse, QualityCheckCreationRequest, QualityChecksInfoReq, QualityChecksInfoResponse } from "@xpparel/shared-models";
import { QMSCommonAxiosService } from "../common-axios.service";

export class QualityChecksService extends QMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/quality-checks/' + childUrl;
    }

    async getQualityChecksInfo(req?: QualityChecksInfoReq): Promise<QualityChecksInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getQualityChecksInfo'), req);
    }

    async getBarCodeInfoForBarcode(req: QMS_BarcodeReq): Promise<QMS_BarcodeInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getBarCodeInfoForBarcode'), req);
    }

    async createQualityCheck(req: QualityCheckCreationRequest): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createQualityCheck'), req);
    }

    async getDefectRates(req: QMS_DefectRatesReqDto): Promise<QMS_DefectRatesResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getDefectRates'), req);
    }

    async getDashboardHeaderStats(req: DateRequest): Promise<QMS_ReportingStatsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getDashboardHeaderStats'), req);
    }

    async getLocationAndQualityTypeWiseDefectQty(req: QMS_CommonDatesReq): Promise<QMS_LocVsQualitytypeDefectsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getLocationAndQualityTypeWiseDefectQty'), req);
    }


}
