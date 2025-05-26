import { BinsActivateRequest, BinsCreateRequest, CommonRequestAttrs, GetAllBinsByRackIdRes, GetBinsByRackIdReq,RackIdRequest, RackOccupiedRequest, BinsResponse, RackIdsAndLevelsRequest, TotalRackResponse, RackAndBInResponse, FgRackOccupiedRes } from '@xpparel/shared-models';
import { AxiosRequestConfig } from 'axios';
import { WMSCommonAxiosService } from '../../common-axios-service';

export class BinsServices extends WMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/bins/' + childUrl;
    }

    async createBins(reqModel: BinsCreateRequest, config?: AxiosRequestConfig): Promise<BinsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createBins'), reqModel, config);
    }

    async ActivateDeactivateBins(reqModel: BinsActivateRequest, config?: AxiosRequestConfig):Promise<BinsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('ActivateDeactivateBins'), reqModel, config);
    }

    async getAllBinData(reqModel: CommonRequestAttrs, config?: AxiosRequestConfig):Promise<BinsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllBinData'), reqModel, config);
    }

    async getAllBinsDataByRackId(req: GetBinsByRackIdReq, config?: AxiosRequestConfig): Promise<GetAllBinsByRackIdRes> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllBinsDataByRackId'), req, config)
    }

    async getMappedRackLevelColumn(reqModel: RackOccupiedRequest, config?: AxiosRequestConfig): Promise<FgRackOccupiedRes> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getMappedRackLevelColumn'), reqModel, config);
    }

    async getBinsInRack(reqModel: RackIdRequest, config?: AxiosRequestConfig): Promise<RackAndBInResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getBinsInRack'), reqModel, config);
    }

    async getSpecificLevelBinsOfAllRacks(reqModel: RackIdsAndLevelsRequest, config?: AxiosRequestConfig): Promise<TotalRackResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getSpecificLevelBinsOfAllRacks'), reqModel, config);
    }

}