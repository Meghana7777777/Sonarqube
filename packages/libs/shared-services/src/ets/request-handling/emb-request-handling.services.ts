import { EmbBarcodePrintRequest, EmbJobNumberRequest, GlobalResponseObject, LayIdsRequest, PoDocketNumberRequest, PoDocketNumbersRequest, PoEmbHeaderResponse, PoSerialWithEmbPrefRequest } from '@xpparel/shared-models';
import { AxiosRequestConfig } from 'axios';
import { EtsCommonAxiosService } from '../ets-common-axios-service';

export class EmbRequestHandlingService extends EtsCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/emb-request/' + childUrl;
    }
    
    async createEmbRequest(reqModel: PoDocketNumberRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createEmbRequest'), reqModel, config);
    }

    async deleteEmbLine(reqModel: LayIdsRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteEmbLine'), reqModel, config);
    }

    async deleteEmbHeader(reqModel: PoDocketNumberRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteEmbHeader'), reqModel, config);
    }

    async getEmbJobsForPo(reqModel: PoSerialWithEmbPrefRequest, config?: AxiosRequestConfig): Promise<PoEmbHeaderResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getEmbJobsForPo'), reqModel, config);
    }

    async getEmbJobsForEmbJobNumber(reqModel: EmbJobNumberRequest, config?: AxiosRequestConfig): Promise<PoEmbHeaderResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getEmbJobsForEmbJobNumber'), reqModel, config);
    }

    async getEmbJobsForEmbLineIds(reqModel: EmbJobNumberRequest, config?: AxiosRequestConfig): Promise<PoEmbHeaderResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getEmbJobsForEmbLineIds'), reqModel, config);
    }

    async printBarcodesForEmbJob(reqModel: EmbBarcodePrintRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('printBarcodesForEmbJob'), reqModel, config);
    }

    async releaseBarcodesPrintForEmbJob(reqModel: EmbBarcodePrintRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('releaseBarcodesPrintForEmbJob'), reqModel, config);
    }

    async freezeEmbLines(reqModel: PoDocketNumbersRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('freezeEmbLines'), reqModel, config);
    }

    async unFreezeEmbLines(reqModel: PoDocketNumbersRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('unFreezeEmbLines'), reqModel, config);
    }
}
