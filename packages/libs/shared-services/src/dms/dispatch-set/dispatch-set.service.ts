import { GlobalResponseObject, PkDSetCreateRequest, PkDSetFilterRequest, PkDSetIdsRequest, PkDSetResponse } from '@xpparel/shared-models';
import { AxiosRequestConfig } from 'axios';
import { DMSCommonAxiosService } from '../common-axios.service';

export class DispatchSetService extends DMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/dispatch-set/' + childUrl;
    }

    async createDispatchSet(reqModel:PkDSetCreateRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createDispatchSet'), reqModel, config);
    }

    async deleteDispatchSet(reqModel: PkDSetIdsRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteDispatchSet'), reqModel, config);
    }

    async getDispatchSet(reqModel: PkDSetIdsRequest, config?: AxiosRequestConfig): Promise<PkDSetResponse> {
       return await this.axiosPostCall(this.getURLwithMainEndPoint('getDispatchSet'), reqModel, config);
    }

    async getDispatchSetByFilter(reqModel: PkDSetFilterRequest, config?: AxiosRequestConfig): Promise<PkDSetResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getDispatchSetByFilter'), reqModel, config); 
    }

    async approveDispatchSet(reqModel: PkDSetIdsRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('approveDispatchSet'), reqModel, config);
    }

    async rejectDispatchSet(reqModel: PkDSetIdsRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('rejectDispatchSet'), reqModel, config);
    }

}