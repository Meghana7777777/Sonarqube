import { CommonRequestAttrs, GlobalResponseObject, ShiftCreateRequest, ShiftResponse, VendorCategoryRequest, VendorCreateRequest, VendorIdRequest, VendorResponse } from '@xpparel/shared-models'; //'../../../shared-models/src'
import { AxiosRequestConfig } from 'axios';
import { UmsCommonAxiosService } from '../common-axios-service';

export class VendorService extends UmsCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/vendor/' + childUrl;
    }

    async createVendor(reqModel: VendorCreateRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createVendor'), reqModel, config);
    }

    async deleteVendor(reqModel: VendorCreateRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteVendor'), reqModel, config);
    }

    async getAllVendors(reqModel: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<VendorResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllVendors'), reqModel, config);
    }

    async getAllVendorsByVendorCategory(reqModel: VendorCategoryRequest, config?: AxiosRequestConfig): Promise<VendorResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllVendorsByVendorCategory'), reqModel, config);
    }

    async getVendorInfoById(reqModel: VendorIdRequest, config?: AxiosRequestConfig): Promise<VendorResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getVendorInfoById'), reqModel, config);
    }
    
}