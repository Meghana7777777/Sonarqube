import { CommonIdReqModal, CommonRequestAttrs, CommonResponse, GlobalResponseObject, PackTableCreateRequest, PackTableIdRequest, PackTableResponse, PackTablesResponse } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { PKMSCommonAxiosService } from "../../pkms-common-axios-service";

export class PackTableService extends PKMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/pack-table/' + childUrl;
    }

    async createPackTable(req: PackTableCreateRequest, config?: AxiosRequestConfig): Promise<PackTableResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createPackTable'), req, config);
    }

    async deletePackTable(req: PackTableIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deletePackTable'), req, config);
    }

    async getAllPackTables(req: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<PackTablesResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllPackTables'), req, config)
    }

    async getPackTableById(req: PackTableIdRequest, config?: AxiosRequestConfig): Promise<PackTableResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPackTableById'), req, config)
    }

    async getPackTableRecordById(req: PackTableIdRequest, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPackTableRecordById'), req, config);
    }

    async togglePackType(req: CommonIdReqModal, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('togglePackType'), req, config);
    }
}