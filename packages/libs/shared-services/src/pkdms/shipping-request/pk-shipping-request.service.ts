import { CommonResponse, GlobalResponseObject, PKMSPackListIdReqDto, PkAodAbstractResponse, PkDSetIdsRequest, PkShippingDispatchRequest, PkShippingDispatchResponse, PkShippingRequestCheckoutRequest, PkShippingRequestFilterRequest, PkShippingRequestIdRequest, PkShippingRequestItemIdRequest, PkShippingRequestResponse, PkShippingRequestTruckIdRequest, PkShippingRequestTruckRequest, PkShippingRequestVendorRequest, PkSrFinalItemsResponse, PkTruckItemsMapRequest, PkTruckItemsResponse, ShippingRequestIdRequest, UpdateVendorResponseModel, VendorDetailsReq, VendorResponse } from '@xpparel/shared-models';
import { AxiosRequestConfig } from 'axios';
import { PkDMSCommonAxiosService } from '../common-axios.service';

export class PkShippingRequestService extends PkDMSCommonAxiosService {
 
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

    async validateCheckoutShippingRequest(reqModel: PkShippingRequestIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('validateCheckoutShippingRequest'), reqModel, config);
    }

    async getShippingDispatchStatus(reqModel: PKMSPackListIdReqDto, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getShippingDispatchStatus'), reqModel, config);
    }

    async getDSetSubItemsForSrId(reqModel: ShippingRequestIdRequest, config?: AxiosRequestConfig): Promise<PkSrFinalItemsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getDSetSubItemsForSrId'), reqModel, config);
    }

    async mapDSetSubItemsToTruck(reqModel: PkTruckItemsMapRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('mapDSetSubItemsToTruck'), reqModel, config);
    }
    async unMapDSetSubItemsToTruck(reqModel: PkTruckItemsMapRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('unMapDSetSubItemsToTruck'), reqModel, config);
    }
    async getTruckMappedItemsForSrId(reqModel: PkShippingRequestIdRequest, config?: AxiosRequestConfig): Promise<PkTruckItemsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getTruckMappedItemsForSrId'), reqModel, config);
    
    }
    async updateTruckLoadingComplete(reqModel: PkShippingRequestTruckIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateTruckLoadingComplete'), reqModel, config);
    }
    async updateTruckLoadingProgress(reqModel: PkShippingRequestTruckIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateTruckLoadingProgress'), reqModel, config);
    }

    async getVendorDetailsByShippingRequest(reqModel: VendorDetailsReq, config?: AxiosRequestConfig): Promise<UpdateVendorResponseModel> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getVendorDetailsByShippingRequest'), reqModel, config);
    }
}