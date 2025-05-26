import { CutEligibilityInfoResp, GlobalResponseObject, JobBundleFgInfoResponse, JobNumberRequest, JobSewSerialReq, OslIdFgsSpsResponse, OslRefIdRequest, SewingJobBarcodeInfoResp, SewingJobBatchInfoResp, SewingJobConfirmedReqInfoForActualGenFeatureGroup, SewingJobFeatureGroupReq, SewingJobPreviewForActualGenFeatureGroup, SewingJobSummaryForSewingOrder, SewingJobSummaryForSewOrderResp, SewingOrderDetailsForGivenFeatureGroup, SewingOrderReq, SewJobGenReqForActualAndFeatureGroup, SewJobPreviewForFeatureGroupResp, SewOrderDetailForFeatureGroupResponse, SewSerialRequest } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { SPSCommonAxiosService } from "../sps-common-axios.service";


export class SewingJobGenActualService extends SPSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/sewing-job-generation/' + childUrl;
    }

    async getSewingJobSummaryForSewingOrder(reqModel: SewingOrderReq, config?: AxiosRequestConfig): Promise<SewingJobSummaryForSewOrderResp> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getSewingJobSummaryForSewingOrder'), reqModel, config);
    }

    async getSewingOrderDetailsForFeatureGroup(reqModel: SewingJobFeatureGroupReq, config?: AxiosRequestConfig): Promise<SewOrderDetailForFeatureGroupResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getSewingOrderDetailsForFeatureGroup'),reqModel,config);
    }

    async getSewingJobPreviewForActualGenFeatureGroup(reqModel: SewJobGenReqForActualAndFeatureGroup, config?: AxiosRequestConfig): Promise<SewJobPreviewForFeatureGroupResp> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getSewingJobPreviewForActualGenFeatureGroup'),reqModel,config);
    }

    async confirmAndSubmitSewingJob(reqModel: SewingJobConfirmedReqInfoForActualGenFeatureGroup, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('confirmAndSubmitSewingJob'),reqModel,config);
    }

    async getSewingJobBInfoBySewSerial(reqModel: SewSerialRequest, config?: AxiosRequestConfig): Promise<SewingJobBatchInfoResp> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getSewingJobBInfoBySewSerial'),reqModel,config);
    }

    async getBarcodeDetailsByJobNumber(reqModel: JobSewSerialReq, config?: AxiosRequestConfig): Promise<SewingJobBarcodeInfoResp> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getBarcodeDetailsByJobNumber'),reqModel,config);
    }

    async getCutPanelsInfoForJobNumber(reqModel: JobSewSerialReq, config?: AxiosRequestConfig): Promise<CutEligibilityInfoResp> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getCutPanelsInfoForJobNumber'),reqModel,config);
    }

    async getFgInfoByOSLRefIds(reqModel: OslRefIdRequest, config?: AxiosRequestConfig): Promise<OslIdFgsSpsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getFgInfoByOSLRefIds'),reqModel,config);
    }

    async getBundleInfoByJob(reqModel: JobNumberRequest, config?: AxiosRequestConfig): Promise<JobBundleFgInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getBundleInfoByJob'),reqModel,config);
    }
}   