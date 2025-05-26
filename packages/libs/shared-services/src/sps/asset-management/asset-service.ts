import { DownTimeDetailsReq, DownTimeDetailsResponse } from "@xpparel/shared-models";
import { AssetCommonAxiosService } from "./asset-common-serive";

export class AssetManagementService extends AssetCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/assets/' + childUrl;
    }

    async getDowntimeDetailsBySectionCode(req:DownTimeDetailsReq) : Promise<DownTimeDetailsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getServiceCodestoPlanning') , req)
    }
}