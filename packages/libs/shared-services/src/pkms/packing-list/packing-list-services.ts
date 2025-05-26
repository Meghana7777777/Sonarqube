import { CartonBarcodeRequest, CartonBarCodesReqDto, CartonGarmentInfoResp, CartonHeadInfoResponse, CartonIdRequest, CartonPrintReqDto, CartonTrackInfoResp, CommonIdReqModal, CommonRequestAttrs, CommonResponse, FgWhSrIdPlIdsRequest, GlobalResponseObject, ItemsResponse, MoNumberResDto, PackIdRequest, PackingListIdRequest, PackListCreateModel, PackListIdRequest, PackSerialRequest, PGCartonInfoResponse, PKMSCartonIdsRequest, PKMSCartonInfoResponse, PKMSManufacturingOrderIdRequest, PKMSPackDispatchInfoResponse, PKMSPackListIdsRequest, PKMSPackListInfoResponse, PKMSPackOrderIdRequest, PKMSPackOrderInfoResponse, PlCartonWeightModel, PlCartonWeightResponse, PLGenQtyInfoResponse, PoIdRequest } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { PKMSCommonAxiosService } from "../pkms-common-axios-service";

export class PackListService extends PKMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/pack-list/' + childUrl;
    }

    async getPoToPLGenQtyInfo(req: PackSerialRequest, config?: AxiosRequestConfig): Promise<PLGenQtyInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPoToPLGenQtyInfo'), req, config);
    }

    async savePackListInfo(req: PackListCreateModel, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('savePackListInfo'), req, config);
    }

    async deletePackList(req: CommonIdReqModal, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deletePackList'), req, config);
    }

    async getOrderInfo(req: PackSerialRequest, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getOrderInfo'), req, config)
    }

    async getCartonPrintData(req: CartonPrintReqDto, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getCartonPrintData'), req, config)
    }
    async getPackListData(req: PackIdRequest, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPackListData'), req, config)
    }
    async getPackListDropDown(req: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPackListDropDown'), req, config)
    }

    async getPGCartonInfoForCartonBarcode(req: CartonIdRequest, config?: AxiosRequestConfig): Promise<PGCartonInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPGCartonInfoForCartonBarcode'), req, config)
    }

    async getPackListDetails(req: PackListIdRequest, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPackListDetails'), req, config)
    }

    async getPackOrderInfoByManufacturingOrderIds(req: PKMSManufacturingOrderIdRequest, config?: AxiosRequestConfig): Promise<PKMSPackOrderInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPackOrderInfoByManufacturingOrderIds'), req, config)
    }

    async getPackOrderInfoByPackOrderId(req: PKMSPackOrderIdRequest, config?: AxiosRequestConfig): Promise<PKMSPackOrderInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPackOrderInfoByPackOrderId'), req, config)
    }

    async getPackListInfoByPackListId(req: PKMSPackListIdsRequest, config?: AxiosRequestConfig): Promise<PKMSPackListInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPackListInfoByPackListId'), req, config)
    }

    async getPackingDispatchInfoByPackListId(req: PKMSPackListIdsRequest, config?: AxiosRequestConfig): Promise<PKMSPackDispatchInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPackingDispatchInfoByPackListId'), req, config)
    }

    async getCartonsByCartonId(req: PKMSCartonIdsRequest, config?: AxiosRequestConfig): Promise<PKMSCartonInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getCartonsByCartonId'), req, config)
    }


    async getBarcodeHeadInfo(req: CartonBarcodeRequest, config?: AxiosRequestConfig): Promise<CartonHeadInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getBarcodeHeadInfo'), req, config)
    }

    async getCartonGarmentInfo(req: FgWhSrIdPlIdsRequest, config?: AxiosRequestConfig): Promise<CartonGarmentInfoResp> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getCartonGarmentInfo'), req, config)
    }

    async getCartonTrackInfo(req: CartonBarcodeRequest, config?: AxiosRequestConfig): Promise<CartonTrackInfoResp> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getCartonTrackInfo'), req, config)
    }

    async getCartonWeightDetails(req: PackingListIdRequest, config?: AxiosRequestConfig): Promise<PlCartonWeightResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getCartonWeightDetails'), req, config)
    }

    async upDateCartonWeightDetails(req: PlCartonWeightModel, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('upDateCartonWeightDetails'), req, config)
    }

    async isCartonPackingDone(req: CartonBarCodesReqDto, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('isCartonPackingDone'), req, config)
    }

    async getOMSItemsForPKMS(req: MoNumberResDto, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getOMSItemsForPKMS'), req, config)
    }

    async getBOMItemsForPackOrder(req: PoIdRequest, config?: AxiosRequestConfig): Promise<ItemsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getBOMItemsForPackOrder'), req, config)
    }

}