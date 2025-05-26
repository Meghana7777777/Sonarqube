import { CommonRequestAttrs, CommonResponse, CreatePlanningDateRequest, DeleteSplitQuantityRequest, GlobalResponseObject, OrderAndOrderListResponse, OrderInfoByPoSerailResponse, OrderLineRequest, OrderQtyUpdateModel, OslIdInfoResponse, OslRefIdRequest, PackOrderCreationRequest, PackOrderCreationResponse, PoSerialRequest, PoSubLineResponse, ProductTypeReq, RawOrderHeaderInfoResponse, RawOrderInfoResponse, RawOrderLineBreakdownRequest, RawOrderLinePoSerialRequest, RawOrderLinesProdTypeSkuMapRequest, RawOrderNoRequest, RawOrderProdTypeSkuMapRequest, RawOrderSizesRequest, ManufacturingOrderNumberRequest, SewingCreationResponse, SewingOrderCreationRequest, SizeCodeRequest, MoCustomerInfoHelperResponse, MoListRequest, MoListResponse, MoListResponseData, MoStatusRequest, SplitOrderQuantityRequest, ValidatorResponse, SoStatusRequest, SoListResponse, SoListRequest, SoCustomerInfoHelperResponse } from '@xpparel/shared-models'; //'../../../shared-models/src'
import { AxiosRequestConfig } from 'axios';
import { OMSCommonAxiosService } from '../oms-common-axios-service';

export class OrderManipulationServices extends OMSCommonAxiosService {
    static getListOfMo(req: MoListRequest) {
        throw new Error('Method not implemented.');
    }

    private getURLwithMainEndPoint(childUrl: string) {
        return '/order-manipulation/' + childUrl;
    }

    async saveMoSizes(reqModel: RawOrderSizesRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('saveMoSizes'), reqModel, config);
    }

    async deleteMoSizes(reqModel: RawOrderNoRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteMoSizes'), reqModel, config);
    }

    async saveMoProductTypeRmSkuMapping(reqModel: RawOrderLinesProdTypeSkuMapRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('saveMoProductTypeRmSkuMapping'), reqModel, config);
    }

    async confirmMoProductTypeRmSkuMapping(reqModel: RawOrderNoRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('confirmMoProductTypeRmSkuMapping'), reqModel, config);
    }

    async deleteMOProductTypeRmSkuMapping(reqModel: RawOrderNoRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteMOProductTypeRmSkuMapping'), reqModel, config);
    }

    async saveMoSizeQtysBreakdown(reqModel: RawOrderLineBreakdownRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('saveMoSizeQtysBreakdown'), reqModel, config);
    }

    async deleteMoSizeQtysBreakdown(reqModel: RawOrderNoRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteMoSizeQtysBreakdown'), reqModel, config);
    }

    async confirmMo(reqModel: RawOrderNoRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('confirmMo'), reqModel, config);
    }

    async unConfirmMo(reqModel: RawOrderNoRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('unConfirmMo'), reqModel, config);
    }

  

    async deleteAllOrderInfo(reqModel: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteAllOrderInfo'), reqModel, config);
    }

    async getAllUnconfirmedOrders(reqModel: MoStatusRequest, config?: AxiosRequestConfig): Promise<RawOrderInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllUnconfirmedOrders'), reqModel, config);
    }
    async getOpenMo(reqModel: MoStatusRequest, config?: AxiosRequestConfig): Promise<RawOrderInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getOpenMo'), reqModel, config);
    }

    async getInProgressMo(reqModel: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<RawOrderInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getInProgressMo'), reqModel, config);
    }

    async getCompletedMo(reqModel: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<RawOrderInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getCompletedMo'), reqModel, config);
    }

    async getListOfMo(reqModel: MoListRequest, config?: AxiosRequestConfig): Promise<MoListResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getListOfMo'), reqModel, config);
    }

    async getListOfMoForOrderQtyRevision(reqModel: MoListRequest, config?: AxiosRequestConfig): Promise<MoListResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getListOfMoForOrderQtyRevision'), reqModel, config);
    }

 

    async getMoCustomerPoInfoForPoSerial(reqModel: PoSerialRequest, config?: AxiosRequestConfig): Promise<MoCustomerInfoHelperResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getMoCustomerPoInfoForPoSerial'), reqModel, config);
    }

    async checkIfSizesAlreadyUsedInExternalModule(reqModel: SizeCodeRequest, config?: AxiosRequestConfig): Promise<ValidatorResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('checkIfSizesAlreadyUsedInExternalModule'), reqModel, config);
    }

    async checkProductTypeAlreadyUsedInExternalModule(reqModel: ProductTypeReq, config?: AxiosRequestConfig): Promise<ValidatorResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('checkProductTypeAlreadyUsedInExternalModule'), reqModel, config);
    }

    async getOrderAndOrderLineInfo(reqModel: ManufacturingOrderNumberRequest, config?: AxiosRequestConfig): Promise<OrderAndOrderListResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getOrderAndOrderLineInfo'), reqModel, config);
    }

    async updateOrderQtyRevision(reqObj: OrderQtyUpdateModel, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateOrderQtyRevision'), reqObj, config);
    }

    async savePlannedCutDate(req: CreatePlanningDateRequest, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('savePlannedCutDate'), req, config);
    }

    async deletePlannedCutDate(req: CreatePlanningDateRequest, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deletePlannedCutDate'), req, config);
    }

    async getOrderInfoByOrderId(reqModel: SewingOrderCreationRequest, config?: AxiosRequestConfig): Promise<SewingCreationResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getOrderInfoByOrderId'), reqModel, config);
    }

    async getListofMoLines(reqModel: SewingOrderCreationRequest, config?: AxiosRequestConfig): Promise<MoListResponseData> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getListofMoLines'), reqModel, config);
    }

    async getOrderInfoByPoSerial(req: PoSerialRequest, config?: AxiosRequestConfig): Promise<OrderInfoByPoSerailResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getOrderInfoByPoSerial'), req, config);
    }


    async getOrderSubLineInfoByOrderLineId(req: OrderLineRequest, config?: AxiosRequestConfig): Promise<PoSubLineResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getOrderSubLineInfoByOrderLineId'), req, config);
    }


    async getOrderSubLineInfoByPoSerial(req: PoSerialRequest, config?: AxiosRequestConfig): Promise<PoSubLineResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getOrderSubLineInfoByPoSerial'), req, config);
    }

    async splitOrderQuantityInOrderLines(req: SplitOrderQuantityRequest, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('splitOrderQuantityInOrderLines'), req, config);
    }

    async deleteSplitQuantities(req: DeleteSplitQuantityRequest, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteSplitQuantities'), req, config);
    }

    async getPackOrderInfoByOrderId(reqModel: PackOrderCreationRequest, config?: AxiosRequestConfig): Promise<PackOrderCreationResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPackOrderInfoByOrderId'), reqModel, config);
    }
    async getOrderSubLineInfoByOrderSubLineId(req: OslRefIdRequest, config?: AxiosRequestConfig): Promise<OslIdInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getOrderSubLineInfoByOrderSubLineId'), req, config);
    }

    
    // CUTTING
    async saveSoSizes(reqModel: RawOrderSizesRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('saveSoSizes'), reqModel, config);
    }

    async deleteSoSizes(reqModel: RawOrderNoRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteSoSizes'), reqModel, config);
    }

    async saveSoProductTypeRmSkuMapping(reqModel: RawOrderLinesProdTypeSkuMapRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('saveSoProductTypeRmSkuMapping'), reqModel, config);
    }

    async confirmSoProductTypeRmSkuMapping(reqModel: RawOrderNoRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('confirmSoProductTypeRmSkuMapping'), reqModel, config);
    }

    async deleteSOProductTypeRmSkuMapping(reqModel: RawOrderNoRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteSOProductTypeRmSkuMapping'), reqModel, config);
    }

    async saveSoSizeQtysBreakdown(reqModel: RawOrderLineBreakdownRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('saveSoSizeQtysBreakdown'), reqModel, config);
    }

    async deleteSoSizeQtysBreakdown(reqModel: RawOrderNoRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteSoSizeQtysBreakdown'), reqModel, config);
    }

    async confirmSo(reqModel: RawOrderNoRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('confirmSo'), reqModel, config);
    }

    async unConfirmSo(reqModel: RawOrderNoRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('unConfirmSo'), reqModel, config);
    }

   

    async getOpenSo(reqModel: SoStatusRequest, config?: AxiosRequestConfig): Promise<RawOrderInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getOpenSo'), reqModel, config);
    }

    async getInProgressSo(reqModel: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<RawOrderInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getInProgressSo'), reqModel, config);
    }

    async getCompletedSo(reqModel: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<RawOrderInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getCompletedSo'), reqModel, config);
    }

    async getListOfSo(reqModel: SoListRequest, config?: AxiosRequestConfig): Promise<SoListResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getListOfSo'), reqModel, config);
    }

    async getListOfSoForOrderQtyRevision(reqModel: SoListRequest, config?: AxiosRequestConfig): Promise<SoListResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getListOfSoForOrderQtyRevision'), reqModel, config);
    }

   

    async getSoCustomerPoInfoForPoSerial(reqModel: PoSerialRequest, config?: AxiosRequestConfig): Promise<SoCustomerInfoHelperResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getSoCustomerPoInfoForPoSerial'), reqModel, config);
    }

  

   
}