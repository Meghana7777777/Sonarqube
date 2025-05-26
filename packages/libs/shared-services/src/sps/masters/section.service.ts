import { AxiosRequestConfig } from "axios";
import { SPSCommonAxiosService } from "../sps-common-axios.service";
import { CommonRequestAttrs, CommonResponse, SectionsModulesResponse } from "@xpparel/shared-models";

export class SectionService extends SPSCommonAxiosService{

    private getURLwithMainEndPoint(childUrl: string) {
        return '/section/' + childUrl;
    }

    async getAllSections( req:CommonRequestAttrs,config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllSections'),req, config);
    }

    async getAllSectionsData(req: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<SectionsModulesResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllSectionsData'),req, config);
    }
}