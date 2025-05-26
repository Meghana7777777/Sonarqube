import { AxiosRequestConfig } from "axios";
import { WorkstationCodesRequest, WorkstationOperationIdRequest, WorkstationOperationResponse } from "@xpparel/shared-models";
import { SPSCommonAxiosService } from "../sps-common-axios.service";

export class WorkstationOperationSharedService extends SPSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/workstationoperation/' + childUrl;
    }

    async createWorkstationOperation(reqModel: any, config?: AxiosRequestConfig): Promise<WorkstationOperationResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createWorkstationOperation'), reqModel, config);
    }

    async deleteWorkstationOperation(reqModel: WorkstationOperationIdRequest, config?: AxiosRequestConfig): Promise<WorkstationOperationResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteWorkstationOperation'), reqModel, config);
    }

    async getWorkstationOperation( config?: AxiosRequestConfig): Promise<WorkstationOperationResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getWorkstationOperation'), config);
    }

    async updateWorkstationOperation(reqModel: any, config?: AxiosRequestConfig): Promise<WorkstationOperationResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateWorkstationOperation'), reqModel, config);
    }

    async activateDeactivateWorkStationOperation(reqModel: WorkstationOperationIdRequest, config?: AxiosRequestConfig): Promise<WorkstationOperationResponse> {

        return await this.axiosPostCall(this.getURLwithMainEndPoint('activateDeactivateWorkStationOperation'), reqModel, config);
    }

    async getWorkstationOperationForWorkstationCodes(reqModel: WorkstationCodesRequest, config?: AxiosRequestConfig): Promise<WorkstationOperationResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getWorkstationOperationForWorkstationCodes'), reqModel, config);
    }
}