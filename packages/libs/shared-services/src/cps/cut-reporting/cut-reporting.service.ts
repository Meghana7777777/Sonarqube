import { AdResponse, CutInventoryResponse, CutReportRequest, DbCutReportRequest, DocketLayingTimesResponse, DocketLaysResponse, FeatureGroupCutDetailsResp, FgFindingOptions, GlobalResponseObject, LayIdRequest, LayIdsRequest, PoDocketNumberRequest, PoSerialRequest } from '@xpparel/shared-models';
import { AxiosRequestConfig } from 'axios';
import { CPSCommonAxiosService } from '../cps-common-axios-service';

export class CutReportingService extends CPSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/cut-reporting/' + childUrl;
    }
    
    async validateAndTriggerReportCutForLay(reqModel: CutReportRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('validateAndTriggerReportCutForLay'), reqModel, config);
    }

    async processCutReportingForLay(reqModel: CutReportRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('processCutReportingForLay'), reqModel, config);
    }

    async processCutReportingForDocBundle(reqModel: DbCutReportRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('processCutReportingForDocBundle'), reqModel, config);
    }

    async validateAndTriggerReverseCutForLay(reqModel: LayIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('validateAndTriggerReverseCutForLay'), reqModel, config);
    }

    async processCutReversalForLay(reqModel: LayIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('processCutReversalForLay'), reqModel, config);
    }
    
    // info
    async getLayAndCutStatusForDocket(reqModel: PoDocketNumberRequest, config?: AxiosRequestConfig): Promise<DocketLaysResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getLayAndCutStatusForDocket'), reqModel, config);
    }

    // info
    async getCutInventoryForPo(reqModel: PoSerialRequest, config?: AxiosRequestConfig): Promise<CutInventoryResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getCutInventoryForPo'), reqModel, config);
    }

    // info
    async getTotalLayingTimeForDocket(reqModel: PoDocketNumberRequest, config?: AxiosRequestConfig): Promise<DocketLayingTimesResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getTotalLayingTimeForDocket'), reqModel, config);
    }

    // info
    async getTotalLayingTimeForPo(reqModel: PoSerialRequest, config?: AxiosRequestConfig): Promise<DocketLayingTimesResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getTotalLayingTimeForPo'), reqModel, config);
    }

    // Updater to WMS
    async updateTheConsumedStockToExternalSystem(reqModel: LayIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateTheConsumedStockToExternalSystem'), reqModel, config);
    }

}