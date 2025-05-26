import { CompanyCreateRequest, CompanyIdRequest, CompanyModel, CompanyResponse } from "@xpparel/shared-models";
import { UmsCommonAxiosService } from "../common-axios-service";
import { AxiosRequestConfig } from "axios";

export class CompanySharedService extends UmsCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/company/' + childUrl;
    }

    async createCompany(reqModel: CompanyCreateRequest, config? : AxiosRequestConfig): Promise<CompanyResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createCompany'), reqModel,config);
    }

    async deleteCompany(reqModel: CompanyIdRequest, config?: AxiosRequestConfig): Promise<CompanyResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteCompany'), reqModel,config);
    }

    async getCompany(reqModel?: CompanyIdRequest, config?: AxiosRequestConfig): Promise<CompanyResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getCompany'), reqModel,config);
    }

    async updateCompany(reqModel?:  CompanyIdRequest, config?: AxiosRequestConfig): Promise<CompanyResponse>  {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateCompany'), reqModel,config);
    }

    async activateDeactiveCompany(reqModel?: CompanyIdRequest, config?: AxiosRequestConfig): Promise<CompanyResponse>  {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('activateDeactiveCompany'), reqModel,config);
    }
}