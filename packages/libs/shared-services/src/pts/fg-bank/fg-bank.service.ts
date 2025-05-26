import { AxiosRequestConfig } from 'axios';
import { PTSCommonAxiosService } from '../pts-common-axios.service';
import { DepJobGroupInfoResp, GlobalResponseObject, JobNumberRequest, PtsBankElgResponse, PtsBankRequestCreateRequest, PtsJobNumberDepJgRequest, SewSerialDepGroupReq } from '@xpparel/shared-models';


export class FgBankService extends PTSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/fg-bank/' + childUrl;
    }

    async createBankRequest(reqModel: PtsBankRequestCreateRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createBankRequest'), reqModel, config);
    }

    async createFgsForJob(reqModel: any, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createFgsForJob'), reqModel, config);
    }

    async getPreJgElgBundlesForJob(reqModel: PtsJobNumberDepJgRequest, config?: AxiosRequestConfig): Promise<PtsBankElgResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPreJgElgBundlesForJob'), reqModel, config);
    }

    async getOpDepGroupInfoByJobNumber(reqModel: JobNumberRequest, config?: AxiosRequestConfig): Promise<DepJobGroupInfoResp> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getOpDepGroupInfoByJobNumber'), reqModel, config);
    }

    async getElgBundlesForSewSerialAndJg(reqModel: SewSerialDepGroupReq, config?: AxiosRequestConfig): Promise<PtsBankElgResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getElgBundlesForSewSerialAndJg'), reqModel, config);
    }
}