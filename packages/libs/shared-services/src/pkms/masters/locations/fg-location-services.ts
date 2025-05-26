
import { FgGetAllLocationByRackIdRes, FgGetLocationByRackIdReq, FgLocationActiveReq, FgLocationCreateReq, FgLocationFilterReq, FgLocationsResponse, FgRackAndLocationRes, FgRackIdReq, FgRackIdsAndLevelsReq, FgRackOccupiedReq, FgRackOccupiedRes, FgTotalRackRes } from '@xpparel/shared-models';
import { AxiosRequestConfig } from 'axios';
import { PKMSCommonAxiosService } from '../../pkms-common-axios-service';


export class FgLocationService extends PKMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/locations/' + childUrl;
    }

    async createLocations(reqModel: FgLocationCreateReq, config?: AxiosRequestConfig): Promise<FgLocationsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createLocations'), reqModel, config);
    }

    async ActivateDeactivateLocations(reqModel: FgLocationActiveReq, config?: AxiosRequestConfig): Promise<FgLocationsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('ActivateDeactivateLocations'), reqModel, config);
    }

    async getAllLocationData(reqModel: FgLocationFilterReq, config?: AxiosRequestConfig): Promise<FgLocationsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllLocationData'), reqModel, config);
    }

    async getAllLocationsDataByRackId(req: FgGetLocationByRackIdReq, config?: AxiosRequestConfig): Promise<FgGetAllLocationByRackIdRes> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllLocationsDataByRackId'), req, config)
    }

    async getMappedRackLevelColumn(reqModel: FgRackOccupiedReq, config?: AxiosRequestConfig): Promise<FgRackOccupiedRes> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getMappedRackLevelColumn'), reqModel, config);
    }

    async getLocationsInRack(reqModel: FgRackIdReq, config?: AxiosRequestConfig): Promise<FgRackAndLocationRes> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getLocationsInRack'), reqModel, config);
    }

    async getSpecificLevelLocationsOfAllRacks(reqModel: FgRackIdsAndLevelsReq, config?: AxiosRequestConfig): Promise<FgTotalRackRes> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getSpecificLevelLocationsOfAllRacks'), reqModel, config);
    }

}