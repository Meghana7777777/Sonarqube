
import { CommonRequestAttrs, GlobalResponseObject, PJ_ProcessingSerialRequest, PJ_ProcessingJobsSummaryResponse, PJ_ProcessingSerialTypeAndFeatureGroupReq, PJ_ProcessingTypesResponse, PO_StyleInfoResponse, ProcessingOrderCreationInfoResponse, ProcessingOrderCreationRequest, ProcessingOrderInfoRequest, ProcessingOrderInfoResponse, ProcessingOrderSerialRequest, ProductInfoResponse, StyleCodeRequest, StyleMoRequest, StyleProductCodeRequest, StyleProductFgColorResp, PJ_ProcessingJobBatchInfoResp, PJ_ProcessingJobsSummaryForFeaturesResponse, PJ_ProcessingJobPreviewModelResp, IPS_C_LocationCodeRequest, IPS_R_LocationJobsResponse, SPS_C_ProcJobNumberRequest, SPS_R_JobInfoDetailedResponse, ProcessTypeEnum, PJ_ProcessingJobsGenRequest, TrimStatusEnum, SPS_C_JobTrimRequest, SPS_RequestDetailsModelResponse, KMS_C_JobMainMaterialReqIdRequest, KMS_R_KnitJobRequestedItemsResponse, MaterialRequestTypeEnum, WhRequestStatusEnum, SPS_C_JobTrimReqIdRequest, SPS_R_JobRequestedTrimsResponse, SPS_C_InvOutConfirmationRequest, SPS_R_InvOutItemsForConfirmationIdResponse, PTS_C_TranLogIdRequest, INV_C_InvOutAllocIdRequest, SPS_C_JobNumbersForReconciliationRequest, WMS_C_IssuanceIdRequest, JobSewSerialReq, SewingJobPropsResp, SewingJobBarcodeInfoResp, DeleteSewingJobsRequest } from "@xpparel/shared-models";
import { SPSCommonAxiosService } from "../sps-common-axios.service";
import { AxiosRequestConfig } from "axios";

export class ProcessingJobsService extends SPSCommonAxiosService {
    private getURLwithMainEndPoint(childUrl: string) {
        return '/processing-jobs/' + childUrl;
    }

    /**
     * Service to get the processing types attached to that processing serial
     * Usually calls from UI to give the tabs for each process type in order to generate the processing jobs for each process type
     * @param reqObj 
     * @param config 
     * @returns 
    */
    async getProcessingTypesByProcessingSerial(reqObj: PJ_ProcessingSerialRequest, config?: AxiosRequestConfig): Promise<PJ_ProcessingTypesResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getProcessingTypesByProcessingSerial'), reqObj, config);
    }

    /**
     * Service to get the Processing jobs summary including processing order total quantity and how much processing jobs has been generated
     * Usually calls from UI to visualize the summary of processing jobs for processing type
     * @param reqObj 
     * @param config 
     * @returns 
    */
    async getProcessingJobSummaryForProcessType(reqObj: PJ_ProcessingSerialRequest, config?: AxiosRequestConfig): Promise<PJ_ProcessingJobsSummaryResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getProcessingJobSummaryForProcessType'), reqObj, config);
    }

    /**
     * Service to get the Processing jobs summary including processing order total quantity and how much processing jobs has been generated for particular feature group
     * Usually calls from UI to visualize the summary of processing jobs for processing type
     * @param reqObj 
     * @param config 
     * @returns 
    */
    async getProcessingJobSummaryForProcessTypeAndFeatureGroup(reqObj: PJ_ProcessingSerialTypeAndFeatureGroupReq, config?: AxiosRequestConfig): Promise<PJ_ProcessingJobsSummaryForFeaturesResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getProcessingJobSummaryForProcessTypeAndFeatureGroup'), reqObj, config);
    }

    /**
     * Service Get virtual  processing jobs for the process type and feature group
     * Usually calls from UI after clicks on generate button to show these virtual jobs in the POP UP
     * @param reqObj 
     * @param config 
     * @returns 
    */
    async getVirtualProcessingJobsForProcessTypeAndFeatureGroup(reqObj: PJ_ProcessingJobsGenRequest, config?: AxiosRequestConfig): Promise<PJ_ProcessingJobPreviewModelResp> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getVirtualProcessingJobsForProcessTypeAndFeatureGroup'), reqObj, config);
    }

    /**
    * Service to confirm the virtual processing jobs for the process type and feature group
    * Usually calls from UI after clicks on Confirm button in the pop up
    * @param reqObj 
    * @param config 
    * @returns 
   */
    async confirmProcessingJobsForProcessTypeAndFeatureGroup(reqObj: PJ_ProcessingJobsGenRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('confirmProcessingJobsForProcessTypeAndFeatureGroup'), reqObj, config);
    }

    /**
     * Service to ge the processing jobs information for the processing type and processing serial
     * @param reqObj 
     * @param config 
     * @returns 
    */
    async getProcessingJobsInfoForProcessingType(reqObj: PJ_ProcessingSerialRequest, config?: AxiosRequestConfig): Promise<PJ_ProcessingJobBatchInfoResp> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getProcessingJobsInfoForProcessingType'), reqObj, config);
    }


    // Services using for Dashboard / Reports

    // For IPS dashboard 

    /**
     * Service to get the jobs information for a location 
     * Usually calls this api for one section by passing location codes from UI
     * Have to get the locations and sections information from the unit management module
     * @param reqObj 
     * @param config 
     * @returns 
    */
    async getJobsInfoByLocation(reqObj: IPS_C_LocationCodeRequest, config?: AxiosRequestConfig): Promise<IPS_R_LocationJobsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getJobsInfoByLocation'), reqObj, config);
    }

    // will be only called from the IPS

    /**
     * Once user clicks on the job Need to call this api to get the job level detail information in order to show the same in the header
     * Usually calls from the UI dashboards once user clicks on the box of a job. 
     * @param reqObj 
     * @param config 
     * @returns 
    */
    async getJobInfoByJobNumber(reqObj: SPS_C_ProcJobNumberRequest, config?: AxiosRequestConfig): Promise<SPS_R_JobInfoDetailedResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getJobInfoByJobNumber'), reqObj, config);
    }

    /**
     * Service to get the Jobs under the location which requires trims / rm but not yet issues
     * Usually calls from the Trims issue dashboard by passing the iNeedTrims true
     * @param reqObj 
     * @param config 
     * @returns 
    */
    async getRMInProgressJobsForLocation(reqObj: IPS_C_LocationCodeRequest, config?: AxiosRequestConfig): Promise<IPS_R_LocationJobsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getRMInProgressJobsForLocation'), reqObj, config);
    }


    async saveTrimReqForSewingJob(reqObj: SPS_C_JobTrimRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('saveTrimReqForSewingJob'), reqObj, config);
    }

    async getRequestedTrimMaterialForReqId(reqObj: SPS_C_JobTrimReqIdRequest, config?: AxiosRequestConfig): Promise<SPS_R_JobRequestedTrimsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getRequestedTrimMaterialForReqId'), reqObj, config);
    }

    async saveBankReqForSewingJob(reqObj: SPS_C_JobTrimRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('saveBankReqForSewingJob'), reqObj, config);
    }


    async getRequestDetailsForJob(reqObj: SPS_C_ProcJobNumberRequest, config?: AxiosRequestConfig): Promise<SPS_RequestDetailsModelResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getRequestDetailsForJob'), reqObj, config);
    }

    /**
     * Service to get the requested job materials for the Material request id
     * Usually calls from WMS, Once the request is raised from the KMS
     * @param reqObjgetRequestedKnitMaterialForReqId
     * @param config 
     * @returns 
    */
    async getRequestedJobMaterialForReqId(reqObj: KMS_C_JobMainMaterialReqIdRequest, config?: AxiosRequestConfig): Promise<KMS_R_KnitJobRequestedItemsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getRequestedJobMaterialForReqId'), reqObj, config);
    }

    async getRequestedSFGItemsForReqId(req: SPS_C_InvOutConfirmationRequest, config?: AxiosRequestConfig): Promise<SPS_R_InvOutItemsForConfirmationIdResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getRequestedSFGItemsForReqId'), req, config);
    }

    async issueMaterialForRequestId(req: INV_C_InvOutAllocIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('issueMaterialForRequestId'), req, config);
    }

    async updateJobRepQtysByTransId(req: PTS_C_TranLogIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateJobRepQtysByTransId'), req, config);
    }

    async updateIssuedMaterialFromWms(req: WMS_C_IssuanceIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateIssuedMaterialFromWms'), req, config);
    }

    async updateJobReconciliationStatus(req: SPS_C_JobNumbersForReconciliationRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateJobReconciliationStatus'), req, config);
    }

    async getSewingJobQtyAndPropsInfoByJobNumber(reqModel: JobSewSerialReq, config?: AxiosRequestConfig): Promise<SewingJobPropsResp> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getSewingJobQtyAndPropsInfoByJobNumber'), reqModel, config);
    }

    async getBarcodeDetailsByJobNumber(reqModel: JobSewSerialReq, config?: AxiosRequestConfig): Promise<SewingJobBarcodeInfoResp> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getBarcodeDetailsByJobNumber'), reqModel, config);
    }

    async deleteProcessingJobs(reqModel: DeleteSewingJobsRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteProcessingJobs'), reqModel, config);
    }
}

