import { CommonResponse, GlobalResponseObject } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { INSCommonAxiosService } from "../../common-axios-service";

export class ThreadInspectionCaptureService extends INSCommonAxiosService {

    private getUrlWithMainEndPoint(childUrl: string) {
        return '/thread-inspection-capture/' + childUrl;
    }

    

    async captureInspectionResultsForThread(req?: any, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('captureInspectionResultsForThread'), req, config);
    }


}