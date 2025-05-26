import { AxiosRequestConfig } from "axios";
import { PKMSCommonAxiosService } from "../pkms-common-axios-service";
import { CommonResponse, PackJobPlanningRequest } from "@xpparel/shared-models";

export class PackingTrimReadinessServices extends PKMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/packing-trim/' + childUrl;
    }

    async getAllPackingTables(req: any, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllPackingTables'), req, config);
    }

    async getPlannedPackJobRequestsOfPackTable(req:PackJobPlanningRequest, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPlannedPackJobRequestsOfPackTable'), req, config);
    }
}