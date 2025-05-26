import { AxiosRequestConfig } from "axios";
import { WMSCommonAxiosService } from "../../common-axios-service";

export class InspectionReportsService extends WMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/inspection-reports/' + childUrl;
    }

    async packListNumbersDropDown(config?: AxiosRequestConfig){
        return await this.axiosPostCall(this.getURLwithMainEndPoint('packListNumbersDropDown'), config);
    }

}