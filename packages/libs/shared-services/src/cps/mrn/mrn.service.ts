import { GlobalResponseObject, MrnCreateRequest, MrnIdStatusRequest, MrnRequestResponse, MrnStatusRequest } from '@xpparel/shared-models';
import { AxiosRequestConfig } from 'axios';
import { CPSCommonAxiosService } from '../cps-common-axios-service';

export class MrnService extends CPSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/mrn/' + childUrl;
    }

    async createMrnRequest(reqModel: MrnCreateRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createMrnRequest'), reqModel, config);
    }
   
    async deleteMrnRequest(reqModel: MrnIdStatusRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteMrnRequest'), reqModel, config);
    }

    async getMrnRequestsByMrnStatus(reqModel: MrnStatusRequest, config?: AxiosRequestConfig): Promise<MrnRequestResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getMrnRequestsByMrnStatus'), reqModel, config);
    }

    async getMrnRequestForMrnId(reqModel: MrnIdStatusRequest, config?: AxiosRequestConfig): Promise<MrnRequestResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getMrnRequestForMrnId'), reqModel, config);
    }

    async changeMrnRequestStatus(reqModel: MrnIdStatusRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('changeMrnRequestStatus'), reqModel, config);
    }

}