
import { CommonIdReqModal, CommonRequestAttrs, FgContainerCreateRequest, FgContainerResponse, FgContainersActivateReq, WeareHouseDropDownModel, WeareHouseDropDownResponse } from '@xpparel/shared-models';
import { AxiosRequestConfig } from 'axios';
import { PKMSCommonAxiosService } from '../../pkms-common-axios-service';
import { config } from 'process';

export class FgContainerServices extends PKMSCommonAxiosService {
 private getURLwithMainEndPoint(childUrl: string) {
        return '/container/' + childUrl;
    }
   async createContainers(reqModel: FgContainerCreateRequest, config?: AxiosRequestConfig) {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createContainers'), reqModel, config);
    }

    async ActivateDeactivateContainers(reqModel: FgContainersActivateReq, config?: AxiosRequestConfig) {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('ActivateDeactivateContainers'), reqModel, config);
    }

    async getAllContainersData(reqModel: CommonIdReqModal, config?: AxiosRequestConfig): Promise<FgContainerResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllContainersData'), reqModel, config);
    }

    async getWhereHouseCodeDropdown(): Promise<WeareHouseDropDownResponse>{
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getWhereHouseCodeDropdown'))
    }
    // async getEmptyContainerDetails( config?: AxiosRequestConfig): Promise<EmptyContainerLocationResponse> {
    //     return await this.axiosPostCall(this.getURLwithMainEndPoint('getEmptyContainerDetails'),  config);
    // }

}