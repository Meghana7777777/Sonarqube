import { LocationCodesRequest, MmsAssetLocationsResponse } from "@xpparel/shared-models";
import { MmsAssetCommonAxiosService } from "./mms-common-service";
import { AxiosRequestConfig } from "axios";

export class MmsAssetLocationsService extends MmsAssetCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/assets/' + childUrl;
    }

    async getDataforMES(req: LocationCodesRequest, config?: AxiosRequestConfig): Promise<MmsAssetLocationsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getDataforMES'), req, config);
    }
}