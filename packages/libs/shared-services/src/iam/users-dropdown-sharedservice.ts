import {  CommonResponse, UserDropdownReqDto,  } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { UserManagementCommonAxiosService } from "./user-management-axios-service";


export class UserService extends UserManagementCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/users/' + childUrl;
    }

    async getUsersDropdowntoWarehouse(req:UserDropdownReqDto,config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getUsersToRoles'),req, config)
    }
}