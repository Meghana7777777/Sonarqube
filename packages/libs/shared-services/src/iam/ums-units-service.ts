import { AxiosRequestConfig } from "axios";
import { UserManagementCommonAxiosService } from "./user-management-axios-service";
import { CommonResponse } from "@xpparel/shared-models";

export class UMSUnitsService extends UserManagementCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/units/' + childUrl;
    }

    async getUnitsByOrgId(req: { organizationCode: string }, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getUnitsByOrgId'), req, config)
    }

}
