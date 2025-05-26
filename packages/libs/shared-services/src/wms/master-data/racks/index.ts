import { CommonRequestAttrs, GetAllRacksResp, RacksActivateRequest, RacksCreateRequest, RacksResponse } from '@xpparel/shared-models';
import { AxiosRequestConfig } from 'axios';
import { WMSCommonAxiosService } from '../../common-axios-service';

export class RacksServices extends WMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/racks/' + childUrl;
    }

    async createRacks(reqModel: RacksCreateRequest, config?: AxiosRequestConfig): Promise<RacksResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createRacks'), reqModel, config);
    }

    async activedeactiveRacks(reqModel: RacksActivateRequest, config?: AxiosRequestConfig): Promise<RacksResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('activedeactiveRacks'), reqModel, config);
    }

    async getAllRacksData(reqModel: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<RacksResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllRacksData'), reqModel, config);
    }

    async getAllRacksDataa(config?: AxiosRequestConfig): Promise<GetAllRacksResp> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllRacksDataa'), config)
    }
}