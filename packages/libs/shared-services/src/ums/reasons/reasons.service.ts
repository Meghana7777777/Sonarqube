import { CommonRequestAttrs, CommonResponse, GlobalResponseObject, ReasonCategoryRequest, ReasonCreateRequest, ReasonIdRequest, ReasonResponse } from '@xpparel/shared-models';
import { AxiosRequestConfig } from 'axios';
import { UmsCommonAxiosService } from '../common-axios-service';

export class ReasonsService extends UmsCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/reasons/' + childUrl;
    }

    async createReason(reqModel: ReasonCreateRequest, config?: AxiosRequestConfig): Promise<ReasonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createReason'), reqModel, config);
    }

    async deleteReason(reqModel: ReasonIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteReason'), reqModel, config);
    }

    async getAllReasons(reqModel: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<ReasonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllReasons'), reqModel, config);
    }

    async getReasonbyId(reqModel: ReasonIdRequest, config?: AxiosRequestConfig): Promise<ReasonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getReasonbyId'), reqModel, config);
    }

    async getReasonsByCategory(reqModel: ReasonCategoryRequest, config?: AxiosRequestConfig): Promise<ReasonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getReasonsByCategory'), reqModel, config);
    }

    async getAllActiveReasons(): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllActiveReasons'));
    }

}