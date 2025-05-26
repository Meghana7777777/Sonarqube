import { CommonRequestAttrs, GlobalResponseObject, MarkerTypeCreateRequest, MarkerTypeIdRequest, MarkerTypeResponse } from '@xpparel/shared-models'; 
import { AxiosRequestConfig } from 'axios';
import { OESCommonAxiosService } from '../../oes-common-axios-service';

export class MarkerTypeService extends OESCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/marker-type/' + childUrl;
    }

    async createMarkerType(reqModel: MarkerTypeCreateRequest, config?: AxiosRequestConfig): Promise<MarkerTypeResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createMarkerType'), reqModel, config);
    }

    async deleteMarkerType(reqModel: MarkerTypeIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteMarkerType'), reqModel, config);
    }

    async deActivateMarkerType(reqModel: MarkerTypeIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deActivateMarkerType'), reqModel, config);
    }

    async getAllMarkerTypes(reqModel: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<MarkerTypeResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllMarkerTypes'), reqModel, config);
    }

    async getMarkerType(reqModel: MarkerTypeIdRequest, config?: AxiosRequestConfig): Promise<MarkerTypeResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getMarkerType'), reqModel, config);
    }
   
    
}