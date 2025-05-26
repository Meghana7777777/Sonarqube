import { CPS_C_BundlingConfirmationIdRequest, CPS_C_BundlingConfirmationRequest, CPS_ELGBUN_C_MainDocketRequest, CPS_R_ActualDocketsForBundlingResponse, CPS_R_BundlingConfirmationResponse, CPS_R_CutBundlingProductColorBundlingSummaryResponse, CPS_R_CutBundlingSummaryRequest, CPS_R_CutOrderConfirmedBundlesResponse, CPS_R_CutOrderEligibleBundlesResponse, GlobalResponseObject, PoSerialRequest } from '@xpparel/shared-models';
import { AxiosRequestConfig } from 'axios';
import { CPSCommonAxiosService } from '../cps-common-axios-service';

export class CutBundlingService extends CPSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/cut-bundling/' + childUrl;
    }

    async getConfirmedBundlesForConfirmationId(reqModel: CPS_C_BundlingConfirmationIdRequest, config?: AxiosRequestConfig): Promise<CPS_R_CutOrderConfirmedBundlesResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getConfirmedBundlesForConfirmationId'), reqModel, config);
    }

    async getBundlingSummaryForPoProdCodeAndColor(reqModel: CPS_R_CutBundlingSummaryRequest, config?: AxiosRequestConfig): Promise<CPS_R_CutBundlingProductColorBundlingSummaryResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getBundlingSummaryForPoProdCodeAndColor'), reqModel, config);
    }

    async getActualDocketsFoBundlingForPoProdCodeAndColor(reqModel: CPS_R_CutBundlingSummaryRequest, config?: AxiosRequestConfig): Promise<CPS_R_ActualDocketsForBundlingResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getActualDocketsFoBundlingForPoProdCodeAndColor'), reqModel, config);
    }

    async getBundlingConfirmationsForPoProdColor(reqModel: CPS_R_CutBundlingSummaryRequest, config?: AxiosRequestConfig): Promise<CPS_R_BundlingConfirmationResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getBundlingConfirmationsForPoProdColor'), reqModel, config);
    }

    async confirmBundlingForActualDocket(reqModel: CPS_C_BundlingConfirmationRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('confirmBundlingForActualDocket'), reqModel, config);
    }

    async getEligibleBundlesAgainstDocketForBundling(reqModel: CPS_ELGBUN_C_MainDocketRequest, config?: AxiosRequestConfig): Promise<CPS_R_CutOrderEligibleBundlesResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getEligibleBundlesAgainstDocketForBundling'), reqModel, config);
    }

    async updateExtSystemAckForBundlingConfirmation(reqModel: CPS_C_BundlingConfirmationIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateExtSystemAckForBundlingConfirmation'), reqModel, config);
    }

    async updatePtsSystemAckForBundlingConfirmation(reqModel: CPS_C_BundlingConfirmationIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updatePtsSystemAckForBundlingConfirmation'), reqModel, config);
    }
}