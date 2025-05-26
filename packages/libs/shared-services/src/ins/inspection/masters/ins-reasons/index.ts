import { InsReasonsActivateRequest, InsReasonsCategoryRequest, InsReasonsCreateRequest, InsReasonsResponse } from '@xpparel/shared-models';
import { AxiosRequestConfig } from 'axios';
import { INSCommonAxiosService } from '../../../common-axios-service';
import { assignAndGetLoaingReqStatusForHeaders } from 'packages/libs/shared-services/src/loading-helper';


export class InsReasonsServices extends INSCommonAxiosService {
 
    private getURLwithMainEndPoint(childUrl: string) {
        return '/ins-reasons/' + childUrl;
    }

    async insCreateReasons(reqModel: InsReasonsCreateRequest, config?: AxiosRequestConfig) {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('insCreateReasons'), reqModel, config);
    }

    async insActivateDeactivateReasons(reqModel: InsReasonsActivateRequest, config?: AxiosRequestConfig) {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('insActivateDeactivateReasons'), reqModel, config);
    }

    async insGetAllReasonsData(reqModel: InsReasonsCategoryRequest,  dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<InsReasonsResponse> {
        const modifiedConfig = assignAndGetLoaingReqStatusForHeaders(dontNeedLoadingSymbol, config);
        return await this.axiosPostCall(this.getURLwithMainEndPoint('insGetAllReasonsData'), reqModel, modifiedConfig);
    }

    async insGetReasonsAgainstCategory(req: InsReasonsCategoryRequest, config?: AxiosRequestConfig): Promise<InsReasonsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('insGetReasonsAgainstCategory'), req, config);
    }
}