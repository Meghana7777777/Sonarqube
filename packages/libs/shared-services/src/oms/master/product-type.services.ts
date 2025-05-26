import { CommonRequestAttrs, GlobalResponseObject, ProductTypeIdRequest, ProductTypeRequest, ProductTypeResponse } from '@xpparel/shared-models'; //'../../../shared-models/src'
import { AxiosRequestConfig } from 'axios';
import { OMSCommonAxiosService } from '../oms-common-axios-service';

export class ProductTypeServices extends OMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/product-type/' + childUrl;
    }

    async createProductType(reqModel: ProductTypeRequest, config?: AxiosRequestConfig): Promise<ProductTypeResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createProductType'), reqModel, config);
    }

    async deleteProductType(reqModel: ProductTypeIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteProductType'), reqModel, config);
    }

    async getProductType(reqModel: ProductTypeIdRequest, config?: AxiosRequestConfig): Promise<ProductTypeResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getProductType'), reqModel, config);
    }

    async getAllProductTypes(reqModel: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<ProductTypeResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllProductTypes'), reqModel, config);
    }

    async mapCompsToProductType(reqModel: ProductTypeRequest, config?: AxiosRequestConfig): Promise<ProductTypeResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('mapCompsToProductType'), reqModel, config);
    }

    async getProductDetailsByProductType(reqModel: ProductTypeIdRequest, config?: AxiosRequestConfig): Promise<ProductTypeResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getProductDetailsByProductType'), reqModel, config);
    }

}