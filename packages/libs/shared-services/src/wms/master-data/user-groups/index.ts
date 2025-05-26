import { CommonRequestAttrs, UsersActivateRequest, UsersCreateRequest, UsersResponse } from '@xpparel/shared-models';
import { AxiosRequestConfig } from 'axios';
import { WMSCommonAxiosService } from '../../common-axios-service';

export class UsersServices extends WMSCommonAxiosService {
 
    private getURLwithMainEndPoint(childUrl: string) {
        return '/users/' + childUrl;
    }

    async createUsersGroup(reqModel: UsersCreateRequest, config?: AxiosRequestConfig): Promise<UsersResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createUsersGroup'), reqModel, config);
    }

    async ActivateDeactivateUserGroups(reqModel: UsersActivateRequest, config?: AxiosRequestConfig): Promise<UsersResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('ActivateDeactivateUserGroups'), reqModel, config);
    }

    async getAllUserGroupsData(reqModel: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<UsersResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllUserGroupsData'), reqModel, config);
    }

}