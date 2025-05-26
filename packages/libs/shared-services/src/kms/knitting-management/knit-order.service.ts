import { CommonRequestAttrs, GlobalResponseObject, KnitHeaderInfoResoponse, MoPslIdsRequest, MoPslQtyInfoResponse, PO_StyleInfoResponse, PoDataSummaryResponse, ProcessingOrderCreationInfoResponse, ProcessingOrderCreationRequest, ProcessingOrderInfoRequest, ProcessingOrderInfoResponse, ProcessingOrderSerialRequest, ProductInfoResponse, StyleCodeRequest, StyleMoRequest, StyleProductCodeRequest, StyleProductFgColorResp } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { KMSCommonAxiosService } from "../kms-common-axios-service";

export class KnitOrderService extends KMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/processing-order/' + childUrl;
    }

    async createKnitProcessingOrder(moCreationReq: ProcessingOrderCreationRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createKnitProcessingOrder'), moCreationReq, config);
    }


    async getPoInfoForStyleAndMo(styleMoReq: StyleMoRequest, config?: AxiosRequestConfig): Promise<ProcessingOrderInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPoInfoForStyleAndMo'), styleMoReq, config);
    }
    async getProcessingOrderInfo(prcOrdInfoReq: ProcessingOrderInfoRequest, config?: AxiosRequestConfig): Promise<ProcessingOrderInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getProcessingOrderInfo'), prcOrdInfoReq, config);
    }

    async getKnitOrderCreatedStyles(reqObj: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<PO_StyleInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getKnitOrderCreatedStyles'), reqObj, config);
    }

    async getProductInfoForGivenStyle(reqObj: StyleCodeRequest, config?: AxiosRequestConfig): Promise<ProductInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getProductInfoForGivenStyle'), reqObj, config);
    }

    async getKnitOrderInfoByStyeAndProduct(reqObj: StyleProductCodeRequest, config?: AxiosRequestConfig): Promise<ProcessingOrderInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getKnitOrderInfoByStyeAndProduct'), reqObj, config);
    }

    async getStyleProductCodeFgColorForPo(reqObj: ProcessingOrderSerialRequest, config?: AxiosRequestConfig): Promise<StyleProductFgColorResp> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getStyleProductCodeFgColorForPo'), reqObj, config);
       
    }

    async getMOInfoForPrcOrdCreation(reqObj: StyleMoRequest, config?: AxiosRequestConfig): Promise<ProcessingOrderCreationInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getMOInfoForPrcOrdCreation'), reqObj, config);
    }

    async deleteKnitProcesisngOrder(reqObj: ProcessingOrderSerialRequest, config?: AxiosRequestConfig): Promise<StyleProductFgColorResp> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteKnitProcesisngOrder'), reqObj, config);
    }

    async getKnitHeaderInfoData(req:any, config?: AxiosRequestConfig ): Promise<KnitHeaderInfoResoponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getKnitHeaderInfoData'),req, config);
    }

    async getPoQtysInfoForMoPSLIds(req:MoPslIdsRequest, config?: AxiosRequestConfig ): Promise<MoPslQtyInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPoQtysInfoForMoPSLIds'),req, config);
    }

    async getPoSummary(req:ProcessingOrderSerialRequest, config?: AxiosRequestConfig ): Promise<PoDataSummaryResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPoSummary'),req, config);
    }
}