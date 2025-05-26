import { AxiosRequestConfig } from 'axios';
import { PTSCommonAxiosService } from '../pts-common-axios.service';
import { BarcodeDetailsResponse, BundleScanningRequest, GlobalResponseObject, LastOpCompletedFGsModel, LastOpCompletedFGsResponse} from '@xpparel/shared-models';


export class FgRetrievingService extends PTSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/fg-retrieving/' + childUrl;
    } 

    async reportOperationForJob(reqModel: any, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('reportOperationForJob'), reqModel, config);
    } 

    async getJobDetailsByJobNumber(reqModel: BundleScanningRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getJobDetailsByJobNumber'), reqModel, config);
    } 

    async getJobDetailsByBundle(reqModel: BundleScanningRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getJobDetailsByJobNumber'), reqModel, config);
    } 

    async getBarcodeDetailsForManualScanning(reqModel: BundleScanningRequest, config?: AxiosRequestConfig): Promise<BarcodeDetailsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getBarcodeDetailsForManualScanning'), reqModel, config);
    }

    async getFgsForMoColSize(reqModel: LastOpCompletedFGsModel, config?: AxiosRequestConfig): Promise<LastOpCompletedFGsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getFgsForMoColSize'), reqModel, config);
    }

}