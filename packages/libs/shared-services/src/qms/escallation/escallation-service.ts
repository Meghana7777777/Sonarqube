import { CommonRequestAttrs, CommonResponse } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { QMSCommonAxiosService } from "../common-axios.service";

export class EscallationServices extends QMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/escallation/' + childUrl;
    }

    async createEscallation(req: any): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createEscallation'), req);
    }

    async getAllEscallation(): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllEscallation'));
    }

    async updateEscallation(req: any): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateEscallation'), req);
    }

    async activateOrDeactivateEscallation(req: any): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('activateOrDeactivateEscallation'), req);
    }

    async getAllActiveEscallations(): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllActiveEscallations'));
    }

}