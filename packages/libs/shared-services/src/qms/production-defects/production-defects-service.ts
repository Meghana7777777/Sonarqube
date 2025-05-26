import { CommonResponse, PoNumberReq, ProdcutionDefectReq } from "@xpparel/shared-models";
import { QMSCommonAxiosService } from "../common-axios.service";

export class ProductionDefectService extends QMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/production-defects/' + childUrl;
    }

    async createSewingDefect(payload: ProdcutionDefectReq): Promise<CommonResponse> {
        return this.axiosPostCall(this.getURLwithMainEndPoint("createSewingDefect"), payload)
    }

    async sendMail(payload: any): Promise<CommonResponse> {
        return this.axiosPostCall(this.getURLwithMainEndPoint("sendMail"), payload)
    }

    async getPassFailCount(payload: PoNumberReq): Promise<CommonResponse> {
        return this.axiosPostCall(this.getURLwithMainEndPoint("getPassFailCount"), payload)
    }

    async getSewingQtyAgainstPo(payload: any): Promise<CommonResponse> {
        return this.axiosPostCall(this.getURLwithMainEndPoint("getSewingQtyAgainstPo"), payload)
    }

    async getSewingDefectInfo(payload: any): Promise<CommonResponse> {
        return this.axiosPostCall(this.getURLwithMainEndPoint("getSewingDefectInfo"), payload)
    }

}