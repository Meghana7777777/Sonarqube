import { DownTimeDetailsReq, DownTimeDetailsResponse, ItemsInfoResponse } from "@xpparel/shared-models";
import { AssetCommonAxiosService } from "./asset-common-serive";

export class MachineTypeService extends AssetCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/items/' + childUrl;
    }

    async getAllItems() : Promise<ItemsInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllItems'))
    }
}   