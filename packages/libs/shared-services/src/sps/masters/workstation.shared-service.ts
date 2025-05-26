
import { RacksActivateRequest, WorkstationCreateRequest, WorkstationIdRequest, WorkstationModuleRequest, WorkstationResponse } from '@xpparel/shared-models';
import { AxiosRequestConfig } from 'axios';
import { SPSCommonAxiosService } from '../sps-common-axios.service';


export class WorkStationService extends SPSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/workstation/' + childUrl;
    }

    async createWorkstation(reqModel: WorkstationCreateRequest, config?: AxiosRequestConfig): Promise<WorkstationResponse> {
        console.log(this.getURLwithMainEndPoint('createWorkstation'),'==================')
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createWorkstation'), reqModel, config);
    }
    async deleteWorkstation(reqModel: WorkstationIdRequest, config?: AxiosRequestConfig): Promise<WorkstationResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteWorkstation'), reqModel, config);
    }
    async getWorkstation(reqModel?:WorkstationIdRequest, config?: AxiosRequestConfig): Promise<WorkstationResponse> {
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

 
    async getWorkstationsByModuleCode(reqModel: WorkstationModuleRequest,config?:AxiosRequestConfig): Promise<WorkstationResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getWorkstationsByModuleCode'),reqModel,config);
    }
    
    


}

