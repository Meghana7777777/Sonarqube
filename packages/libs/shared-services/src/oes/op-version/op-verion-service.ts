import { AxiosRequestConfig } from 'axios';
import { OESCommonAxiosService } from '../oes-common-axios-service';
import { CommonResponse, GlobalResponseObject, OpVerIdRequest, OpVersionRequest, OpVersionResponse, OpsVersionCloneRequest, PoCreateRequest, PoItemCodeRequest, PoProdTypeAndFabResponse, PoProductFgColorRequest, PoProdutNameRequest, PoSerialRequest, PoSizesResponse, PoSummaryModel, PoSummaryResponse, ProcessTypeGroupResp, RawOrderNoRequest } from '@xpparel/shared-models';


export class OpVersionService extends OESCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/op-version/' + childUrl;
    }

    async createOpVersionForProduct(reqModel: OpVersionRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createOpVersionForProduct'), reqModel, config);
    }

    async deleteOpVersion(reqModel: OpVerIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteOpVersion'), reqModel, config);
    }

    async getOpVersionForPoProductName(reqModel: PoProductFgColorRequest, config?: AxiosRequestConfig): Promise<OpVersionResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getOpVersionForPoProductName'), reqModel, config);
    }

    async getOpVersionsForPo(reqModel: PoSerialRequest, config?: AxiosRequestConfig): Promise<OpVersionResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getOpVersionsForPo'), reqModel, config);
    }

    async copyOperationVersionToGivenProductNames(reqModel: OpsVersionCloneRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('copyOperationVersionToGivenProductNames'), reqModel, config);
    }

    async getProcessTypeAndGroupForItemCode(reqModel: PoItemCodeRequest, config?: AxiosRequestConfig): Promise<ProcessTypeGroupResp> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getProcessTypeAndGroupForItemCode'), reqModel, config);
    }

}