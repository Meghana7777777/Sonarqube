import { CommonResponse, DateRequest } from "@xpparel/shared-models";
import { QMSCommonAxiosService } from "../common-axios.service";

export class PoCreationService extends QMSCommonAxiosService {
    private getURLwithMainEndPoint(childUrl: string) {
        return '/production-defects/' + childUrl;
    }

    async getByPoNumber(): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getByPoNumber'))
    }

    async getAllOpenPo(): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllOpenPo'))
    }

    async getAllTotalDefects(req?: DateRequest): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllTotalDefects'), req)
    }

    async getAllPassCount(req?: DateRequest): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllPassCount'), req)
    }

    async getAllFailCount(req?: DateRequest): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllFailCount'), req)
    }
  
    async getAllBuyerWiseDefect(req?: DateRequest): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllBuyerWiseDefect'), req)
    }
  
    async getAllPOWiseDefect(req?: DateRequest): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllPOWiseDefect'), req)
    }
  
    async getAllTopTenDefects(req?: DateRequest): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllTopTenDefects'), req)
    }
  
    async getAllQualityTypeTopTenDefects(req?: DateRequest): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllQualityTypeTopTenDefects'), req)
    }

}