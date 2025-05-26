import { CommonResponse, PoCreationRequest, PoViewFilterReq } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { QMSCommonAxiosService } from "../common-axios.service";

export class PoCreationServices extends QMSCommonAxiosService {
    private getURLwithMainEndPoint(childUrl: string) {
        return '/po-creation/' + childUrl;
    }


    async createPo(req: PoCreationRequest, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createPo'), req, config);
    }

    async getPoViewInfo(req: PoViewFilterReq): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPoViewInfo'), req)
    }


}