import { AxiosRequestConfig } from 'axios';
import { OESCommonAxiosService } from '../oes-common-axios-service';
import { CommonResponse, GlobalResponseObject, MarkerCreateRequest, MarkerIdRequest, MarkerInfoResponse, PoCreateRequest, PoProdTypeAndFabResponse, PoProdutNameRequest, PoSerialRequest, PoSizesResponse, PoSummaryModel, PoSummaryResponse, ProductNameItemsRequest, RawOrderNoRequest } from '@xpparel/shared-models';


export class PoMarkerService extends OESCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/po-marker/' + childUrl;
    }

    async createPoMarker(reqModel: MarkerCreateRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createPoMarker'), reqModel, config);
    }

    async createGlobalMarker(reqModel: MarkerCreateRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createGlobalMarker'), reqModel, config);
    }

    async deletePoMarker(reqModel: MarkerIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deletePoMarker'), reqModel, config);
    }

    async getPoMarkers(reqModel: PoProdutNameRequest, config?: AxiosRequestConfig): Promise<MarkerInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPoMarkers'), reqModel, config);
    }

    async getPoMarker(reqModel: MarkerIdRequest, config?: AxiosRequestConfig): Promise<MarkerInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPoMarker'), reqModel, config);
    }

    async setPoMarkerDefault(reqModel: MarkerIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('setPoMarkerDefault'), reqModel, config);
    }

    async getPoMarkersByProdNameAndFabComb(reqModel: ProductNameItemsRequest, config?: AxiosRequestConfig): Promise<MarkerInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPoMarkersByProdNameAndFabComb'), reqModel, config);
    }
    
}