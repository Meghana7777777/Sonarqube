import { GlobalResponseObject, IpsBarcodeDetailsForQualityResultsResponse, MoOperationReportedQtyInfoResponse, MoOpSequenceInfoResponse, MoProductColorReq, MoPslIdProcessTypeReq, P_LocationCodeRequest, PTS_C_BundleReportingRequest, PTS_C_OperatorIdRequest, PTS_C_ProcTypeBundleBarcodeRequest, PTS_C_TranLogIdPublishAckRequest, PTS_C_TranLogIdRequest, PTS_R_BundleScanResponse, PTS_R_ProcTypeBundleCompletedQtyResponse, PTS_R_TranLogIdInfoResponse } from '@xpparel/shared-models';
import { AxiosRequestConfig } from 'axios';
import { PTSCommonAxiosService } from '../pts-common-axios.service';
import { PTS_C_QmsInspectionLogRequest } from '../qms';
import { assignAndGetLoaingReqStatusForHeaders } from '../../loading-helper';


export class OpReportingService extends PTSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/op-reporting/' + childUrl;
    }

    async reportBundleForAnOp(reqModel: PTS_C_BundleReportingRequest, config?: AxiosRequestConfig): Promise<PTS_R_BundleScanResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('reportBundleForAnOp'), reqModel, config);
    }

    async updateExtSystemAckStatusForTranLogId(reqModel: PTS_C_TranLogIdPublishAckRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateExtSystemAckStatusForTranLogId'), reqModel, config);
    }

    async getReportedInfoForTranIds(reqModel: PTS_C_TranLogIdRequest, config?: AxiosRequestConfig): Promise<PTS_R_TranLogIdInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getReportedInfoForTranIds'), reqModel, config);
    }

    async getOperatorLastBundleInfo(reqModel: PTS_C_OperatorIdRequest, config?: AxiosRequestConfig): Promise<PTS_R_BundleScanResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getOperatorLastBundleInfo'), reqModel, config);
    }

    async logQualityReporting(reqModel: PTS_C_QmsInspectionLogRequest, config?: AxiosRequestConfig): Promise<PTS_R_BundleScanResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('logQualityReporting'), reqModel, config);
    }

    async getQualityInfoForGivenLocationCode(reqModel: P_LocationCodeRequest, config?: AxiosRequestConfig): Promise<IpsBarcodeDetailsForQualityResultsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getQualityInfoForGivenLocationCode'), reqModel, config);
    }
    
    async getOpSequenceForGiveMoPRoductFgColor(reqModel: MoProductColorReq, config?: AxiosRequestConfig): Promise<MoOpSequenceInfoResponse> {
        const modifiedConfig = assignAndGetLoaingReqStatusForHeaders(true, config);
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getOpSequenceForGiveMoPRoductFgColor'), reqModel, modifiedConfig);
    }

    async getQtyInfoForGivenPslIdAndProcType(reqModel: MoPslIdProcessTypeReq, config?: AxiosRequestConfig): Promise<MoOperationReportedQtyInfoResponse> {
        const modifiedConfig = assignAndGetLoaingReqStatusForHeaders(true, config);
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getQtyInfoForGivenPslIdAndProcType'), reqModel, modifiedConfig);
    }

    async getProcessTypeCompletedQtyForGivenPoProdColBundles(reqModel: PTS_C_ProcTypeBundleBarcodeRequest, config?: AxiosRequestConfig): Promise<PTS_R_ProcTypeBundleCompletedQtyResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getProcessTypeCompletedQtyForGivenPoProdColBundles'), reqModel, config);
    }
    
}