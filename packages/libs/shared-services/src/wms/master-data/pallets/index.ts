import { CommonRequestAttrs, PalletsActivateRequest, PalletsCreateRequest, PalletsResponse } from '@xpparel/shared-models';
import { AxiosRequestConfig } from 'axios';
import { WMSCommonAxiosService } from '../../common-axios-service';

export class PalletsServices extends WMSCommonAxiosService {
 
    private getURLwithMainEndPoint(childUrl: string) {
        return '/pallets/' + childUrl;
    }

    async createPallets(reqModel: PalletsCreateRequest, config?: AxiosRequestConfig): Promise<PalletsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createPallets'), reqModel, config);
    }

    async ActivateDeactivatePallets(reqModel: PalletsActivateRequest, config?: AxiosRequestConfig): Promise<PalletsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('ActivateDeactivatePallets'), reqModel, config);
    }

    async getAllPalletsData(reqModel: CommonRequestAttrs, config?: AxiosRequestConfig):Promise<PalletsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllPalletsData'), reqModel, config);
    }
    // async getEmptyPalletDetails( config?: AxiosRequestConfig): Promise<EmptyPalletLocationResponse> {
    //     return await this.axiosPostCall(this.getURLwithMainEndPoint('getEmptyPalletDetails'),  config);
    // }

}