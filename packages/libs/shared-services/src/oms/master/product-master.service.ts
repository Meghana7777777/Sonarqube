import { ProductsCreateRequest, ProductsResponse, ProductsIdRequest } from "@xpparel/shared-models";
import { OMSCommonAxiosService } from "../oms-common-axios-service";
import { AxiosRequestConfig } from "axios";

export class ProductSharedService extends OMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/product/' + childUrl;
    }

    async createProduct(reqModel: ProductsCreateRequest, config?: AxiosRequestConfig): Promise<ProductsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createProduct'), reqModel, config);
    }

    async deleteProduct(reqModel: ProductsIdRequest, config?: AxiosRequestConfig): Promise<ProductsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteProduct'), reqModel, config);
    }

    async getAllProducts(reqModel?: ProductsIdRequest, config?: AxiosRequestConfig): Promise<ProductsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllProducts'), reqModel, config);
    }

    async activateDeactivateProduct(reqModel: ProductsIdRequest, config?: AxiosRequestConfig): Promise<ProductsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('activateDeactivateProduct'), reqModel, config);
    }

    async updateProductImage(reqModel?: FormData, config?: AxiosRequestConfig): Promise<ProductsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateProductImage'), reqModel, config);
    }

    async getProductByProductCode(reqModel: ProductsIdRequest, config?: AxiosRequestConfig): Promise<ProductsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getProductByProductCode'), reqModel, config);
    }

}
