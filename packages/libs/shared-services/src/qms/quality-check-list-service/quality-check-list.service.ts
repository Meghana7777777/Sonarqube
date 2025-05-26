import { CommonResponse } from "@xpparel/shared-models";
import { QMSCommonAxiosService } from "../common-axios.service";

export class QualityCheckListServices extends QMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/quality-check-list/' + childUrl;
    }

    async createQualityCheckListParameter(req: any): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createQualityCheckListParameter'), req);
    }

    async getAllQualityCheckListParameter(): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllQualityCheckListParameter'));
    }

    async updateQualityCheckListParameter(req: any): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateQualityCheckListParameter'), req);
    }

    async activateDeactivateQualityCheckListParameter(req: any): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('activateDeactivateQualityCheckListParameter'), req);
    }

    async getAllActiveQualityCheckListParameter(): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllActiveQualityCheckListParameter'));
    }

    async getAllQualityCheckListParamsMapping(): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllQualityCheckListParamsMapping'));
    }
    
}