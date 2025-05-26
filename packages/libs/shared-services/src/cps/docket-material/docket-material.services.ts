import { ActualMarkerCreateRequest, ActualMarkerResponse, CommonRequestAttrs, DocMaterialAllocationRequest, DocMaterialAllocationResponse, GlobalResponseObject, ItemCodeInfoResponse, ItemCodeRequest, LockedFabMaterialResponse, MaterialRequestNoRequest, OnFloorConfirmedRollBarcodeRequest, OnFloorConfirmedRollIdsRequest, OnFloorRollIdsRequest, PoDocketGroupRequest, PoDocketNumberRequest, RollAllocationStatusResponse, RollIdRequest, RollIdsRequest, RollLocationRequest, StockCodesRequest, StockObjectInfoResponse, WhFabReqItemStatusRequest, WhFabReqStatusRequest, WhReqCreateHeaderResponse } from '@xpparel/shared-models';
import { AxiosRequestConfig } from 'axios';
import { CPSCommonAxiosService } from '../cps-common-axios-service';

export class DocketMaterialServices extends CPSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/docket-material/' + childUrl;
    }
    
    async createDocketMaterialRequest(reqModel: DocMaterialAllocationRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createDocketMaterialRequest'), reqModel, config);
    }

    async deleteDocketMaterialRequest(reqModel: MaterialRequestNoRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteDocketMaterialRequest'), reqModel, config);
    }

    async deleteRollInDocketMaterialRequest(reqModel: MaterialRequestNoRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteRollInDocketMaterialRequest'), reqModel, config);
    }

    async getDocketMaterialRequests(reqModel: PoDocketGroupRequest, config?: AxiosRequestConfig): Promise<DocMaterialAllocationResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getDocketMaterialRequests'), reqModel, config);
    }

    // USED BY WMS
    async getDocketMaterialsForWhReqCreation(reqModel: MaterialRequestNoRequest, config?: AxiosRequestConfig): Promise<WhReqCreateHeaderResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getDocketMaterialsForWhReqCreation'), reqModel, config);
    }

    async getAvailableRollsForItemCode(reqModel: StockCodesRequest, config?: AxiosRequestConfig): Promise<StockObjectInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAvailableRollsForItemCode'), reqModel, config);
    }

    async unlockMaterial(reqModel: ItemCodeRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('unlockMaterial'), reqModel, config);
    }

    async changeDocketMaterialReqStatus(reqModel: WhFabReqStatusRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('changeDocketMaterialReqStatus'), reqModel, config);
    }

    async changeDocketMaterialStatus(reqModel: WhFabReqItemStatusRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('changeDocketMaterialStatus'), reqModel, config);
    }

    async getOnFloorRolls(reqModel: RollLocationRequest, config?: AxiosRequestConfig): Promise<LockedFabMaterialResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getOnFloorRolls'), reqModel, config);
    }


    async changeRollLocation(reqModel: OnFloorRollIdsRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('changeRollLocation'), reqModel, config);
    }

    async getPendingPresenceConfirmationRolls(reqModel: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<LockedFabMaterialResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPendingPresenceConfirmationRolls'), reqModel, config);
    }

    async confirmRollPresenceByBarcode(reqModel: OnFloorConfirmedRollBarcodeRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('confirmRollPresenceByBarcode'), reqModel, config);
    }

    async confirmRollPresence(reqModel: OnFloorConfirmedRollIdsRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('confirmRollPresence'), reqModel, config);
    }

    async updateIssuedQtyByRollIds(reqModel: RollIdsRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateIssuedQtyByRollIds'), reqModel, config);
    }

    async getRollAllocationstatus(reqModel: RollIdRequest, config?: AxiosRequestConfig): Promise<RollAllocationStatusResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getRollAllocationstatus'), reqModel, config);
    }

    async createActualMarker(reqModel: ActualMarkerCreateRequest, config?: AxiosRequestConfig): Promise<ActualMarkerResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createActualMarker'), reqModel, config);
    }

    async getActualMarkerByDocketGroup(reqModel: PoDocketGroupRequest, config?: AxiosRequestConfig): Promise<ActualMarkerResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getActualMarkerByDocketGroup'), reqModel, config);
    }

}