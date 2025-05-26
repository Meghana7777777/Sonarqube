

import { CommonRequestAttrs, GlobalResponseObject, SaleOrderDumpRequest, SaleOrderPreviewData, SI_SaleOrderInfoAbstractResponse, SI_SaleOrderInfoResponse, SI_SoNumberRequest, SI_SoProductIdRequest, SOHeaderInfoModelResponse, SOPreviewResponse } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { OMSCommonAxiosService } from "../oms-common-axios-service";

export class SaleOrderCreationService extends OMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/sale-order-creation/' + childUrl;
    }

    async upLoadSaleOrders(reqModel: SaleOrderDumpRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('upLoadSaleOrders'), reqModel, config);
    }

    async deleteSaleOrders(reqModel: SI_SoNumberRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteSaleOrders'), reqModel, config);
    }

    async getSaleOrdersList(reqModel: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<SI_SaleOrderInfoAbstractResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getSaleOrdersList'), reqModel, config);
    }

    async getUnConfirmedSaleOrdersInfo(reqModel: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<SI_SaleOrderInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getUnConfirmedSaleOrdersInfo'), reqModel, config);
    }

    async getConfirmedSaleOrdersInfo(reqModel: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<SI_SaleOrderInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getConfirmedSaleOrdersInfo'), reqModel, config);
    }

    async getOrderInfoBySaleOrderNo(reqModel: SI_SoNumberRequest, config?: AxiosRequestConfig): Promise<SI_SaleOrderInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getOrderInfoBySaleOrderNo'), reqModel, config);
    }

    async confirmSaleOrder(reqModel: SI_SoNumberRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('confirmSaleOrder'), reqModel, config);
    }
    async getSoInfoHeader(req: SI_SoProductIdRequest, config?: AxiosRequestConfig): Promise<SOHeaderInfoModelResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getSoInfoHeader'), req, config);
    }

    async getSoPreviewData(req: SI_SoNumberRequest, config?: AxiosRequestConfig): Promise<SOPreviewResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getSoPreviewData'), req, config);
    }
}
