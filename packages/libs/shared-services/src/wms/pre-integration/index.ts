
import { PoNumbersItemCodeRequest, CommonRequestAttrs, CommonResponse, GlobalResponseObject, ItemCodeInfoResponse, ItemStylesRequest, ItemCodesResponse, OpenPoDetailsResponse, OrderQtyUpdateModel, ManufacturingOrderDataInfoModelResponse, ManufacturingOrderNumberRequest, ManufacturingOrderResp, MoDumpModal, PO_StyleInfoResponse, SupplierCodeReq, SupplierInfoResponse, BatchCodesResponse, SplitManufacturingOrderQuantityRequest, DeleteManufacturingOrderSplitQuantityRequest } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { WMSCommonAxiosService } from "../common-axios-service";


export class PreIntegrationService extends WMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/pre-integration/' + childUrl;
    }


    /**
     * Service to get material information for supplier Po
     * @param reqObj 
     * @returns 
     */
    async getMaterialItemInfoBySupplierPo(reqObj: SupplierCodeReq, config?: AxiosRequestConfig): Promise<ItemCodeInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getMaterialItemInfoBySupplierPo'), reqObj, config);
    }

    /**
     * 
     * @param reqObj 
     * @param config 
     * @returns 
     */
    async getAllSupplierCodes(reqObj: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<SupplierInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllSupplierCodes'), reqObj, config);
    }
    async getStyleWiseStockSummary(config?: AxiosRequestConfig): Promise<ManufacturingOrderResp> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getStyleWiseStockSummary'), config);
    }

    async getAllStyleData(reqObj: CommonRequestAttrs, config?: AxiosRequestConfig):Promise<PO_StyleInfoResponse>{
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllStyleData'), reqObj, config);
    }

    async saveIntegrationManufacturingsData(reqObj: MoDumpModal, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('saveIntegrationManufacturingsData'), reqObj, config);
    }

    async getManufacturingorderInformation(reqObj: ManufacturingOrderNumberRequest, config?: AxiosRequestConfig): Promise<ManufacturingOrderDataInfoModelResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getManufacturingorderInformation'), reqObj, config);
    }


    async updateOrderQtyRevisionWms(reqObj: OrderQtyUpdateModel, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateOrderQtyRevisionWms'), reqObj, config);
    }

    async getItemCodesForExtStyle(reqModel:ItemStylesRequest,config?:AxiosRequestConfig):Promise<ItemCodesResponse>{
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getItemCodesForExtStyle'), reqModel,config);
    }

    async getBatchCodesForExtStyleAndItemCodes(reqModel:PoNumbersItemCodeRequest,config?:AxiosRequestConfig):Promise<BatchCodesResponse>{
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getBatchCodesForExtStyleAndItemCodes'), reqModel,config);
    }

    async splitManufacturingOrderQuantityInManufacturingOrderItems(reqModel:SplitManufacturingOrderQuantityRequest,config?:AxiosRequestConfig):Promise<BatchCodesResponse>{
        return await this.axiosPostCall(this.getURLwithMainEndPoint('splitManufacturingOrderQuantityInManufacturingOrderItems'), reqModel,config);
    }

    async deleteManufacturingOrderSplitQuantities(reqModel:DeleteManufacturingOrderSplitQuantityRequest,config?:AxiosRequestConfig):Promise<BatchCodesResponse>{
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteManufacturingOrderSplitQuantities'), reqModel,config);
    }

    async getManufacturingorderInfoForTrims(reqModel: any, config ?: AxiosRequestConfig): Promise < ManufacturingOrderDataInfoModelResponse > {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getManufacturingorderInfoForTrims'), reqModel, config);
    }

}