import { CommonResponse, GlobalResponseObject } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { INSCommonAxiosService } from "../../common-axios-service";

export class TrimInspectionCaptureService extends INSCommonAxiosService {

    private getUrlWithMainEndPoint(childUrl: string) {
        return '/trim-inspection-capture/' + childUrl;
    }

    

    async captureInspectionResultsForTrim(req?: any, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('captureInspectionResultsForTrim'), req, config);
    }


}