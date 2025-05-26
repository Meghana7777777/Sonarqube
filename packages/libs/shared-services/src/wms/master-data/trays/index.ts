import { CommonRequestAttrs, TrayIdsRequest, TrayCreateRequest, TrayResponse, GlobalResponseObject, TrayBarcodesRequest, TrayCodesRequest } from '@xpparel/shared-models';
import { AxiosRequestConfig } from 'axios';
import { WMSCommonAxiosService } from '../../common-axios-service';

export class TraysServices extends WMSCommonAxiosService {
 
    private getURLwithMainEndPoint(childUrl: string) {
        return '/trays/' + childUrl;
    }

    async createTray(reqModel: TrayCreateRequest, config?: AxiosRequestConfig): Promise<TrayResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createTray'), reqModel, config);
    }

    async updateTray(reqModel: TrayCreateRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateTray'), reqModel, config);
    }

    async activateDeactivateTray(reqModel: TrayIdsRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('activateDeactivateTray'), reqModel, config);
    }

    async getAllTrays(reqModel: TrayIdsRequest, config?: AxiosRequestConfig): Promise<TrayResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllTrays'), reqModel, config);
    }

    async getTraysByTrayIds(reqModel: TrayIdsRequest, config?: AxiosRequestConfig): Promise<TrayResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getTraysByTrayIds'), reqModel, config);
    }

    async getTraysByTrayBarcodes(reqModel: TrayBarcodesRequest, config?: AxiosRequestConfig): Promise<TrayResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getTraysByTrayBarcodes'), reqModel, config);
    }

    async getTraysByTrayCodes(reqModel: TrayCodesRequest, config?: AxiosRequestConfig): Promise<TrayResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getTraysByTrayCodes'), reqModel, config);
    }

}