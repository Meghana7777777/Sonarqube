import { AxiosRequestConfig } from 'axios';
import { OESCommonAxiosService } from '../oes-common-axios-service';
import { CommonResponse, GlobalResponseObject, PoCreateRequest, PoOqResponse, PoOqUpdateRequest, PoSerialRequest, PoSummaryModel, PoSummaryResponse, RawOrderNoRequest } from '@xpparel/shared-models';


export class PoqService extends OESCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/poq/' + childUrl;
    }

    async poAdditionalQtyUpdate(reqModel: PoOqUpdateRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('poAdditionalQtyUpdate'), reqModel, config);
    }

    async deleteAdditionalQtyUpdate(reqModel: PoSerialRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteAdditionalQtyUpdate'), reqModel, config);
    }

    async getPoAdditionalQtyInfo(reqModel: PoSerialRequest, config?: AxiosRequestConfig): Promise<PoOqResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPoAdditionalQtyInfo'), reqModel, config);
    }

}