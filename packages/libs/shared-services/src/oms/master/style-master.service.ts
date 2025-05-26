import { StyleCreateRequest, StyleIdRequest, StyleResponse } from "@xpparel/shared-models";
import { OMSCommonAxiosService } from "../oms-common-axios-service";
import { AxiosRequestConfig } from "axios";

export class StyleSharedService extends OMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/style/' + childUrl;
    }

    async createStyle(reqModel: StyleCreateRequest, config?: AxiosRequestConfig): Promise<StyleResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createStyle'), reqModel, config);
    }

    async deleteStyle(reqModel: StyleIdRequest, config?: AxiosRequestConfig): Promise<StyleResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteStyle'), reqModel, config);
    }

    async getAllStyles(reqModel?: StyleIdRequest, config?: AxiosRequestConfig): Promise<StyleResponse> {        
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllStyles'), reqModel, config);
    }

    async activateDeactivateStyle(reqModel?: StyleIdRequest, config?: AxiosRequestConfig): Promise<StyleResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('activateDeactivateStyle'), reqModel, config);
    }

    async styleUpdateImage(reqModel?: FormData, config?: AxiosRequestConfig): Promise<StyleResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('styleUpdateImage'), reqModel, config);
    }

    async getStyleByStyleCode(reqModel: StyleIdRequest, config?: AxiosRequestConfig): Promise<StyleResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getStyleByStyleCode'), reqModel, config);
    }

}
