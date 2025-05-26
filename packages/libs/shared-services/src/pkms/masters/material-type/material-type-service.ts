import { CommonIdReqModal, CommonRequestAttrs, CommonResponse, MaterialTypeRequestModel, MaterialTypesResponse } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { PKMSCommonAxiosService } from "../../pkms-common-axios-service";

export class MaterialTypeService extends PKMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/material-type/' + childUrl;
    }

    async createMaterialType(req: MaterialTypeRequestModel, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createMaterialType'), req, config);
    }

    async getAllMaterialTypes(req: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<MaterialTypesResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllMaterialTypes'), req, config);
    }

    async toggleMaterialType(req: CommonIdReqModal, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('toggleMaterialType'), req, config)
    }

    async getMaterialsToItems(config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getMaterialsToItems'), config)
    }
}