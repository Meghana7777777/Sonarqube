import { AttributesMasterCreateReq, AttributesMasterResponse, CommonIdReqModal, CommonRequestAttrs, CommonResponse, ConfigGcIdModelDto, ConfigMasterModelIdDto, ConfigMasterResponse, GetAttributesByGcIdResponseDto, MasterModelDto, MasterResponse } from '@xpparel/shared-models';
import { AxiosRequestConfig } from 'axios';
import { UmsCommonAxiosService } from '../common-axios-service';

export class MasterService extends UmsCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/master/' + childUrl;
    }

    async saveGlobalConfigMasters(reqModel: MasterModelDto, config?: AxiosRequestConfig): Promise<MasterResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('saveGlobalConfigMasters'), reqModel, config);
    }
    async getGlobalConfigMasters(reqModel: ConfigMasterModelIdDto, config?: AxiosRequestConfig): Promise<CommonResponse> {
        console.log(reqModel, 'console.log(reqModel)')
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getGlobalConfigMasters'), reqModel, config);

    }
    async getDropDownParentId(reqModel: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getDropDownParentId'), reqModel, config);

    }

    async saveConfigMasters(reqModel: any, config?: AxiosRequestConfig): Promise<ConfigMasterResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('saveConfigMasters'), reqModel, config);
    }

    async getConfigMasters(reqModel: ConfigGcIdModelDto, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getConfigMasters'), reqModel, config);

    }
    async getParentIdDropDownAgainstGcID(reqModel: ConfigGcIdModelDto, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getParentIdDropDownAgainstGcID'), reqModel, config);

    }
    async toggleConfigMasters(reqModel: CommonIdReqModal, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('toggleConfigMasters'), reqModel, config);

    }
    async toggleGlobalConfigMasters(reqModel: CommonIdReqModal, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('toggleGlobalConfigMasters'), reqModel, config);

    }
    // attributes
    async toggleAttributesMasters(reqModel: CommonIdReqModal, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('toggleAttributesMasters'), reqModel, config);

    }
    async saveAttributesMasters(reqModel: AttributesMasterCreateReq, config?: AxiosRequestConfig): Promise<AttributesMasterResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('saveAttributesMasters'), reqModel, config);
    }

    async getAttributesMasters(reqModel: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<AttributesMasterResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAttributesMasters'), reqModel, config);
    }

    async getAttributesByGcId(reqModel: ConfigGcIdModelDto, config?: AxiosRequestConfig): Promise<GetAttributesByGcIdResponseDto> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAttributesByGcId'), reqModel, config);
    }

    async fileUpload(reqModel: FormData, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('fileUpload'), reqModel, config);
    }

}
