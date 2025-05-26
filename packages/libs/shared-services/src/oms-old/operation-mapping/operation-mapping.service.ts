import { GlobalResponseObject, JobGroupVersionInfoResp, OpsWorkFlowResponse, PoProdNameResponse, PoProdutNameRequest, PoSerialRequest, RawMaterialIdRequest, ManufacturingOrderProductName, SewRawMaterialResponse, SewSerialRequest, SewVerIdRequest, SewVersionCloneRequest, SewVersionRequest, SewVersionResponse } from '@xpparel/shared-models';
import { AxiosRequestConfig } from 'axios';
import { OMSCommonAxiosService } from '../oms-common-axios-service';



export class OMSOperationMappingService extends OMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/sew-mapping/' + childUrl;
    }

    async createSewVersionForProduct(reqModel: SewVersionRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createSewVersionForProduct'), reqModel, config);
    }

    async deleteSewVersion(reqModel: SewVerIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteSewVersion'), reqModel, config);
    }

    async getSewVersionForPoProductName(reqModel: PoProdutNameRequest, config?: AxiosRequestConfig): Promise<SewVersionResponse> {

        return await this.axiosPostCall(this.getURLwithMainEndPoint('getSewVersionForPoProductName'), reqModel, config);
    }

    async getSewVersionForPoSerial(reqModel: PoSerialRequest, config?: AxiosRequestConfig): Promise<SewVersionResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getSewVersionForPoSerial'), reqModel, config);
    }

    async copySewingVersionToGivenProductNames(reqModel: SewVersionCloneRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('copySewingVersionToGivenProductNames'), reqModel, config);
    }

    async getSewDataOpCode(req: RawMaterialIdRequest, config?: AxiosRequestConfig): Promise<SewRawMaterialResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getSewDataOpCode'), req, config);
    }

    async getJobGroupVersionInfo(req: SewSerialRequest, config?: AxiosRequestConfig): Promise<JobGroupVersionInfoResp> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getJobGroupVersionInfo'), req, config);
    }

    async getPoProductNamesAndVersionInfo(req: SewSerialRequest, config?: AxiosRequestConfig): Promise<PoProdNameResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPoProductNamesAndVersionInfo'), req, config);
    }
    
    async getGlobalOpsVersionForMoAndProduct(req: ManufacturingOrderProductName, config?: AxiosRequestConfig): Promise<OpsWorkFlowResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getGlobalOpsVersionForMoAndProduct'), req, config);
    }
}