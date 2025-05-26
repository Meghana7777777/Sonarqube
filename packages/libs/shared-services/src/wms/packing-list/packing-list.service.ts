import { CommonRequestAttrs, CommonResponse, GlobalResponseObject, GrnRollInfoResponse, PackingListInfoModel, PackingListInfoResponse, PackingListSummaryRequest, PackingListSummaryResponse, PhBatchLotRollRequest, RollBasicInfoResponse, RollIdConsumedQtyRequest, RollIdsRequest, ManufacturingOrderItemDataResponse, ManufacturingOrderItemRequest, StockCodesRequest, StockConsumptionRequest, StockObjectInfoResponse, SupplierCodeReq, SupplierPoSummaryResponse, SuppliersResponse, PLHeadIdReq, DistinctPLItemCategoriesModelResp, ItemCategoryReqModel, ItemInfoQryRespModel } from '@xpparel/shared-models'; //'../../../shared-models/src'
import { AxiosRequestConfig } from 'axios';
import { RollIdRequest } from 'packages/libs/shared-models/src/wms/location-allocation/roll-id.request';
import { WMSCommonAxiosService } from '../common-axios-service';

export class PackingListService extends WMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/packing-list/' + childUrl;
    }
    async getPackListInfo(reqModel: PhBatchLotRollRequest, config?: AxiosRequestConfig): Promise<PackingListInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPackListInfo'), reqModel, config);
    }

    async getPendingSupplierPos(reqModel: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<SuppliersResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPendingSupplierPos'), reqModel, config);
    }

    async getPoSummaryForSupplier(reqModel: SupplierCodeReq, config?: AxiosRequestConfig): Promise<SupplierPoSummaryResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPoSummaryForSupplier'), reqModel, config);
    }

    async createPackList(reqModel: PackingListInfoModel, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createPackList'), reqModel, config);
    }

    async getPackListSummery(reqModel: PackingListSummaryRequest, config?: AxiosRequestConfig): Promise<PackingListSummaryResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPackListSummery'), reqModel, config);
    }

    async validateAndDeletePackingList(reqModel: PhBatchLotRollRequest, config?: AxiosRequestConfig) {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('validateAndDeletePackingList'), reqModel, config);
    }

    async printBarCodes(reqModel: PhBatchLotRollRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('printBarcodes'), reqModel, config);
    }

    async releaseBarCodes(reqModel: PhBatchLotRollRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('releaseBarcodes'), reqModel, config);
    }

    async getGrnRollInfoForRollId(reqModel: RollIdRequest, config?: AxiosRequestConfig): Promise<GrnRollInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getGrnRollInfoForRollId'), reqModel, config);
    }

    async getGrnRollInfoForRollIdGRN(reqModel: RollIdRequest, config?: AxiosRequestConfig): Promise<GrnRollInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getGrnRollInfoForRollIdGRN'), reqModel, config);
    }

    async getGrnRollInfoForRollIdAtIssuance(reqModel: RollIdRequest, config?: AxiosRequestConfig): Promise<GrnRollInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getGrnRollInfoForRollIdAtIssuance'), reqModel, config);
    }
    // async getFabricInwardDetails( config?: AxiosRequestConfig): Promise<FabricInwardDetailsResponse> {
    //     return await this.axiosPostCall(this.getURLwithMainEndPoint('getFabricInwardDetails'),  config);
    // }

    async packListNumbersDropDown(reqModel: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('packListNumbersDropDown'), reqModel, config);
    }

    async getPackListsForSupplier(reqModel: SupplierCodeReq, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPackListsForSupplier'), reqModel, config);
    }

    async getInStockObjectsForItemCode(reqModel: StockCodesRequest, config?: AxiosRequestConfig): Promise<StockObjectInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getInStockObjectsForItemCode'), reqModel, config);
    }

    async getRollsBasicInfoForRollIds(reqModel: RollIdsRequest, config?: AxiosRequestConfig): Promise<RollBasicInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getRollsBasicInfoForRollIds'), reqModel, config);
    }

    async updateTheConsumedStock(reqModel: StockConsumptionRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateTheConsumedStock'), reqModel, config);
    }

    async getAllActivePackingList(reqModel: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllActivePackingList'), reqModel, config);
    }

    async updateTheAllocatedStock(reqModel: RollIdConsumedQtyRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateTheAllocatedStock'), reqModel, config);
    }

    async updateTheIssuedStock(reqModel: RollIdConsumedQtyRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateTheIssuedStock'), reqModel, config);
    }

    async getMoItemQty(reqModel: ManufacturingOrderItemRequest, config?: AxiosRequestConfig): Promise<ManufacturingOrderItemDataResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getMoItemQty'), reqModel, config);
    }

    async getMeasuredWidthForAllocation(reqModel: RollIdsRequest, config?: AxiosRequestConfig): Promise<ManufacturingOrderItemDataResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getMeasuredWidthForAllocation'), reqModel, config);
    }
    async getRmPosForPackList(reqModel: PLHeadIdReq, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getRmPosForPackList'), reqModel, config);
    }

    async updatePickInspectionStatusForRollId(reqModel: RollIdsRequest, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updatePickInspectionStatusForRollId'), reqModel, config);
    }

    async getDistinctItemCategoriesData(req: PLHeadIdReq, config?: AxiosRequestConfig): Promise<DistinctPLItemCategoriesModelResp> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getDistinctItemCategoriesData'), req);
    }

    async getDistinctItemInfoByCategory(req: ItemCategoryReqModel, config?: AxiosRequestConfig): Promise<ItemInfoQryRespModel> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getDistinctItemInfoByCategory'), req, config);
    }

}
