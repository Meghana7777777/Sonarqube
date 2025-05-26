import { GlobalResponseObject, INSConfigTransferReqModel } from '@xpparel/shared-models';
import { AxiosRequestConfig } from 'axios';
import { INSCommonAxiosService } from '../../common-axios-service';

export class InsBullQueueService extends INSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/ins-bull-queue-jobs/' + childUrl;
    }
    

    async addRMInspections(reqModel: INSConfigTransferReqModel, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('addRMInspections'), reqModel, config);
    }

    async addFGInspections(reqModel: INSConfigTransferReqModel, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('addFGInspections'), reqModel, config);
    }


}
