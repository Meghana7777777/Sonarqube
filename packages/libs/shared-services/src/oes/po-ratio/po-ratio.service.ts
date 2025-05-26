import { AxiosRequestConfig } from 'axios';
import { OESCommonAxiosService } from '../oes-common-axios-service';
import { CommonResponse, GlobalResponseObject, PoCreateRequest, PoFabricRatioResponse, PoItemCodeRequest, PoProdTypeAndFabResponse, PoProdutNameRequest, PoRatioCreateRequest, PoRatioIdMarkerIdRequest, PoRatioIdRequest, PoRatioMarkerIdResponse, PoRatioResponse, PoRatioSizeRequest, PoSerialRequest, PoSizesResponse, PoSummaryModel, PoSummaryResponse, RatioDocGenStatusRequest, RawOrderNoRequest } from '@xpparel/shared-models';


export class PoRatioService extends OESCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/po-ratio/' + childUrl;
    }

    async createPoRatio(reqModel: PoRatioCreateRequest[], config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createPoRatio'), reqModel, config);
    }

    async deletePoRatio(reqModel: PoRatioIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deletePoRatio'), reqModel, config);
    }

    async getAllRatiosForPo(reqModel: PoProdutNameRequest, config?: AxiosRequestConfig): Promise<PoRatioResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllRatiosForPo'), reqModel, config);
    }

    async getRatioDetailedInfoForRatioId(reqModel: PoRatioIdRequest, config?: AxiosRequestConfig): Promise<PoRatioResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getRatioDetailedInfoForRatioId'), reqModel, config);
    }

    async getAllRatiosForPoFabric(reqModel: PoItemCodeRequest, config?: AxiosRequestConfig): Promise<PoFabricRatioResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllRatiosForPoFabric'), reqModel, config);
    }

    async getCumRatioQtyFabricWiseForPo(reqModel: PoItemCodeRequest, config?: AxiosRequestConfig): Promise<PoFabricRatioResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getCumRatioQtyFabricWiseForPo'), reqModel, config);
    }

    async updateDocGenStatusByRatioId(reqModel: RatioDocGenStatusRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateDocGenStatusByRatioId'), reqModel, config);
    }

    async setMarkerVersionForRatio(reqModel: PoRatioIdMarkerIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('setMarkerVersionForRatio'), reqModel, config);
    }

    async getMarkerVersionIdForRatio(reqModel: PoRatioIdRequest, config?: AxiosRequestConfig): Promise<PoRatioMarkerIdResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getMarkerVersionIdForRatio'), reqModel, config);
    }

    async updateRatioSizes(reqModel: PoRatioSizeRequest[], config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateRatioSizes'), reqModel, config);
    }

    async createPoRatioForKnitting(req: PoRatioCreateRequest[], config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createPoRatioForKnitting'), req, config);
    }

    async getRatioDetailedInfoForRatioIdWithRatioCode(reqModel: PoRatioIdRequest, config?: AxiosRequestConfig): Promise<PoRatioResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getRatioDetailedInfoForRatioIdWithRatioCode'), reqModel, config);
    }
   
}