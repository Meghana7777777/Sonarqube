import { CommonRequestAttrs, GlobalResponseObject, ShiftCreateRequest, ShiftResponse, SizesResponse, SizescreateRequest } from '@xpparel/shared-models'; //'../../../shared-models/src'
import { AxiosRequestConfig } from 'axios';
import { UmsCommonAxiosService } from '../common-axios-service';

export class SizesService extends UmsCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/sizes/' + childUrl;
    }

    async createSize(reqModel: SizescreateRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createSize'), reqModel, config);
    }

    async deleteSize(reqModel: SizescreateRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteSize'), reqModel, config);
    }

    async getAllSizes(reqModel: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<SizesResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllSizes'), reqModel, config);
    }

    async saveSizeIndex (req:any , config?: AxiosRequestConfig): Promise<SizesResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('saveSizeIndex'), req, config);
    }
    
}