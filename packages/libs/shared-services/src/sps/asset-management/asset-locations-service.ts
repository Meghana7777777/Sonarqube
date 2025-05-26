import { AssetsLocationsCreateDto, CommonResponse } from "@xpparel/shared-models";
import { AssetCommonAxiosService } from "./asset-common-serive";

export class AssetLocationsService extends AssetCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/location/' + childUrl;
    }

    async createLocation(req: AssetsLocationsCreateDto): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('create'), req)
    }
}   