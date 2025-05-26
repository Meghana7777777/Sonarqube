import { AdResponse, CommonResponse, DocketLaysResponse, GlobalResponseObject, LayIdConfirmationRequest, LayIdRequest, LayIdsRequest, LayItemAddRequest, LayItemIdRequest, LayReportingCuttingResponse, LayerMeterageRequest, LayingPauseRequest, PoDocketGroupRequest, PoDocketNumberRequest } from '@xpparel/shared-models';
import { AxiosRequestConfig } from 'axios';
import { CPSCommonAxiosService } from '../cps-common-axios-service';

export class LayReportingService extends CPSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/lay-reporting/' + childUrl;
    }

    async startLayingForDocket(reqModel: PoDocketGroupRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('startLayingForDocket'), reqModel, config);
    }
   
    async pauseLayingForDocket(reqModel: LayingPauseRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('pauseLayingForDocket'), reqModel, config);
    }

    async resumeLayingForDocket(reqModel: LayIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('resumeLayingForDocket'), reqModel, config);
    }

    async confirmLayingForLayId(reqModel: LayIdConfirmationRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('confirmLayingForLayId'), reqModel, config);
    }

    async addLayedRollsForLayId(reqModel: LayItemAddRequest[], config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('addLayedRollsForLayId'), reqModel, config);
    }

    async removeLayedRollForLayId(reqModel: LayItemIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('removeLayedRollForLayId'), reqModel, config);
    }

    async getLayInfoForDocketGroup(reqModel: PoDocketGroupRequest, config?: AxiosRequestConfig): Promise<DocketLaysResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getLayInfoForDocketGroup'), reqModel, config);
    }

    // info
    async getActualDocketInfo(reqModel: LayIdsRequest, config?: AxiosRequestConfig): Promise<AdResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getActualDocketInfo'), reqModel, config);
    }

    async printBundleTagsForLay(reqModel: LayIdsRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('printBundleTagsForLay'), reqModel, config);
    }

    async releaseBundleTagsPrintForLay(reqModel: LayIdsRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('releaseBundleTagsPrintForLay'), reqModel, config);
    }

    async getKPICardDetailsForCutting(reqModel: LayerMeterageRequest, config?: AxiosRequestConfig): Promise<LayReportingCuttingResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getKPICardDetailsForCutting'), reqModel, config);
    }
}