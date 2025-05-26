import { CommonResponse, CutTableIdRequest, GlobalResponseObject, ManufacturingOrderNumberRequest, MaterialRequestNoRequest, MRStatusRequest, WhExtReqNoRequest, WhFabMaterialRequestInfoResponse, WhMaterialRequestsResponse } from '@xpparel/shared-models'; //'../../../shared-models/src'
import { WMSCommonAxiosService } from '../../common-axios-service';
import { AxiosRequestConfig } from 'axios';

export class FabricRequestCreationService extends WMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/fabric-request/' + childUrl;
    }

    
    async createFabricWhRequestByExtReqNo(reqModel: MaterialRequestNoRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createFabricWhRequestByExtReqNo'), reqModel, config);
    }

    // async createWhRequest(reqModel: WhReqHeaderRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
    //     return await this.axiosPostCall(this.getURLwithMainEndPoint('createWhRequest'), reqModel, config);
    // }

    async deleteFabricWhRequest(reqModel: WhExtReqNoRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteFabricWhRequest'), reqModel, config);
    }

    async getPendingWhFabricRequestsForCutTableId(reqModel: CutTableIdRequest, config?: AxiosRequestConfig): Promise<WhMaterialRequestsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPendingWhFabricRequestsForCutTableId'), reqModel, config);
    }

    async getItemInfoForWhFabRequestNo(reqModel: MaterialRequestNoRequest, config?: AxiosRequestConfig): Promise<WhFabMaterialRequestInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getItemInfoForWhFabRequestNo'), reqModel, config);
    }

    async getWhMaterialRequests(reqModel: MRStatusRequest, config?: AxiosRequestConfig): Promise<WhMaterialRequestsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getWhMaterialRequests'), reqModel, config);
    }

    async checkMRExistForGivenMoNo(reqModel: ManufacturingOrderNumberRequest, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('checkMRExistForGivenMoNo'), reqModel, config);
    }

}