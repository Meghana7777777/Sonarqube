import { AxiosRequestConfig } from "axios";
import { INSCommonAxiosService } from "../../common-axios-service";
import { FgInsCreateExtRefRequest, GlobalResponseObject, InsBatchNosRequest, InsIrActivityChangeRequest, PackJobIdsRequest, PKMSIrActivityChangeRequest, TrimInsCreateExtRefRequest } from "@xpparel/shared-models";

export class TrimInspectionCreationService extends INSCommonAxiosService {

    private getUrlWithMainEndPoint(childUrl: string) {
        return '/trim-inspection-creation/' + childUrl;
    }

    async createTrimInspectionRequest(req?: TrimInsCreateExtRefRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('createTrimInspectionRequest'), req, config)
    }

    async deleteTrimInspectionRequest(req?: InsBatchNosRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('deleteTrimInspectionRequest'), req, config)
    }
    async updateTrimInspectionActivityStatus(req?: InsIrActivityChangeRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('updateTrimInspectionActivityStatus'), req, config);
    }

}