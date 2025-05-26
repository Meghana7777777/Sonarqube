import { DocBundlePanelsRequest, DocMaterialAllocationRequest, DocMaterialAllocationResponse, DocketBasicInfoResponse, DocketNumberResponse, DocketsConfirmationListResponse, EmbBundleScanRequest, EmbBundleScanResponse, EmbJobBundleResponse, GlobalResponseObject, ItemCodeInfoResponse, JobScanQtyBasicResponse, MarkerSpecificDocketsResponse, MaterialRequestNoRequest, PoCutResponse, PoDocketNumberRequest, PoDocketNumbersRequest, PoDocketOpCodeRequest, PoProdutNameRequest, PoRatioIdMarkerIdRequest, PoRatioIdRequest, PoSerialRequest, PoSerialWithCutPrefRequest } from '@xpparel/shared-models';
import { AxiosRequestConfig } from 'axios';
import { EtsCommonAxiosService } from '../ets-common-axios-service';

export class EmbTrackingService extends EtsCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/emb-tracking/' + childUrl;
    }
    
    // async generateCuts(reqModel: PoRatioIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
    //     return await this.axiosPostCall(this.getURLwithMainEndPoint('generateCuts'), reqModel, config);
    // }

    async getEmbJobBundlesInfo(req: PoDocketOpCodeRequest, config?: AxiosRequestConfig): Promise<EmbJobBundleResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getEmbJobBundlesInfo'), req, config);
    }

    async reportEmbBundle(req: EmbBundleScanRequest, config?: AxiosRequestConfig): Promise<EmbBundleScanResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('reportEmbBundle'), req, config);
    }

    async reportEmbBundleReversal(req: EmbBundleScanRequest, config?: AxiosRequestConfig): Promise<EmbBundleScanResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('reportEmbBundleReversal'), req, config);
    }

    async reportEmbBundleRejReversal(req: EmbBundleScanRequest, config?: AxiosRequestConfig): Promise<EmbBundleScanResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('reportEmbBundleRejReversal'), req, config);
    }

    async getEmbJobWiseReportedQtysForRefJobNos(req: PoDocketNumbersRequest, config?: AxiosRequestConfig): Promise<JobScanQtyBasicResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getEmbJobWiseReportedQtysForRefJobNos'), req, config);
    }
}
