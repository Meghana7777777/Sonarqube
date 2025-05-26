import { DeleteSewingJobsRequest, GlobalResponseObject, JobBundleFgInfoResponse, JobNumberRequest, JobOpUpdateRequest, JobSewSerialReq, PanelReqForJobInfoResp, PanelRequestCreationModel, SewingJobBarcodeInfoResp, SewingJobFeatureGroupReq, SewingJobOperationWiseSummaryResponse, SewingJobPreviewModelResp, SewingJobPropsResp, SewingJobSizeWiseSummaryResponse, SewingJobSummaryForSewOrderResp, SewJobGenReqForBgMOAndFeatureGroup, SewJobSummaryForFeatureGroupResp, SewSerialBundleGroupReq, SewSerialProcessTypeReq, SewSerialRequest } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { SPSCommonAxiosService } from "../sps-common-axios.service";


export class SewingJobGenMOService extends SPSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/sewing-job-generation-for-mo/' + childUrl;
    }

    async getSewingJobSummaryForSewingOrderAndBundleGroup(reqModel: SewSerialBundleGroupReq, config?: AxiosRequestConfig): Promise<SewingJobSummaryForSewOrderResp> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getSewingJobSummaryForSewingOrderAndBundleGroup'), reqModel, config);
    }

    async getSewingJobSummaryForSewingOrderAndBundleGroupAndFeatures(reqModel: SewingJobFeatureGroupReq, config?: AxiosRequestConfig): Promise<SewJobSummaryForFeatureGroupResp> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getSewingJobSummaryForSewingOrderAndBundleGroupAndFeatures'), reqModel, config);
    }

    async getSewingJobsPreviewForBGAndFeatureGroup(reqModel: SewJobGenReqForBgMOAndFeatureGroup, config?: AxiosRequestConfig): Promise<SewingJobPreviewModelResp> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getSewingJobsPreviewForBGAndFeatureGroup'), reqModel, config);
    }


    async generateSewingJobsForBGAndFeatureGroup(reqModel: SewJobGenReqForBgMOAndFeatureGroup, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('generateSewingJobsForBGAndFeatureGroup'), reqModel, config);
    }


    async deleteSewingJobs(reqModel: DeleteSewingJobsRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteSewingJobs'), reqModel, config);
    }


    async getSewingJobQtyAndPropsInfoByJobNumber(reqModel: JobSewSerialReq, config?: AxiosRequestConfig): Promise<SewingJobPropsResp> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getSewingJobQtyAndPropsInfoByJobNumber'), reqModel, config);
    }


    async getComponentBundlesForSewingJob(reqModel: JobSewSerialReq, config?: AxiosRequestConfig): Promise<PanelReqForJobInfoResp> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getComponentBundlesForSewingJob'), reqModel, config);
    }

    async createPanelFormRequestForSewingJob(reqModel: PanelRequestCreationModel, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createPanelFormRequestForSewingJob'), reqModel, config);
    }

    async getBundleInfoByJob(reqModel: JobNumberRequest, config?: AxiosRequestConfig): Promise<JobBundleFgInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getBundleInfoByJob'), reqModel, config);
    }
    
    async getSewingJobSizeWiseSummaryData(reqModel: SewSerialRequest, config?: AxiosRequestConfig): Promise<SewingJobSizeWiseSummaryResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getSewingJobSizeWiseSummaryData'), reqModel, config);
    }

    async getSewingJobOperationWiseSummaryData(reqModel: SewSerialRequest, config?: AxiosRequestConfig): Promise<SewingJobOperationWiseSummaryResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getSewingJobOperationWiseSummaryData'), reqModel, config);
    }

    async getAvailableComponentBundlesForProcessType(reqModel: SewSerialProcessTypeReq, config?: AxiosRequestConfig): Promise<PanelReqForJobInfoResp> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAvailableComponentBundlesForProcessType'), reqModel, config);
    }

    async updateReportedQtyOfJobAndOp(reqModel: JobOpUpdateRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateReportedQtyOfJobAndOp'), reqModel, config);
    }
}   