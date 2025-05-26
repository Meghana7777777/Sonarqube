import { CartonIdsRequest, CommonResponse, FgInsCreateExtRefRequest, FgInsSelectedBatchResponse, InsCartonIdsRequest, InsCartonsDataResponse } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { PKMSCommonAxiosService } from "../pkms-common-axios-service";

export class InsPackingHelperService extends PKMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/InsPackingHelper/' + childUrl;
    }

    async getFgInspectionSelectedItems(req: FgInsCreateExtRefRequest, config?: AxiosRequestConfig): Promise<FgInsSelectedBatchResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getFgInspectionSelectedItems'), req, config);
    }

    async getCartonsDataByCartonId(req: InsCartonIdsRequest, config?: AxiosRequestConfig): Promise<InsCartonsDataResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getCartonsDataByCartonId'), req, config);
    }
}