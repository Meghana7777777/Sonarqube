import { CommonRequestAttrs, GlobalResponseObject, FgRackIdReq, FgTotalRackRes, LocationContainerCartonInfoResponse } from '@xpparel/shared-models';
import { AxiosRequestConfig } from 'axios';
import { PKMSCommonAxiosService } from '../pkms-common-axios-service';

export class FGRackDashboardService extends PKMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/dashboard/' + childUrl;
    }

    async getRackAndLocationTotalData(reqModel: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getRackAndLocationTotalData'), reqModel, config);
    }

    async getRackAndLocationData(reqModel: FgRackIdReq, config?: AxiosRequestConfig): Promise<FgTotalRackRes> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getRackAndLocationData'), reqModel, config);
    }
    async getLocationsForRackLevelAndColumn(reqModel: FgRackIdReq, config?: AxiosRequestConfig): Promise<FgTotalRackRes> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getLocationsForRackLevelAndColumn'), reqModel, config);
    }

    async getLocationInfoByRack(reqModel: FgRackIdReq, config?: AxiosRequestConfig): Promise<LocationContainerCartonInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getLocationInfoByRack'), reqModel, config);
    }

}