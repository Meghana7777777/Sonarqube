import { GlobalResponseObject, WhFabReqStatusRequest } from '@xpparel/shared-models';
import { WMSCommonAxiosService } from '../../common-axios-service';
import { AxiosRequestConfig } from 'axios';

export class FabricRequestHandlingService extends WMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/fabric-request-handling/' + childUrl;
    }

    async changeWhFabRequestStatusToIssued(reqModel: WhFabReqStatusRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('changeWhFabRequestStatusToIssued'), reqModel, config);
    }

    async changeWhFabRequestStatusToPreparingMaterial(reqModel: WhFabReqStatusRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('changeWhFabRequestStatusToPreparingMaterial'), reqModel, config);
    }

    async changeWhFabRequestStatusToMaterialNotAvl(reqModel: WhFabReqStatusRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('changeWhFabRequestStatusToMaterialNotAvl'), reqModel, config);
    }

}