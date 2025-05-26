import { DocBundlePanelsRequest, DocMaterialAllocationRequest, DocMaterialAllocationResponse, DocketBasicInfoResponse, DocketsConfirmationListResponse, GlobalResponseObject, ItemCodeInfoResponse, MaterialRequestNoRequest, PoDocketNumberRequest, PoProdutNameRequest, PoRatioIdRequest, PoSerialRequest } from '@xpparel/shared-models';
import { AxiosRequestConfig } from 'axios';
import { CPSCommonAxiosService } from '../cps-common-axios-service';

export class CpsBullQueueService extends CPSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/bull-queue-jobs/' + childUrl;
    }
    
    async addPoDocketSerialGenerationJob(reqModel: PoSerialRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('addPoDocketSerialGenerationJob'), reqModel, config);
    }

    async addJobForPopulateCutFinishedGoods(reqModel: PoSerialRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('addJobForPopulateCutFinishedGoods'), reqModel, config);
    }
}
