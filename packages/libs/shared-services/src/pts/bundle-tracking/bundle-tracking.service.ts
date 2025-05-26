import { ProcessTypeEnum, PTS_C_QmsBarcodeNumberRequest, PTS_R_QmsBarcodeInfoResponse } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { PTSCommonAxiosService } from "../pts-common-axios.service";

export class BundleTrackingService extends PTSCommonAxiosService {

  private getURLwithMainEndPoint(childUrl: string) {
    return '/op-reporting/' + childUrl;
  }

  async getBundleTrackingInfoForBundleBarcode(reqModel: PTS_C_QmsBarcodeNumberRequest, config?: AxiosRequestConfig): Promise<PTS_R_QmsBarcodeInfoResponse> {
    return await this.axiosPostCall(this.getURLwithMainEndPoint('getBundleTrackingInfoForBundleBarcode'), reqModel, config);
  }


}