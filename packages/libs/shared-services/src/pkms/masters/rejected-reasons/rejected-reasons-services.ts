 import { CommonIdReqModal, CommonRequestAttrs, CommonResponse, RejectedReasonsResponseDto } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { PKMSCommonAxiosService } from "../../pkms-common-axios-service";

export class RejectedReasonsServices extends PKMSCommonAxiosService {
    private getUrlEndPoint(childUrl: string) {
        return '/rejected-reasons/' + childUrl
    }

    async saveReasons(req: RejectedReasonsResponseDto, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getUrlEndPoint('saveReasons'), req, config)
    }

    async getRejectedReasons(req: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getUrlEndPoint('getRejectedReasons'), req, config)
    }

      async toggleRejectedReasons(req: CommonIdReqModal, config?: AxiosRequestConfig): Promise<CommonResponse> {
            return await this.axiosPostCall(this.getUrlEndPoint('toggleRejectedReasons'), req, config)
        }
    

    async rejectedReasonsDropDown(req: CommonRequestAttrs, config?: AxiosRequestConfig):Promise<CommonResponse>  {
        return await this.axiosPostCall(this.getUrlEndPoint('rejectedReasonsDropDown'), req, config)
    }


}