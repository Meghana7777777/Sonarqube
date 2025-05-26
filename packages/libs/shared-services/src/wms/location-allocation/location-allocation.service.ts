import { BinDetailsResponse, BinIdRequest, BinPalletMappingRequest, CommonRequestAttrs, GlobalResponseObject, GrnConfirmRequest, GrnUnLoadingRequest, InspectionPalletRollConfirmationRequest, InspectionPalletRollsResponse, PackListIdRequest, PackListPalletCfNcfPfendingRollsResponse, PalletDetailsResponse, PalletIdRequest, PalletRollMappingRequest, PalletRollsResponse, PgIdRequest, PgRollsResponse, PhBatchLotRollRequest, RackBinPalletsResponse, RollIssueQtyRequest, RollsGrnRequest, WarehousePalletRollsResponse, RollPalletMappingValidationResponse, RollIdsRequest, PalletAndBinResponse, LocationIdRequest, RollLocationsResponse } from '@xpparel/shared-models'; //'../../../shared-models/src'
import { WMSCommonAxiosService } from '../common-axios-service';
import { AxiosRequestConfig } from 'axios';

export class LocationAllocationService extends WMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/location-allocation/' + childUrl;
    }

    async validateConfirmRollsToPallet(reqModel: PalletRollMappingRequest, config?: AxiosRequestConfig): Promise<RollPalletMappingValidationResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('validateConfirmRollsToPallet'), reqModel, config);
    }

    async confirmRollsToPallet(reqModel: PalletRollMappingRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('confirmRollsToPallet'), reqModel, config);
    }

    async allocateRollsToPallet(reqModel: PalletRollMappingRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('allocateRollsToPallet'), reqModel, config);
    }

    async getPalletMappingInfoWithoutRolls(reqModel: PalletIdRequest, config?: AxiosRequestConfig): Promise<PalletDetailsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPalletMappingInfoWithoutRolls'), reqModel, config);
    }

    async getPalletsMappedForPackingList(reqModel: PackListIdRequest, config?: AxiosRequestConfig): Promise<PalletDetailsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPalletsMappedForPackingList'), reqModel, config);
    }

    async getInspectionPalletMappingInfoWithRolls(reqModel: PalletIdRequest, config?: AxiosRequestConfig): Promise<InspectionPalletRollsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getInspectionPalletMappingInfoWithRolls'), reqModel, config);
    }

    async getWarehousePalletMappingInfoWithRolls(reqModel: PalletIdRequest, config?: AxiosRequestConfig): Promise<WarehousePalletRollsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getWarehousePalletMappingInfoWithRolls'), reqModel, config);
    }

    async allocatePalletsToBin(reqModel: BinPalletMappingRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('allocatePalletsToBin'), reqModel, config);
    }

    async confirmPalletsToBin(reqModel: BinPalletMappingRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('confirmPalletsToBin'), reqModel, config);
    }

    async allocatePakcListPalletsToBin(reqModel: PackListIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('allocatePakcListPalletsToBin'), reqModel, config);
    }

    async getBinInfoWithoutPallets(reqModel: BinIdRequest, config?: AxiosRequestConfig): Promise<BinDetailsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getBinInfoWithoutPallets'), reqModel, config);
    }

    async getBinsMappedForPackingList(reqModel: PackListIdRequest, config?: AxiosRequestConfig): Promise<BinDetailsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getBinsMappedForPackingList'), reqModel, config);
    }

    async getBinPalletsWithRolls(reqModel: BinIdRequest, config?: AxiosRequestConfig): Promise<RackBinPalletsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getBinPalletsWithRolls'), reqModel, config);
    }

    async getBinPalletsWithoutRolls(reqModel: BinIdRequest, config?: AxiosRequestConfig): Promise<RackBinPalletsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getBinPalletsWithoutRolls'), reqModel, config);
    }

    async getPgIdsForPackListId(reqModel: PackListIdRequest, config?: AxiosRequestConfig): Promise<PgRollsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPgIdsForPackListId'), reqModel, config);
    }

    async getInspectionRollsForPgId(reqModel: PgIdRequest, config?: AxiosRequestConfig): Promise<PgRollsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getInspectionRollsForPgId'), reqModel, config);
    }

    async getWarehouseRollsForForPgId(reqModel: PgIdRequest, config?: AxiosRequestConfig): Promise<PgRollsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getWarehouseRollsForForPgId'), reqModel, config);
    }

    async createPalletGroupsForPackList(reqModel: PackListIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createPalletGroupsForPackList'), reqModel, config);
    }

    async getAllSpaceFreePalletsInWarehouse(reqModel: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<PalletDetailsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllSpaceFreePalletsInWarehouse'), reqModel, config);
    }


    async getAllPendingToPalletConfirmationRollsInPackingList(reqModel: PackListIdRequest, config?: AxiosRequestConfig): Promise<PackListPalletCfNcfPfendingRollsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllPendingToPalletConfirmationRollsInPackingList'), reqModel, config);
    }

    async getAllPalletConfirmationRollsInPackingList(reqModel: PackListIdRequest, config?: AxiosRequestConfig): Promise<PackListPalletCfNcfPfendingRollsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllPalletConfirmationRollsInPackingList'), reqModel, config);
    }

    async getAllSpaceFreeBinsInWarehouse(reqModel: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<BinDetailsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllSpaceFreeBinsInWarehouse'), reqModel, config);
    }

    // NEW 12-11-2023
    async getPalletMappingInfoWithRolls(reqModel: PalletIdRequest, config?: AxiosRequestConfig): Promise<PalletRollsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPalletMappingInfoWithRolls'), reqModel, config);
    }

    // NEW 12-11-2023
    async deAllocateRollsToPallet(reqModel: PalletRollMappingRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deAllocateRollsToPallet'), reqModel, config);
    }

    // NEW 12-11-2023
    async issueRollQuantity(reqModel: RollIssueQtyRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('issueRollQuantity'), reqModel, config);
    }

    // NEW 12-11-2023
    async unmapPalletFromABin(reqModel: PalletIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('unmapPalletFromABin'), reqModel, config);
    }

    async getPalletAndBinbyRollIdData(reqModel: RollIdsRequest, config?: AxiosRequestConfig): Promise<PalletAndBinResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPalletAndBinbyRollIdData'), reqModel, config);
    }

    async getLocationDetailsForRollIds(reqModel: RollIdsRequest, config?: AxiosRequestConfig): Promise<RollLocationsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getLocationDetailsForRollIds'), reqModel, config);
    }

    async getPalletGroupInfo(reqModel: PackListIdRequest, config?: AxiosRequestConfig): Promise<RollLocationsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPalletGroupInfo'), reqModel, config);
    }


}