import { CommonRequestAttrs, MoversActivateRequest, MoversCreateRequest, MoversResponse } from '@xpparel/shared-models';
import { AxiosRequestConfig } from 'axios';
import { WMSCommonAxiosService } from '../../common-axios-service';

export class MoversServices extends WMSCommonAxiosService {
 
    private getURLwithMainEndPoint(childUrl: string) {
        return '/movers/' + childUrl;
    }

    async createMovers(reqModel: MoversCreateRequest, config?: AxiosRequestConfig): Promise<MoversResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createMovers'), reqModel, config);
    }

    async ActivateDeactivateMovers(reqModel: MoversActivateRequest, config?: AxiosRequestConfig): Promise<MoversResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('ActivateDeactivateMovers'), reqModel, config);
    }

    async getAllMoversData(reqModel: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<MoversResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllMoversData'), reqModel, config);
    }

}