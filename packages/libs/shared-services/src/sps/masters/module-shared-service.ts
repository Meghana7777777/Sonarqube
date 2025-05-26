import { AxiosRequestConfig } from "axios";
import { AllModulesResponseForJobPriority, CommonRequestAttrs, GetModuleDetailsByModuleCodeResponse, IModuleIdRequest, ModuleCreateRequest, ModuleIdRequest, ModuleModel, ModuleResponse, ModuleSectionRequest } from "@xpparel/shared-models";
import { SPSCommonAxiosService } from "../sps-common-axios.service";

export class ModuleSharedService extends SPSCommonAxiosService{
    private getURLwithMainEndPoint(childUrl: string) {
        return '/module/' + childUrl;
    }

    async createModule(reqModel: ModuleCreateRequest, config?: AxiosRequestConfig): Promise<ModuleResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createModule'), reqModel, config);
    }
    async deleteModule(reqModel: ModuleIdRequest, config?: AxiosRequestConfig): Promise<ModuleResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteModule'), reqModel, config);
    }
    async getModule(reqModel?: ModuleIdRequest, config?: AxiosRequestConfig): Promise<ModuleResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getModule'), reqModel, config);
    }

    async updateModule(reqModel: any, config?: AxiosRequestConfig): Promise<ModuleResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateModule'), reqModel, config);
    }
   
    async activateDeactivateModule(reqModel:ModuleIdRequest,config?:AxiosRequestConfig): Promise<ModuleResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('activateDeactivateModule'), reqModel, config);

    }

    async getModulesBySectionCode( reqModel: ModuleSectionRequest,config?:AxiosRequestConfig): Promise<ModuleResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getModulesBySectionCode'),reqModel,config)
    }

    async getModuleDataByModuleCode(req:IModuleIdRequest,config?:AxiosRequestConfig) : Promise<GetModuleDetailsByModuleCodeResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getModuleDataByModuleCode'), req, config)
    }

    async getAllModulesForJobPriority(req:CommonRequestAttrs,config?:AxiosRequestConfig) : Promise<AllModulesResponseForJobPriority> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllModulesForJobPriority'), req, config)
    }
}
