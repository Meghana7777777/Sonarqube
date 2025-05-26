import { GlobalResponseObject, MC_ProductSubLineProcessTypeRequest, MC_StyleMoNumbersRequest, MOCProductFgColorVersionRequest, MOC_OpRoutingResponse, MOC_OpRoutingRetrievalRequest, MoProductFgColorReq, OpVersionAbstractResponse, OpVersionCheckResponse } from '@xpparel/shared-models';
import { AxiosRequestConfig } from 'axios';
import { OMSCommonAxiosService } from '../oms-common-axios-service';

export class MoOpRoutingService extends OMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/order-config/' + childUrl;
    }
    
    async saveOpVersionForMoProductFgColor(reqModel: MOCProductFgColorVersionRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('saveOpVersionForMoProductFgColor'), reqModel, config);
    }

    async getOpVersionForMoProductFgColor(reqModel: MOC_OpRoutingRetrievalRequest, config?: AxiosRequestConfig): Promise<MOC_OpRoutingResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getOpVersionForMoProductFgColor'), reqModel, config);
    }

    async getKnitGroupInfoForMOProductSubLineDetails(reqModel: MC_ProductSubLineProcessTypeRequest, config?: AxiosRequestConfig): Promise<MOC_OpRoutingResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getKnitGroupInfoForMOProductSubLineDetails'), reqModel, config);
    }

    async getCurrentVersionForGivenProductDetail(reqModel: MOCProductFgColorVersionRequest, config?: AxiosRequestConfig): Promise<OpVersionAbstractResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getCurrentVersionForGivenProductDetail'), reqModel, config);
    }

    async getRoutingGroupInfoForMOProductSubLineDetails(reqModel: MC_ProductSubLineProcessTypeRequest, config?: AxiosRequestConfig): Promise<MOC_OpRoutingResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getRoutingGroupInfoForMOProductSubLineDetails'), reqModel, config);
    }

    async checkGivenMOsHavingSameOpVersions(reqModel: MoProductFgColorReq[], config?: AxiosRequestConfig): Promise<OpVersionCheckResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('checkGivenMOsHavingSameOpVersions'), reqModel, config);
    }
}