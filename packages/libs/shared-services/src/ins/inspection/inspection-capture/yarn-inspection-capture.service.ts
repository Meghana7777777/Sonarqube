import { CommonResponse, GlobalResponseObject } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { INSCommonAxiosService } from "../../common-axios-service";

export class YarnInspectionCaptureService extends INSCommonAxiosService {

    private getUrlWithMainEndPoint(childUrl: string) {
        return '/yarn-inspection-capture/' + childUrl;
    }

    

    async captureInspectionResultsForYarn(req?: any, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('captureInspectionResultsForYarn'), req, config);
    }


}