import { CommonRequestAttrs, RollAttributesActivateRequest, RollAttributesCreateRequest, RollAttributesResponse } from '@xpparel/shared-models';
import { AxiosRequestConfig } from 'axios';
import { WMSCommonAxiosService } from '../../common-axios-service';

export class RollAttributesServices extends WMSCommonAxiosService {
 
    private getURLwithMainEndPoint(childUrl: string) {
        return '/rollattributes/' + childUrl;
    }

    async createRollAttributes(reqModel: RollAttributesCreateRequest, config?: AxiosRequestConfig): Promise<RollAttributesResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createRollAttributes'), reqModel, config);
    }

    async ActivateDeactivateRollAttributes(reqModel: RollAttributesActivateRequest, config?: AxiosRequestConfig): Promise<RollAttributesResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('ActivateDeactivateRollAttributes'), reqModel, config);
    }

    async getAllRRollAttributesData(reqModel: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<RollAttributesResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllRRollAttributesData'), reqModel, config);
    }

}