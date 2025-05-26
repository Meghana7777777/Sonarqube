import { CommonResponse } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { PKMSCommonAxiosService } from "../pkms-common-axios-service";

export class ScanningScreenServices extends PKMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/Scanning-screen/' + childUrl;
    }

    async getCartonInfoAgainstPackTable(req: any, config?: AxiosRequestConfig): Promise<any> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getCartonInfoAgainstPackTable'), req, config);
    }

    async updateScannedQty(req: any, config?: AxiosRequestConfig): Promise<any> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateScannedQty'), req, config);
    }
}
