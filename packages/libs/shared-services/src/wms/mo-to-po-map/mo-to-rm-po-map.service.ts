import { CommonIdReqModal, CommonResponse, ManufacturingOrderNumberRequest, MOToPOMappingReq } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { WMSCommonAxiosService } from "../common-axios-service";

export class MoToRMPoMapService extends WMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/mo-to-rm-po-map/' + childUrl;
    }

    async mapMoToRMPo(reqModel: MOToPOMappingReq, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('mapMoToRMPo'), reqModel, config);
    }

    async getMoToRmPoMapData(reqModel: ManufacturingOrderNumberRequest, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getMoToRmPoMapData'), reqModel, config);
    }
    async deleteMapping(reqObj: CommonIdReqModal, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteMapping'), reqObj, config);
    }

}