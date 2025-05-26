import { AxiosRequestConfig } from 'axios';
import { PTSCommonAxiosService } from '../pts-common-axios.service';
import { BarcodeDetailsForBundleScanning, BarcodeScanningResultResponse, BundleScanningRequest, GlobalResponseObject, OpsFgsInfoResponse, SewSerialFgNumberReq} from '@xpparel/shared-models';


export class FgReportingService extends PTSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/fg-reporting/' + childUrl;
    }

    async reportOperationForJob(reqModel: any, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('reportOperationForJob'), reqModel, config);
    }

    async reportOpForBarcode(reqModel: BundleScanningRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('reportOpForBarcode'), reqModel, config);
    }

    async reportOpForJob(reqModel: BarcodeDetailsForBundleScanning, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('reportOpForJob'), reqModel, config);
    }

    // for bundle reporting
    async barcodeAutoReporting(reqModel: BundleScanningRequest, config?: AxiosRequestConfig): Promise<BarcodeScanningResultResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('barcodeAutoReporting'), reqModel, config);
    }

    // for sewing job reporting
    async barcodeManualReporting(reqModel: BarcodeDetailsForBundleScanning, config?: AxiosRequestConfig): Promise<BarcodeScanningResultResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('barcodeManualReporting'), reqModel, config);
    }

    async getOperationLevelFgInfoForGivenFgs(reqModel: SewSerialFgNumberReq, config?: AxiosRequestConfig): Promise<OpsFgsInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getOperationLevelFgInfoForGivenFgs'), reqModel, config);
    }
}