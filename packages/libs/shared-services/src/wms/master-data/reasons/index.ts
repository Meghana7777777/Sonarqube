import { InsReasonsActivateRequest, InsReasonsCategoryRequest, InsReasonsCreateRequest, InsReasonsResponse } from '@xpparel/shared-models';
import { AxiosRequestConfig } from 'axios';
import { WMSCommonAxiosService } from '../../common-axios-service';
import { assignAndGetLoaingReqStatusForHeaders } from '../../../loading-helper';

export class ReasonssServices extends WMSCommonAxiosService {
 
    private getURLwithMainEndPoint(childUrl: string) {
        return '/reasons/' + childUrl;
    }

    async createReasons(reqModel: InsReasonsCreateRequest, config?: AxiosRequestConfig) {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createReasons'), reqModel, config);
    }

    async ActivateDeactivateReasons(reqModel: InsReasonsActivateRequest, config?: AxiosRequestConfig) {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('ActivateDeactivateReasons'), reqModel, config);
    }

    async getAllReasonsData(reqModel: InsReasonsCategoryRequest,  dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<InsReasonsResponse> {
        const modifiedConfig = assignAndGetLoaingReqStatusForHeaders(dontNeedLoadingSymbol, config);
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllReasonsData'), reqModel, modifiedConfig);
    }

    async getReasonsAgainstCategory(req: InsReasonsCategoryRequest, config?: AxiosRequestConfig): Promise<InsReasonsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getReasonsAgainstCategory'), req, config);
    }
}