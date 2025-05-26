import { AxiosRequestConfig } from "axios";
import { INSCommonAxiosService } from "../../common-axios-service";
import { FgInsCreateExtRefRequest, GlobalResponseObject, PackJobIdsRequest, PKMSInsStatusReqDto, PKMSIrActivityChangeRequest } from "@xpparel/shared-models";

export class FgInspectionCreationService extends INSCommonAxiosService {

    private getUrlWithMainEndPoint(childUrl: string) {
        return '/fg-inspection-creation/' + childUrl;
    }

    async createFgInspectionRequest(req?: FgInsCreateExtRefRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('createFgInspectionRequest'), req, config)
    }

    async deleteFgInspectionRequest(req?: PackJobIdsRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('deleteFgInspectionRequest'), req, config)
    }
    async updatePMSInspectionActivityStatus(req?: PKMSIrActivityChangeRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('updatePMSInspectionActivityStatus'), req, config);
    }
    async getInspectionStatus(req?: PKMSInsStatusReqDto, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getInspectionStatus'), req, config);
    }

}