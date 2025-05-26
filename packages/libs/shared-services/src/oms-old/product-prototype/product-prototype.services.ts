import { GlobalResponseObject, ProductIdRequest, ProductItemResponse, SubProductItemMapRequest } from '@xpparel/shared-models'; //'../../../shared-models/src'
import { AxiosRequestConfig } from 'axios';
import { OMSCommonAxiosService } from '../oms-common-axios-service';

export class ProductPrototypeServices extends OMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/product-prototype/' + childUrl;
    }

    async saveSubProductRmItemComps(reqModel: SubProductItemMapRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('saveSubProductRmItemComps'), reqModel, config);
    }

    async deleteSubProductRmItemComps(reqModel: ProductIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteSubProductRmItemComps'), reqModel, config);
    }

    async confirmProductRmItemComps(reqModel: ProductIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('confirmProductRmItemComps'), reqModel, config);
    }

    async unConfirmProductRmItemComps(reqModel: ProductIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('unConfirmProductRmItemComps'), reqModel, config);
    }

  

}