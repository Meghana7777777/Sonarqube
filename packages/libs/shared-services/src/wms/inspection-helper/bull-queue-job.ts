import { CommonResponse, InsPhIdRequest, ShadeDetails } from "@xpparel/shared-models";
import { WMSCommonAxiosService } from "../common-axios-service";
import { AxiosRequestConfig } from "axios";

export class BullQueueJobService extends WMSCommonAxiosService {
    private getUrlWithMainEndPoint(childUrl: string) {
        return '/bull-queue-jobs/' + childUrl;
    }

    async addShownInInventoryQueue(req?: InsPhIdRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('addShownInInventoryQueue'), req, config)
    }

    async updateShadeQueue(req?: ShadeDetails[], dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('updateShadeQueue'), req, config)
    }


}