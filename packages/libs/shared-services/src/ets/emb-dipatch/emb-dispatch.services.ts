import { EmbDispatchCreateRequest, EmbDispatchIdStatusRequest, EmbDispatchRequestResponse, EmbDispatchStatusRequest, GlobalResponseObject, PoEmbHeaderResponse } from '@xpparel/shared-models';
import { AxiosRequestConfig } from 'axios';
import { EtsCommonAxiosService } from '../ets-common-axios-service';

export class EmbDispatchService extends EtsCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/emb-dispatch/' + childUrl;
    }
    
    async createEmbDispatch(reqModel: EmbDispatchCreateRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createEmbDispatch'), reqModel, config);
    }

    async deleteEmbDispatch(reqModel: EmbDispatchIdStatusRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteEmbDispatch'), reqModel, config);
    }

    async getEmbDispatchRequestsByReqStatus(reqModel: EmbDispatchStatusRequest, config?: AxiosRequestConfig): Promise<EmbDispatchRequestResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getEmbDispatchRequestsByReqStatus'), reqModel, config);
    }

    async getEmbDispatchRequestForDrId(reqModel: EmbDispatchIdStatusRequest, config?: AxiosRequestConfig): Promise<EmbDispatchRequestResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getEmbDispatchRequestForDrId'), reqModel, config);
    }

    async updateEmbDispatchStatus(reqModel: EmbDispatchIdStatusRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateEmbDispatchStatus'), reqModel, config);
    }

    async getDispatchLinesInfoForDisptachRequestId(reqModel: EmbDispatchIdStatusRequest, config?: AxiosRequestConfig): Promise<PoEmbHeaderResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getDispatchLinesInfoForDisptachRequestId'), reqModel, config);
    }
    
    async updatePrintStatusForDrId(reqModel: EmbDispatchIdStatusRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updatePrintStatusForDrId'), reqModel, config);
    }
    
}
