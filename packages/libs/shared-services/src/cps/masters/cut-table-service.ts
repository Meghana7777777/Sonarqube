import { CommonRequestAttrs, CutTableCreateRequest, CutTableIdRequest, CutTableResponse, GlobalResponseObject } from '@xpparel/shared-models';
import { AxiosRequestConfig } from 'axios';
import { CPSCommonAxiosService } from '../cps-common-axios-service';

export class CutTableService extends CPSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/cut-table/' + childUrl;
    }

    async createCutTable(reqModel: CutTableCreateRequest, config?: AxiosRequestConfig): Promise<CutTableResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createCutTable'), reqModel, config);
    }

    async deleteCutTable(reqModel: CutTableIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteCutTable'), reqModel, config);
    }

    async getAllCutTables(reqModel: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<CutTableResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllCutTables'), reqModel, config);
    }

    async getCutTablebyId(reqModel: CutTableIdRequest, config?: AxiosRequestConfig): Promise<CutTableResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getCutTablebyId'), reqModel, config);
    }
    
}