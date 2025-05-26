
import { AxiosRequestConfig } from 'axios';
import { PKMSCommonAxiosService } from '../../pkms-common-axios-service';
import { CommonRequestAttrs, FgGetAllRackResp, FgRackCreateReq, FgRackFilterRequest, FgRacksActivateReq, FgRacksRespons } from '@xpparel/shared-models';

export class FgRackServices extends PKMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/racks/' + childUrl;
    }

    async createRacks(reqModel: FgRackCreateReq, config?: AxiosRequestConfig): Promise<FgRacksRespons> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createRacks'), reqModel, config);
    }

    async activedeactiveRacks(reqModel: FgRacksActivateReq, config?: AxiosRequestConfig): Promise<FgRacksRespons> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('activedeactiveRacks'), reqModel, config);
    }

    async getAllRacksData(reqModel: FgRackFilterRequest, config?: AxiosRequestConfig): Promise<FgRacksRespons> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllRacksData'), reqModel, config);
    }
    async getRacksData(reqModel: FgRackFilterRequest, config?: AxiosRequestConfig): Promise<FgRacksRespons> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllRacksData'), reqModel, config);
    }


    async getAllRacksDataDropdown(req: FgRackFilterRequest, config?: AxiosRequestConfig): Promise<FgGetAllRackResp> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllRacksDataDropdown'), req, config)
    }
}