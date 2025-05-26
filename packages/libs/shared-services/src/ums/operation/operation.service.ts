import { CommonRequestAttrs, CommonResponse, GlobalResponseObject, MachineNameRequest, OperationCategoryFormRequest, OperationCodeRequest, OperationCodesRequest, OperationCodesResponse, OperationCreateRequest, OperationResponse } from '@xpparel/shared-models';
import { AxiosRequestConfig } from 'axios';
import { UmsCommonAxiosService } from '../common-axios-service';

export class OperationService extends UmsCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/operation/' + childUrl;
    }

    async createOperation(reqModel: OperationCreateRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createOperation'), reqModel, config);
    }

    async deleteOperation(reqModel: OperationCodeRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteOperation'), reqModel, config);
    }

    async deActivateOperation(reqModel: OperationCodeRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deActivateOperation'), reqModel, config);
    }

    async activateOperation(reqModel: OperationCodeRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('activateOperation'), reqModel, config);
    }

    async getAllOperations(reqModel: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<OperationResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllOperations'), reqModel, config);
    }

    async getOperationsByCategory(reqModel: OperationCategoryFormRequest, config?: AxiosRequestConfig): Promise<OperationResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getOperationsByCategory'), reqModel, config);
    }

    async OperationsTypeDropDown( config?: AxiosRequestConfig): Promise<OperationResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('OperationsTypeDropDown'),  config);
    }

    async getOperationsByOperationForm(reqModel: OperationCategoryFormRequest, config?: AxiosRequestConfig): Promise<OperationResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getOperationsByOperationForm'), reqModel, config);
    }

    async getAllActiveOperations(): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllActiveOperations'));
    }

    async getAllOperationInfoByOpId(reqModel: OperationCodesRequest, config?: AxiosRequestConfig): Promise<OperationCodesResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllOperationInfoByOpId'), reqModel, config);
    }
    
    async getOperationsByMachineName(reqModel: MachineNameRequest, config?: AxiosRequestConfig): Promise<OperationResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getOperationsByMachineName'), reqModel, config);
    }
    
    async getOperationbyOpCode(reqModel: OperationCodeRequest, config?: AxiosRequestConfig): Promise<OperationResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getOperationbyOpCode'), reqModel, config);
    }
}