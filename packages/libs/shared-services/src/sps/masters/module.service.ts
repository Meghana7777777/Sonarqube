import { ModuleCodesRequest, ModuleResponse, SectionIdRequest, SectionModulesResponse } from "@xpparel/shared-models";
import { SPSCommonAxiosService } from "../sps-common-axios.service";
import { AxiosRequestConfig } from "axios";

export class ModuleService extends SPSCommonAxiosService{

    private getURLwithMainEndPoint(childUrl: string) {
        return '/module/' + childUrl;
    }

    async getAllModulesDataBySectionCode(req: SectionIdRequest, config?: AxiosRequestConfig): Promise<SectionModulesResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllModulesDataBySectionCode'),req, config);
    }

    async getModuleDataByModuleCodes(req: ModuleCodesRequest, config?: AxiosRequestConfig): Promise<ModuleResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getModuleDataByModuleCodes'),req, config);
    }
}