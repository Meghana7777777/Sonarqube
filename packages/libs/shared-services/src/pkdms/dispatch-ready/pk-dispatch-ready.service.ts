import { AxiosRequestConfig } from 'axios';
import { PkDSetBarcodesResponse, PkDSetCreateRequest, PkDSetGetBarcodesRequest, PkDSetIdsRequest, PkDSetItemBarcodesResponse, PkDSetItemIdsRequest, PkDSetResponse, PkDSetSubItemContainerMappingRequest, GlobalResponseObject } from '@xpparel/shared-models';
import { PkDMSCommonAxiosService } from '../common-axios.service';


export class PkDispatchReadyService extends PkDMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/dispatch-ready/' + childUrl;
    }

    async createDispatchReady(reqModel: PkDSetCreateRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createDispatchReady'), reqModel, config);
    }

    async deleteDispatchReady(reqModel: PkDSetIdsRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteDispatchReady'), reqModel, config);
    }

    async putDSetSubItemInTheContainer(reqModel: PkDSetSubItemContainerMappingRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('putDSetSubItemInTheContainer'), reqModel, config);
    }

    async removeDSetSubItemInTheContainer(reqModel: PkDSetSubItemContainerMappingRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('removeDSetSubItemInTheContainer'), reqModel, config);
    }

    async getDsetBarcodeInfo(reqModel: PkDSetGetBarcodesRequest, config?: AxiosRequestConfig): Promise<PkDSetBarcodesResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getDsetBarcodeInfo'), reqModel, config);
    }

    async getDsetItemBarcodeInfo(reqModel: PkDSetGetBarcodesRequest, config?: AxiosRequestConfig): Promise<PkDSetItemBarcodesResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getDsetItemBarcodeInfo'), reqModel, config);
    }

    async updateSubItemPrintStatus(reqModel: PkDSetItemIdsRequest, config?: AxiosRequestConfig): Promise<PkDSetItemBarcodesResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateSubItemPrintStatus'), reqModel, config);
    }

    async updateContainerPrintStatus(reqModel: PkDSetItemIdsRequest, config?: AxiosRequestConfig): Promise<PkDSetItemBarcodesResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateContainerPrintStatus'), reqModel, config);
    }

    async releaseSubItemPrintStatus(reqModel: PkDSetItemIdsRequest, config?: AxiosRequestConfig): Promise<PkDSetItemBarcodesResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('releaseSubItemPrintStatus'), reqModel, config);
    }

    async releaseContainerPrintStatus(reqModel: PkDSetItemIdsRequest, config?: AxiosRequestConfig): Promise<PkDSetItemBarcodesResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('releaseContainerPrintStatus'), reqModel, config);
    }

}