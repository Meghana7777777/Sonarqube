import { CommonResponse, GlobalResponseObject, PKMSInsReqIdDto, PKMSInsStatusReqDto, PKMSIrActivityChangeRequest, PackInspectionCreateRequest, InsPackListAndPoIdsReqDto, PoReqModel, SystematicPreferenceReqModel, SystematicPreferenceResponse } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { PKMSCommonAxiosService } from "../../pkms-common-axios-service";

export class InspectionPreferenceService extends PKMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/Ip-Interface/' + childUrl;
    }

    async getSystemPreferences(req: PoReqModel, config?: AxiosRequestConfig): Promise<SystematicPreferenceResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getSystemPreferences'), req, config);
    }

    async saveSystematicPreference(req: SystematicPreferenceReqModel, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('saveSystematicPreference'), req, config);
    }

    async inspectionConfirm(req: PackInspectionCreateRequest[], config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('inspectionConfirm'), req, config);
    }

    async getInspectionMaterialPendingData(req: InsPackListAndPoIdsReqDto, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getInspectionMaterialPendingData'), req, config);
    }

    async updatePMSInspectionActivityStatus(req: PKMSIrActivityChangeRequest, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updatePMSInspectionActivityStatus'), req, config);
    }

    async getPKMSInsCartonsData(req: PKMSInsReqIdDto, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPKMSInsCartonsData'), req, config);
    }

    async getInsCartonsSummary(req: PKMSInsReqIdDto, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getInsCartonsSummary'), req, config);
    }
    async saveInspectionDetails( req: FormData, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('saveInspectionDetails'), req, config);
    }
    async getInspectionStatus(req: PKMSInsStatusReqDto, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getInspectionStatus'), req, config);
    }
}