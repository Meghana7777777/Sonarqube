import { GlobalResponseObject, RawOrderHeaderInfoResponse, RawOrderInfoResponse, RawOrderLinePoSerialRequest, RawOrderNoRequest } from "@xpparel/shared-models";
import { OMSCommonAxiosService } from "../oms-common-axios-service";
import { AxiosRequestConfig } from "axios";


export class MOInfoService extends OMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/mo-info/' + childUrl;
    }

    async getRawOrderInfo(reqModel: RawOrderNoRequest, config?: AxiosRequestConfig): Promise<RawOrderInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getRawOrderInfo'), reqModel, config);
    }

    async getRawOrderHeaderInfo(reqModel: RawOrderNoRequest, config?: AxiosRequestConfig): Promise<RawOrderHeaderInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getRawOrderHeaderInfo'), reqModel, config);
    }


}