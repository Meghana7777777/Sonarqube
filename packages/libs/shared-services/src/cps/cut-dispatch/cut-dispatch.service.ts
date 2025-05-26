import { AdResponse, CutDispatchCreateRequest, CutDispatchIdStatusRequest, CutDispatchRequestResponse, CutDispatchStatusRequest, CutDispatchVendorTransUpdateRequest, CutInventoryResponse, CutReportRequest, DbCutReportRequest, DocketLayingTimesResponse, DocketLaysResponse, GlobalResponseObject, LayIdRequest, LayIdsRequest, PoDocketNumberRequest, PoSerialRequest } from '@xpparel/shared-models';
import { AxiosRequestConfig } from 'axios';
import { CPSCommonAxiosService } from '../cps-common-axios-service';

export class CutDispatchService extends CPSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/cut-dispatch/' + childUrl;
    }
    
    async createCutDispatch(reqModel: CutDispatchCreateRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createCutDispatch'), reqModel, config);
    }

    async deleteCutDispatch(reqModel: CutDispatchIdStatusRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteCutDispatch'), reqModel, config);
    }

    async getCutDispatchRequestsByStatus(reqModel: CutDispatchStatusRequest, config?: AxiosRequestConfig): Promise<CutDispatchRequestResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getCutDispatchRequestsByStatus'), reqModel, config);
    }

    async getCutDispatchRequestsByCutDrId(reqModel: CutDispatchIdStatusRequest, config?: AxiosRequestConfig): Promise<CutDispatchRequestResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getCutDispatchRequestsByCutDrId'), reqModel, config);
    }

    async updatePrintStatusForCutDrId(reqModel: CutDispatchStatusRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updatePrintStatusForCutDrId'), reqModel, config);
    }

    async updateVendorAndTransportInfoForCutDrId(reqModel: CutDispatchVendorTransUpdateRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateVendorAndTransportInfoForCutDrId'), reqModel, config);
    }

    async updateCutDispatchRequestStatus(reqModel: CutDispatchIdStatusRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateCutDispatchRequestStatus'), reqModel, config);
    }

}