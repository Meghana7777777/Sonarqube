import { CommonResponse } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { PKMSCommonAxiosService } from "../pkms-common-axios-service";

export class InspectionUpdateServices extends PKMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/inspection-update/' + childUrl;
    }

    async UpdateInspectionDetails(req: any, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('UpdateInspectionDetails'), req, config);
    }
}