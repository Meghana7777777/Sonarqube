import { AxiosRequestConfig } from "axios";
import { SPSCommonAxiosService } from "../sps-common-axios.service";
import { CommonRequestAttrs, GlobalResponseObject, SewingIJobNoRequest, TrimGroupsDetailsResponse, TrimsIssueddashboardResponse, TrimsItemRequest, TrimsItemsJobResponse, TrimsGroupsJobResponse, JobRmStatusModel } from "@xpparel/shared-models";

export class TrimsIssuedDashboardService extends SPSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/trims-issued/' + childUrl;
    }

    async getTrimsIssuedDashBoardData(req: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<TrimsIssueddashboardResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getTrimsIssuedDashBoardData'),req, config);
    }

    async getTrimGroupsDataByJobNo(req: SewingIJobNoRequest, config?: AxiosRequestConfig): Promise<TrimGroupsDetailsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getTrimGroupsDataByJobNo'),req, config);
    }
   
    async updateTrimItemsStatus(req: TrimsItemRequest[], config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateTrimItemsStatus'),req, config);
    }

    async getTrimSheetGroupsDataByJobNo(req: SewingIJobNoRequest, config?: AxiosRequestConfig): Promise<TrimsGroupsJobResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getTrimSheetGroupsDataByJobNo'),req, config);
    }

    async getTrimItemsByGroupId(id: number) :
    Promise <TrimsItemsJobResponse> {
        const req = { id }
        return await this.axiosPostCall(this.getURLwithMainEndPoint
            ('getTrimItemsByGroupId') , req)
    }

    async updateRmStatusForJobNumber(req: JobRmStatusModel, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateRmStatusForJobNumber'),req, config);
    }
}
