import { CommonRequestAttrs, CommonResponse } from "@xpparel/shared-models";
import { QMSCommonAxiosService } from "../common-axios.service";
import { AxiosRequestConfig } from "axios";

export class ApproverServices extends QMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/approver/' + childUrl;
    }
    async createApprover(req: any): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createApprover'), req);
    }

    async getAllApprovers(): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllApprovers'));
    }

    async updateApprover(req: any): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateApprover'), req);
    }

    async activateOrDeactivateApprover(req: any): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('activateOrDeactivateApprover'), req);
    }

    async getAllActiveApprovers(): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllActiveApprovers'));
    }


}