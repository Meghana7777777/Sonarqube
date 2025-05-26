import { ModuleIdRequest, WorkstationCodesRequest, WorkstationCreateRequest, WorkstationIdRequest, WorkstationModuleRequest, WorkstationResponse } from "@xpparel/shared-models";
import { SPSCommonAxiosService } from "../sps-common-axios.service";
import { AxiosRequestConfig } from "axios";



export class WorkStationService extends SPSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/workstation/' + childUrl;
    }

    async getAllWorkStationsByModuleCode(req: ModuleIdRequest, config?: AxiosRequestConfig): Promise<WorkstationResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllWorkStationsByModuleCode'),req, config);
    }

    async createWorkstation(reqModel: WorkstationCreateRequest, config?: AxiosRequestConfig): Promise<WorkstationResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createWorkstation'), reqModel, config);
    }
    async deleteWorkstation(reqModel: WorkstationIdRequest, config?: AxiosRequestConfig): Promise<WorkstationResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteWorkstation'), reqModel, config);
    }
    async getWorkstation(reqModel?: WorkstationIdRequest, config?: AxiosRequestConfig): Promise<WorkstationResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getWorkstation'), reqModel, config);
    }
    async updateWorkstation(reqModel: any, config?: AxiosRequestConfig): Promise<WorkstationResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateWorkstation'), reqModel, config);
    }
    async activateDeactivateWorkStation(reqModel:WorkstationIdRequest, config?: AxiosRequestConfig): Promise<WorkstationResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('activateDeactivateWorkStation'), reqModel, config);
    }
    async WorkstationOperationTypeDropDown( config?: AxiosRequestConfig): Promise<WorkstationResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('WorkstationOperationTypeDropDown'),  config);
    }

    async getWorkstationsByModuleCode( req: WorkstationModuleRequest,config?:AxiosRequestConfig): Promise<WorkstationResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getWorkstationsByModuleCode'),req, config);
    }

    async getWorkstationsByWorkstationCodes( req: WorkstationCodesRequest,config?:AxiosRequestConfig): Promise<WorkstationResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getWorkstationsByWorkstationCodes'),req, config);
    }
}