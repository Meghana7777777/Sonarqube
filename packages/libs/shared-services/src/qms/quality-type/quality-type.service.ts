import { CommonRequestAttrs, CommonResponse, QualityTypeInfoResponse } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { QMSCommonAxiosService } from "../common-axios.service";

export class QualityTypeServices extends QMSCommonAxiosService {


    private getURLwithMainEndPoint(childUrl: string) {
        return '/quality-type/' + childUrl;
    }

    async createQualityType(req: any): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createQualityType'), req);
    }

    async getAllQualityType(): Promise<QualityTypeInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllQualityType'));
    }

    async updateQualityType(req: any): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateQualityType'), req);
    }

    async activateOrDeactivateQualityType(req: any): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('activateOrDeactivateQualityType'), req);
    }

    async getAllActiveQualityType(): Promise<QualityTypeInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllActiveQualityType'));
    }


}