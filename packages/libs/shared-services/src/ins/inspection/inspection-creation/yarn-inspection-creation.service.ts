import { AxiosRequestConfig } from "axios";
import { INSCommonAxiosService } from "../../common-axios-service";
import { FgInsCreateExtRefRequest, GlobalResponseObject, InsBatchNosRequest, InsIrActivityChangeRequest, PackJobIdsRequest, PKMSIrActivityChangeRequest, YarnInsCreateExtRefRequest } from "@xpparel/shared-models";

export class YarnInspectionCreationService extends INSCommonAxiosService {

    private getUrlWithMainEndPoint(childUrl: string) {
        return '/yarn-inspection-creation/' + childUrl;
    }

    async createYarnInspectionRequest(req?: YarnInsCreateExtRefRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('createYarnInspectionRequest'), req, config)
    }

    async deleteYarnInspectionRequest(req?: InsBatchNosRequest, dontNeedLoadingSymbol?: boolean, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('deleteYarnInspectionRequest'), req, config)
    }
    async updateYarnInspectionActivityStatus(req?: InsIrActivityChangeRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('updateYarnInspectionActivityStatus'), req, config);
    }

}