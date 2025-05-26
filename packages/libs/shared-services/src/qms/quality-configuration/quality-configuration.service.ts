import { CommonRequestAttrs, CommonResponse, GlobalResponseObject, QualityConfigurationCreationReq, QualityConfigurationInfoRequest, QualityConfigurationInfoResponse } from "@xpparel/shared-models";
import { QMSCommonAxiosService } from "../common-axios.service";

export class QualityConfigurationService extends QMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/quality-configuration/' + childUrl;
    }

    async createQualityConfiguration(req: QualityConfigurationCreationReq): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createQualityConfiguration'), req);
    }

    async getQualityConfigurationInfo(req: QualityConfigurationInfoRequest): Promise<QualityConfigurationInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getQualityConfigurationInfo'), req);
    }

    async getAllEsclations(req: CommonRequestAttrs): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllEsclations'), req);
    }
}
