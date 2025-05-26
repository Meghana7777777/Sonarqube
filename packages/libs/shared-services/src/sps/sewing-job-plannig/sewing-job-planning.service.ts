import { BarcodeDetailsForQualityResultsModel, BarcodeDetailsForQualityResultsResponse, CommonRequestAttrs, GetModuleByJobNoResponse, GlobalResponseObject, IModuleIdRequest, IPlannningSectionModelResponse, IPlannningTrimsResponse, SequencedIJobOperationResponse, SewingIJobNoRequest, SewingJobNoRequest, SewingJobPendingDataResponse, SewingJobPriorityRequest, SewingJobPriorityResponse, SewingOrderIdRequest, SewingOrderLineResponse, SewingOrderResponse, SewingOrdersewSerialResponse, SewSerialIdRequest, SJobFgResponse, SJobLineOperationsResponse, MorderSewSerialRequest, ProcessTypeEnum, LocationCodesRequest, IpsBarcodeDetailsForQualityResultsResponse, IpsDowntimeDetailsResponse } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { SPSCommonAxiosService } from "../sps-common-axios.service";


export class SewingJobPlanningService extends SPSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/sewing-job-planning/' + childUrl;
    }

    async getAllSewingOrders(req: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<SewingOrderResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllSewingOrders'), req, config);
    }

    async getSewingOrderLinesAgainstSewingOrder(req: SewingOrderIdRequest, config?: AxiosRequestConfig): Promise<SewingOrderLineResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getSewingOrderLinesAgainstSewingOrder'), req, config);
    }

    async getAllOperationsDataByJobId(req: SewingJobNoRequest, config?: AxiosRequestConfig): Promise<SJobLineOperationsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllOperationsDataByJobId'), req, config);
    }

    async getSewingJobDataBySewSerialCode(req: SewSerialIdRequest, config?: AxiosRequestConfig): Promise<SewingJobPendingDataResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getSewingJobDataBySewSerialCode'), req, config);
    }

    async getSewSerialsByMOrderAndMOrderLine(req: MorderSewSerialRequest, config?: AxiosRequestConfig): Promise<SewingOrdersewSerialResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getSewSerialsByMOrderAndMOrderLine'), req, config);
    }

    async updateSewingJobStatus(req: SewingJobNoRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateSewingJobStatus'), req, config);
    }

    async getInputPlanningdashBoardData(req: CommonRequestAttrs,config?: AxiosRequestConfig): Promise<IPlannningSectionModelResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getInputPlanningdashBoardData'),req, config);
    }

    async getSequencedOperationsByJobId(req: SewingIJobNoRequest, config?: AxiosRequestConfig): Promise<SequencedIJobOperationResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getSequencedOperationsByJobId'), req, config);
    }

    async getTrimsDataByJobNo(req: SewingIJobNoRequest, config?: AxiosRequestConfig): Promise<IPlannningTrimsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getTrimsDataByJobNo'), req, config);
    }

    async getSJobFgDataByJobNo(req :SewingIJobNoRequest, config?: AxiosRequestConfig) : Promise<SJobFgResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint
            ('getSJobFgDataByJobNo') , req,config);
    }

    async getModuleNoByJobNo(req:SewingIJobNoRequest, config?: AxiosRequestConfig) : Promise<GetModuleByJobNoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getModuleNoByJobNo') , req,config)
    }

    async saveBarcodeQualityDetails(req: BarcodeDetailsForQualityResultsModel, config?: AxiosRequestConfig): Promise<IPlannningTrimsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('saveBarcodeQualityDetails'), req, config);
    }

    async getBarcodeQualityDetailsByModuleCode(req: LocationCodesRequest, config?: AxiosRequestConfig): Promise<IpsBarcodeDetailsForQualityResultsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getBarcodeQualityDetailsByModuleCode'), req, config);
    }

    async getInprogressJobForJobPriority(req: IModuleIdRequest, config?: AxiosRequestConfig): Promise<SewingJobPriorityResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getInprogressJobForJobPriority'), req, config);
    }

    async updateInprogressJobsJobPriority(req: SewingJobPriorityRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateInprogressJobsJobPriority'), req, config);
    }

    async getDowntimeDetailsForLocations(req: LocationCodesRequest, config?: AxiosRequestConfig): Promise<IpsDowntimeDetailsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getDowntimeDetailsForLocations'), req, config);
    }
}