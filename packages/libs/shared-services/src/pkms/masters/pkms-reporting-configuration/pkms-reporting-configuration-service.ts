import { CommonIdReqModal, CommonRequestAttrs, CommonResponse, PkmsReportingConfigurationRequestModel, PkmsReportingConfigurationResponse } from "@xpparel/shared-models";
import { PKMSCommonAxiosService } from "../../pkms-common-axios-service";
import { AxiosRequestConfig } from "axios";


export class PkmsReportingConfigurationService extends PKMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/pkms-reporting-configuration/' + childUrl;
    }

    async createReportingConfiguration(req: PkmsReportingConfigurationRequestModel, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createReportingConfiguration'), req, config);
    }

    async getAllReportingConfigurations(req: PkmsReportingConfigurationRequestModel, config?: AxiosRequestConfig): Promise<PkmsReportingConfigurationResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllReportingConfigurations'), req, config);
    }

    async toggleReportingConfigurations(req: CommonIdReqModal, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('toggleReportingConfigurations'), req, config)
    }

}