import { CommonRequestAttrs, GlobalResponseObject, MOP_OpRoutingRetrievalRequest, MOP_OpRoutingVersionRequest, OpVersionAbstractResponse, OpVersionReq, ProcessTypesResponse, SI_MoNumberRequest, SI_SoNumberRequest, StyleOpRoutingResponse, StyleProductCodeRequest, StyleProductTypeOpVersionAbstractResponse } from '@xpparel/shared-models';
import { AxiosRequestConfig } from 'axios';
import { OMSCommonAxiosService } from '../oms-common-axios-service';

export class StyleProductOpService extends OMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/style-op-routing/' + childUrl;
    }


    // for landing page
    async getStyleProductTypeOpVersionAbstract(reqModel: OpVersionReq, config?: AxiosRequestConfig): Promise<StyleProductTypeOpVersionAbstractResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getStyleProductTypeOpVersionAbstract'), reqModel, config);
    }

    async createOpVersionForStyleAndProductType(reqModel: MOP_OpRoutingVersionRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createOpVersionForStyleAndProductType'), reqModel, config);
    }

    // operation version drop down
    async getOpVersionsForStyleAndProductType(reqModel: MOP_OpRoutingRetrievalRequest, config?: AxiosRequestConfig): Promise<OpVersionAbstractResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getOpVersionsForStyleAndProductType'), reqModel, config);
    }

    //  Operation version info
    async getOpVersionInfoForStyleAndProductType(reqModel: MOP_OpRoutingRetrievalRequest, config?: AxiosRequestConfig): Promise<StyleOpRoutingResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getOpVersionInfoForStyleAndProductType'), reqModel, config);
    }

    async deleteOpVersionForStyleAndProductType(reqModel: MOP_OpRoutingRetrievalRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteOpVersionForStyleAndProductType'), reqModel, config);
    }

    async getAndSaveStyleProductTypeForMO(reqModel: SI_MoNumberRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAndSaveStyleProductTypeForMO'), reqModel, config);
    }

    async getAndSaveStyleProductTypeForSO(reqModel: SI_SoNumberRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAndSaveStyleProductTypeForSO'), reqModel, config);
    }

    async getProcessTypesForStyle(reqModel: StyleProductCodeRequest, config?: AxiosRequestConfig): Promise<ProcessTypesResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getProcessTypesForStyle'), reqModel, config);
    }

}