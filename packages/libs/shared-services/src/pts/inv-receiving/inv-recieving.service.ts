import { GlobalResponseObject, INV_C_InvOutAllocIdRequest, PTS_C_InvIssuanceRefCreateRequest } from '@xpparel/shared-models';
import { AxiosRequestConfig } from 'axios';
import { PTSCommonAxiosService } from '../pts-common-axios.service';


export class InvReceivingService extends PTSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/inv-receiving/' + childUrl;
    }

    async createInvIssuanceRef(reqModel: PTS_C_InvIssuanceRefCreateRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createInvIssuanceRef'), reqModel, config);
    }
    
    async updateBundlesReceivedForAnAllocationId(reqModel: INV_C_InvOutAllocIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateBundlesReceivedForAnAllocationId'), reqModel, config);
    }

    async reverseBundlesReceivedForAnAllocationId(reqModel: INV_C_InvOutAllocIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('reverseBundlesReceivedForAnAllocationId'), reqModel, config);
    }

}