import { CommonRequestAttrs, GlobalResponseObject, KnitHeaderInfoResoponse, MO_R_OslBundlesResponse, MoCustomerInfoHelperResponse, MoProductSubLineIdsRequest, MoPslQtyInfoResponse, OES_C_PoProdColorRequest, OES_R_PoOrderQtysResponse, OrderFeatures, PackMethodEnum, PO_C_PoSerialPslIdsRequest, PO_PoSerialRequest, PO_StyleInfoResponse, PoDataSummaryResponse, PoProdNameResponse, PoSerialRequest, PoSizesResponse, PoSummaryResponse, ProcessingOrderCreationInfoResponse, ProcessingOrderCreationRequest, ProcessingOrderInfoRequest, ProcessingOrderInfoResponse, ProcessingOrderSerialRequest, ProcessTypeEnum, ProductInfoResponse, StyleCodeRequest, StyleMoRequest, StyleProductCodeRequest, StyleProductFgColorResp } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { OESCommonAxiosService } from "../oes-common-axios-service";

export class CutOrderService extends OESCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/processing-order/' + childUrl;
    }

    async createCutProcessingOrder(moCreationReq: ProcessingOrderCreationRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createCutProcessingOrder'), moCreationReq, config);
    }


    async getPoInfoForStyleAndMo(styleMoReq: StyleMoRequest, config?: AxiosRequestConfig): Promise<ProcessingOrderInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPoInfoForStyleAndMo'), styleMoReq, config);
    }
    async getProcessingOrderInfo(prcOrdInfoReq: ProcessingOrderInfoRequest, config?: AxiosRequestConfig): Promise<ProcessingOrderInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getProcessingOrderInfo'), prcOrdInfoReq, config);
    }

    async getCutOrderCreatedStyles(reqObj: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<PO_StyleInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getCutOrderCreatedStyles'), reqObj, config);
    }

    async getProductInfoForGivenStyle(reqObj: StyleCodeRequest, config?: AxiosRequestConfig): Promise<ProductInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getProductInfoForGivenStyle'), reqObj, config);
    }

    async getCutOrderInfoByStyeAndProduct(reqObj: StyleProductCodeRequest, config?: AxiosRequestConfig): Promise<ProcessingOrderInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getCutOrderInfoByStyeAndProduct'), reqObj, config);
    }

    async getStyleProductCodeFgColorForPo(reqObj: ProcessingOrderSerialRequest, config?: AxiosRequestConfig): Promise<StyleProductFgColorResp> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getStyleProductCodeFgColorForPo'), reqObj, config);

    }

    async getMOInfoForPrcOrdCreation(reqObj: StyleMoRequest, config?: AxiosRequestConfig): Promise<ProcessingOrderCreationInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getMOInfoForPrcOrdCreation'), reqObj, config);
    }

    async deleteCutProcesisngOrder(reqObj: ProcessingOrderSerialRequest, config?: AxiosRequestConfig): Promise<StyleProductFgColorResp> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteCutProcesisngOrder'), reqObj, config);
    }

    async getMoHeaderInfoData(req: any, config?: AxiosRequestConfig): Promise<KnitHeaderInfoResoponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getMoHeaderInfoData'), req, config);
    }

    async getPoQtysInfoForMoPSLIds(req: MoProductSubLineIdsRequest, config?: AxiosRequestConfig): Promise<MoPslQtyInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPoQtysInfoForMoPSLIds'), req, config);
    }

    // async getPoSummary(req: ProcessingOrderSerialRequest, config?: AxiosRequestConfig): Promise<PoDataSummaryResponse> {
    //     return await this.axiosPostCall(this.getURLwithMainEndPoint('getPoSummary'), req, config);
    // }

    async getPoSummaryInfoForPoSerial(req: ProcessingOrderSerialRequest, config?: AxiosRequestConfig): Promise<PoSummaryResponse> {
        // return {
        //     status: true, errorCode: 0, internalMessage: '', data: [{
        //         poId: 12345,
        //         poDesc: "Spring Collection 2024",
        //         poSerial: 789,
        //         orderRefNo: "MO-2024-001",
        //         orderRefId: 56789,
        //         poName: "PO-2024-SPRING-001",
        //         productType: "Apparel",
        //         style: "XA-T001",
        //         styleDesc: "Premium Cotton T-Shirt",
        //         packMethod: PackMethodEnum.PACK, 
        //         moLines: ["ML-001", "ML-002", "ML-003"],
        //         poLines: [],
        //         oqUpdateSelections: [],
        //         sizes: ["S", "M", "L", "XL"]
        //     }
        //     ]
        // }
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPoSummaryInfoForPoSerial'), req, config);

    }

    async getPoProductNames(req: PoSerialRequest, config?: AxiosRequestConfig): Promise<PoProdNameResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPoProductNames'), req, config);
    }


    async getPoLineLevelSizeQtys(req: PoSerialRequest, config?: AxiosRequestConfig): Promise<PoSizesResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPoLineLevelSizeQtys'), req, config);
    }

    async getCutHeaderInfoForProcSerial(req: PO_PoSerialRequest, config?: AxiosRequestConfig): Promise<KnitHeaderInfoResoponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getCutHeaderInfoForProcSerial'), req, config);
    }

    async getPslBundlesForPoSerial(req: PO_C_PoSerialPslIdsRequest, config?: AxiosRequestConfig): Promise<MO_R_OslBundlesResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPslBundlesForPoSerial'), req, config);
    }

    async getPoSummary(reqModel: PoSerialRequest, config?: AxiosRequestConfig): Promise<PoSummaryResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPoSummary'), reqModel, config);
    }

    async getMoCustomerPoInfoForPoSerial(reqModel: PO_PoSerialRequest, config?: AxiosRequestConfig): Promise<MoCustomerInfoHelperResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getMoCustomerPoInfoForPoSerial'), reqModel, config);
    }

    async getMoInfoByProcessingSerial(reqModel: PO_PoSerialRequest, config?: AxiosRequestConfig): Promise<MoCustomerInfoHelperResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getMoInfoByProcessingSerial'), reqModel, config);
    }

    async getCutOrderQtysForPoProdColor(reqModel: OES_C_PoProdColorRequest, config?: AxiosRequestConfig): Promise<OES_R_PoOrderQtysResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getCutOrderQtysForPoProdColor'), reqModel, config);
    }
}
