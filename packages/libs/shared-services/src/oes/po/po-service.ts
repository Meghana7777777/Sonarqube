import { AxiosRequestConfig } from 'axios';
import { OESCommonAxiosService } from '../oes-common-axios-service';
import { CommonResponse, FgFindingOptions, FgNumbersResp, GlobalResponseObject, OrderLineRequest, OrderLinesRequest, PoCreateRequest, PoProdNameResponse, PoProdTypeAndFabResponse, PoSerialRequest, PoSizesResponse, PoSubLineResponse, PoSummaryModel, PoSummaryResponse, RawOrderNoRequest } from '@xpparel/shared-models';


export class POService extends OESCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/po/' + childUrl;
    }

    async createPo(reqModel: PoCreateRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createPo'), reqModel, config);
    }

    async deletePo(reqModel: PoSerialRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deletePo'), reqModel, config);
    }

   

    async getPosForMo(reqModel: RawOrderNoRequest, config?: AxiosRequestConfig): Promise<PoSummaryResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPosForMo'), reqModel, config);
    }

    async getPoLineLevelSizeQtys(reqModel: PoSerialRequest, config?: AxiosRequestConfig): Promise<PoSizesResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPoLineLevelSizeQtys'), reqModel, config);
    }

    async getPoProductNames(reqModel: PoSerialRequest, config?: AxiosRequestConfig): Promise<PoProdNameResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPoProductNames'), reqModel, config);
    }
    
    async getPoBasicInfoByPoSerial(reqModel: PoSerialRequest, config?: AxiosRequestConfig): Promise<PoSummaryResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPoBasicInfoByPoSerial'), reqModel, config);
    }

    async getDistinctFgNumbersForGivenOptions(reqModel: FgFindingOptions, config?: AxiosRequestConfig): Promise<FgNumbersResp> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getDistinctFgNumbersForGivenOptions'), reqModel, config);
    }

    async getPoInfoByPoSerial(reqModel: PoSerialRequest, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPoInfoByPoSerial'), reqModel, config);
    }

    async getPoProductNamesForMOrderLines(reqModel: OrderLinesRequest, config?: AxiosRequestConfig): Promise<PoProdNameResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPoProductNamesForMOrderLines'), reqModel, config);
    }
    // CUT 
    async getPosForSo(reqModel: RawOrderNoRequest, config?: AxiosRequestConfig): Promise<PoSummaryResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPosForSo'), reqModel, config);
    }

    
    async getPoSummary(reqModel: PoSerialRequest, config?: AxiosRequestConfig): Promise<PoSummaryResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPoSummary'), reqModel, config);
    }
 

}