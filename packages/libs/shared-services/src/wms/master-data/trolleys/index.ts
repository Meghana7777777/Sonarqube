import { CommonRequestAttrs, GlobalResponseObject, TrollyBarcodesRequest, TrollyCreateRequest, TrollyIdsRequest, TrollyResponse } from '@xpparel/shared-models';
import { AxiosRequestConfig } from 'axios';
import { WMSCommonAxiosService } from '../../common-axios-service';

export class TrolleysServices extends WMSCommonAxiosService {
 
    private getURLwithMainEndPoint(childUrl: string) {
        return '/trolley/' + childUrl;
    }

    async createTrolly(reqModel: TrollyCreateRequest, config?: AxiosRequestConfig): Promise<TrollyResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createTrolly'), reqModel, config);
    }

    async updateTrolly(reqModel: TrollyCreateRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateTrolly'), reqModel, config);
    }

    async activateDeactivateTrolly(reqModel: TrollyIdsRequest, config?: AxiosRequestConfig): Promise<TrollyResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('activateDeactivateTrolly'), reqModel, config);
    }

    async getAllTrollys(reqModel: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<TrollyResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllTrollys'), reqModel, config);
    }

    async getTrollysByTrollyIds(reqModel: TrollyIdsRequest, config?: AxiosRequestConfig): Promise<TrollyResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getTrollysByTrollyIds'), reqModel, config);
    }

    async getTrollysByTrollyBarcodes(reqModel: TrollyBarcodesRequest, config?: AxiosRequestConfig): Promise<TrollyResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getTrollysByTrollyBarcodes'), reqModel, config);
    }
}