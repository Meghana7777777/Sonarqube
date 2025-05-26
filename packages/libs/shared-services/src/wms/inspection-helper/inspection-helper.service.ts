import { BasicRollInfoRespone, CodesRequest, CodesResponse, CommonRequestAttrs, GlobalResponseObject, GrnRollInfoResponse, HeaderDetailsResponse, InsBasicRollInfoRequest, InsFabInsCreateExtRefRequest, InsFabInsSelectedBatchResponse, InsPhIdRequest, InsRollBasicInfoResponse, PackListRecordForPackListIdResponse, PhItemIdResponse, PhItemLInesActualResponse, PlBatchLotRequest, RelaxationPointDetailsRespone, RollCountResponse, RollIdRequest, RollNumberRequest } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { WMSCommonAxiosService } from "../common-axios-service";

export class InspectionHelperService extends WMSCommonAxiosService {

    private getUrlWithMainEndPoint(childUrl: string) {
        return '/inspection-helper/' + childUrl;
    }

    async getRollCountByPackListIdOrBatchNoOrLotNo(req?: PlBatchLotRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<RollCountResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getRollCountByPackListIdOrBatchNoOrLotNo'), req, config)
    }
    async getItemLineActualRecord(req?: RollNumberRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<PhItemLInesActualResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getItemLineActualRecord'), req, config)
    }

    async getBasicRollInfoForRollId(req?: RollNumberRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<BasicRollInfoRespone> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getBasicRollInfoForRollId'), req, config)
    }
    async getGrnRollInfoForRollId(req?: RollIdRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<GrnRollInfoResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getGrnRollInfoForRollId'), req, config)
    }

    async getRelaxationPointDetailsForRollId(req?: RollNumberRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<RelaxationPointDetailsRespone> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getRelaxationPointDetailsForRollId'), req, config)
    }

    async getPhItemIdByPhItemLineId(req?: RollNumberRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<PhItemIdResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getPhItemIdByPhItemLineId'), req, config)
    }

    async getFabricInspectionSelectedItems(req: InsFabInsCreateExtRefRequest, config?: AxiosRequestConfig): Promise<InsFabInsSelectedBatchResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getFabricInspectionSelectedItems'), req, config)
    }

    async getPackListRecordDataForPackListId(req: InsPhIdRequest, config?: AxiosRequestConfig): Promise<PackListRecordForPackListIdResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getPackListRecordDataForPackListId'), req, config)
    }

    async getBasicRollInfoForInspection(req: InsBasicRollInfoRequest, config?: AxiosRequestConfig): Promise<InsRollBasicInfoResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getBasicRollInfoForInspection'), req, config)
    }

    async updateShowInInventory(req: InsPhIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('updateShowInInventory'), req, config)
    }

    async getHeaderDetailsForInspection(req: InsPhIdRequest, config?: AxiosRequestConfig): Promise<HeaderDetailsResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getHeaderDetailsForInspection'), req, config)
    }

    async getAllStyles(req: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<CodesResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getAllStyles'), req, config)
    }

    async getLotsForStyle(req: CodesRequest, config?: AxiosRequestConfig): Promise<CodesResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getLotsForStyle'), req, config);
    }

    async getItemCodesForLot(req: CodesRequest, config?: AxiosRequestConfig): Promise<CodesResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getItemCodesForLot'), req, config);
    }

    async getRollIdsForItemCode(req: CodesRequest, config?: AxiosRequestConfig): Promise<CodesResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getRollIdsForItemCode'), req, config);
    }

}