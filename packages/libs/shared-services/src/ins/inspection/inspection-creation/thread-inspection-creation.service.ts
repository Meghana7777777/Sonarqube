import { AxiosRequestConfig } from "axios";
import { INSCommonAxiosService } from "../../common-axios-service";
import { FgInsCreateExtRefRequest, GlobalResponseObject, InsBatchNosRequest, InsIrActivityChangeRequest, PackJobIdsRequest, PKMSIrActivityChangeRequest, ThreadInsCreateExtRefRequest } from "@xpparel/shared-models";

export class ThreadInspectionCreationService extends INSCommonAxiosService {

    private getUrlWithMainEndPoint(childUrl: string) {
        return '/thread-inspection-creation/' + childUrl;
    }

    async createThreadInspectionRequest(req?: ThreadInsCreateExtRefRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('createThreadInspectionRequest'), req, config)
    }

    async deleteThreadInspectionRequest(req?: InsBatchNosRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('deleteThreadInspectionRequest'), req, config)
    }
    async updateThreadInspectionActivityStatus(req?: InsIrActivityChangeRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('updateThreadInspectionActivityStatus'), req, config);
    }

}