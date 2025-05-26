
import { CommonRequestAttrs, GlobalResponseObject, PO_StyleInfoResponse, ProcessingOrderCreationInfoResponse, ProcessingOrderCreationRequest, ProcessingOrderInfoRequest, ProcessingOrderInfoResponse, ProcessingOrderSerialRequest, ProcessTypeEnum, ProductInfoResponse, StyleCodeRequest, StyleMoRequest, StyleProductCodeRequest, StyleProductFgColorResp, PBUN_C_ProcOrderRequest, PBUN_R_ProcBundlesResponse, KnitHeaderInfoResoponse, SewSerialRequest, MoProductSubLineIdsRequest, MoPslQtyInfoResponse, PoDataSummaryResponse, PBUN_R_ProcJobBundlesResponse, MoPslIdsRequest, SewingIJobNoRequest, SewJobBundleSheetResponse, SewitemCodeWiseConsumptionResponse, SpsBundleSheetRequest } from "@xpparel/shared-models";
import { SPSCommonAxiosService } from "../sps-common-axios.service";
import { AxiosRequestConfig } from "axios";

export class SewingProcessingOrderService extends SPSCommonAxiosService {
    private getURLwithMainEndPoint(childUrl: string) {
        return '/processing-order/' + childUrl;
    }

    async createSPSProcessingOrder(moCreationReq: ProcessingOrderCreationRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createSPSProcessingOrder'), moCreationReq, config);
    }

    async getPoInfoForStyleAndMo(styleMoReq: StyleMoRequest, config?: AxiosRequestConfig): Promise<ProcessingOrderInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPoInfoForStyleAndMo'), styleMoReq, config);
    }

    async getProcessingOrderInfo(prcOrdInfoReq: ProcessingOrderInfoRequest, config?: AxiosRequestConfig): Promise<ProcessingOrderInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getProcessingOrderInfo'), prcOrdInfoReq, config);
    }

    async getSewOrderCreatedStyles(reqObj: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<PO_StyleInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getSewOrderCreatedStyles'), reqObj, config);
    }

    async getProductInfoForGivenStyle(reqObj: StyleCodeRequest, config?: AxiosRequestConfig): Promise<ProductInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getProductInfoForGivenStyle'), reqObj, config);
    }

    async getSPSOrderInfoByStyeAndProduct(reqObj: StyleProductCodeRequest, config?: AxiosRequestConfig): Promise<ProcessingOrderInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getSPSOrderInfoByStyeAndProduct'), reqObj, config);
    }

    async getStyleProductCodeFgColorForPo(reqObj: ProcessingOrderSerialRequest, config?: AxiosRequestConfig): Promise<StyleProductFgColorResp> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getStyleProductCodeFgColorForPo'), reqObj, config);
    }

    async getMOInfoForPrcOrdCreation(reqObj: StyleMoRequest, config?: AxiosRequestConfig): Promise<ProcessingOrderCreationInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getMOInfoForPrcOrdCreation'), reqObj, config);
    }

    async getProcOrderBundlesForProcSerialAndPslIds(reqObj: PBUN_C_ProcOrderRequest, config?: AxiosRequestConfig): Promise<PBUN_R_ProcBundlesResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getProcOrderBundlesForProcSerialAndPslIds'), reqObj, config);
    }

    async getJobBundlesForProcSerialAndPslIds(reqObj: PBUN_C_ProcOrderRequest, config?: AxiosRequestConfig): Promise<PBUN_R_ProcJobBundlesResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getJobBundlesForProcSerialAndPslIds'), reqObj, config);
    }

    async getHeaderInfoForSewSerial(reqObj: SewSerialRequest, config?: AxiosRequestConfig): Promise<KnitHeaderInfoResoponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getHeaderInfoForSewSerial'), reqObj, config);
    }

    async deleteSPSProcesisngOrder(reqObj: ProcessingOrderSerialRequest, config?: AxiosRequestConfig): Promise<StyleProductFgColorResp> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteSPSProcesisngOrder'), reqObj, config);
    }

    async getPoQtysInfoForMoPSLIds(req: MoPslIdsRequest, config?: AxiosRequestConfig): Promise<MoPslQtyInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPoQtysInfoForMoPSLIds'), req, config);
    }

    async getPoSummary(req: ProcessingOrderSerialRequest, config?: AxiosRequestConfig): Promise<PoDataSummaryResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPoSummary'), req, config);
    }

    async getObjectWiseDataByJobNumber(req: SpsBundleSheetRequest, config?: AxiosRequestConfig): Promise<SewJobBundleSheetResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getObjectWiseDataByJobNumber'), req, config);
    }

    async getItemCodeWiseConsumptionByJobNumber(req: SpsBundleSheetRequest, config?: AxiosRequestConfig): Promise<SewitemCodeWiseConsumptionResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getItemCodeWiseConsumptionByJobNumber'), req, config);
    }
}

