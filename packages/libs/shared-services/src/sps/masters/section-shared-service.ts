import { AxiosRequestConfig } from "axios";
import { CommonRequestAttrs, GetSectionDetailsBySectionCodeResponse, SectionCodeRequest, SectionCreateRequest, SectionIdRequest, SectionModel, SectionResponse } from "@xpparel/shared-models";
import { SPSCommonAxiosService } from "../sps-common-axios.service";

export class SectionSharedService extends SPSCommonAxiosService{
    private getURLwithMainEndPoint(childUrl: string) {
        return '/section' + childUrl;

}

async createSection(reqModel: SectionCreateRequest, config?: AxiosRequestConfig): Promise<SectionResponse> {
    
    return await this.axiosPostCall(this.getURLwithMainEndPoint('/createSection'), reqModel, config);
}
async deleteSection(reqModel: SectionIdRequest, config?: AxiosRequestConfig): Promise<SectionResponse> {
    return await this.axiosPostCall(this.getURLwithMainEndPoint('/deleteSection'), reqModel, config);
}
async getSection(reqModel?: SectionIdRequest, config?: AxiosRequestConfig): Promise<SectionResponse> {
    return await this.axiosPostCall(this.getURLwithMainEndPoint('/getSection'), reqModel, config);
}
async updateSection(reqModel: SectionCreateRequest, config?: AxiosRequestConfig): Promise<SectionResponse> {
    return await this.axiosPostCall(this.getURLwithMainEndPoint('/updateSection'), reqModel, config);
}
async activeDeactiveSection(reqModel:SectionIdRequest, config?: AxiosRequestConfig): Promise<SectionResponse> {
    
    return await this.axiosPostCall(this.getURLwithMainEndPoint('/activeDeactiveSection'), reqModel, config);
}

async getAllSections(reqModel: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<SectionResponse> {
    return await this.axiosPostCall(this.getURLwithMainEndPoint('/getAllSections'), reqModel, config);
}

async getSectionDataBySectionCode(req:SectionCodeRequest, config?: AxiosRequestConfig) : Promise<GetSectionDetailsBySectionCodeResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getSectionDataBySectionCode'), req,config)
    }
}