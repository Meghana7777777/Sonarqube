import { GlobalResponseObject, PkAodAbstractResponse, PkDSetIdsRequest, PkShippingDispatchRequest, PkShippingDispatchResponse, PkShippingRequestCheckoutRequest, PkShippingRequestFilterRequest, PkShippingRequestIdRequest, PkShippingRequestItemIdRequest, PkShippingRequestResponse, PkShippingRequestTruckIdRequest, PkShippingRequestTruckRequest, PkShippingRequestVendorRequest } from '@xpparel/shared-models';
import { AxiosRequestConfig } from 'axios';
import { DMSCommonAxiosService } from '../common-axios.service';

export class ShippingRequestService extends DMSCommonAxiosService {
    getDispatchSet(reqObj: PkShippingRequestFilterRequest) {
        throw new Error('Method not implemented.');
    }

    private getURLwithMainEndPoint(childUrl: string) {
        return '/shipping-request/' + childUrl;
    }

    async createShippingRequest(reqModel: PkDSetIdsRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createShippingRequest'), reqModel, config);
    }

    async deleteShippingRequest(reqModel: PkShippingRequestIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteShippingRequest'), reqModel, config);
    }

    async approveShippingRequest(reqModel: PkShippingRequestIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('approveShippingRequest'), reqModel, config);
    }

    async rejectShippingRequest(reqModel: PkShippingRequestIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('rejectShippingRequest'), reqModel, config);
    }

    async getShippingRequestByIds(reqModel: PkShippingRequestIdRequest, config?: AxiosRequestConfig): Promise<PkShippingRequestResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getShippingRequestByIds'), reqModel, config);
    }

    async getShippingRequestByFilterRequest(reqModel: PkShippingRequestFilterRequest, config?: AxiosRequestConfig): Promise<PkShippingRequestResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getShippingRequestByFilterRequest'), reqModel, config);
    }

    async saveVendorInfoForShippingRequest(reqModel: PkShippingRequestVendorRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('saveVendorInfoForShippingRequest'), reqModel, config);
    }

    async saveTruckInfoForShippingRequest(reqModel: PkShippingRequestTruckRequest[], config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('saveTruckInfoForShippingRequest'), reqModel, config);
    }

    async deleteTruckForShippingRequest(reqModel: PkShippingRequestTruckIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteTruckForShippingRequest'), reqModel, config);
    }

    async deleteVendorInfoForShippingRequest(reqModel: PkShippingRequestIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteVendorInfoForShippingRequest'), reqModel, config);
    }

    async checkoutShippingRequest(reqModel: PkShippingRequestCheckoutRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('checkoutShippingRequest'), reqModel, config);
    }

    async getShippingRequestItemAodAbrstactInfo(reqModel: PkShippingRequestItemIdRequest, config?: AxiosRequestConfig): Promise<PkAodAbstractResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getShippingRequestItemAodAbrstactInfo'), reqModel, config);
    }

    async getAlreadyDispatchedSRCount(reqModel: PkShippingDispatchRequest, config?: AxiosRequestConfig): Promise<PkShippingDispatchResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAlreadyDispatchedSRCount'), reqModel, config);
    }
}