import { CommonRequestAttrs, GatePassReqDto, GatePassResponse } from "@xpparel/shared-models";
import { PKMSCommonAxiosService } from "../pkms-common-axios-service";
import { AxiosRequestConfig } from "axios";

export class GatePassServices extends PKMSCommonAxiosService {
    private getUrlEndPoint(childUrl: string) {
        return '/gate-pass/' + childUrl
    }

    async getGatePassData(req: GatePassReqDto, config?: AxiosRequestConfig): Promise<GatePassResponse> {
        return await this.axiosPostCall(this.getUrlEndPoint('getGatePassData'), req, config)
    }

}