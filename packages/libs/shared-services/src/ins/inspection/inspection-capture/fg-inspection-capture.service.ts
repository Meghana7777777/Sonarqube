import { GlobalResponseObject } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { INSCommonAxiosService } from "../../common-axios-service";

export class FgInspectionCaptureService extends INSCommonAxiosService {

    private getUrlWithMainEndPoint(childUrl: string) {
        return '/fg-inspection-capture/' + childUrl;
    }

    // async captureInspectionResultsForFg(req: FormData, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
    //     return await this.axiosPostCall(this.getUrlWithMainEndPoint('captureInspectionResultsForFg'), req, config)
    // }

    async captureInspectionResultsForFg(req?: FormData, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('captureInspectionResultsForFg'), req, config);
    }


}