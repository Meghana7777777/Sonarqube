import { GlobalResponseObject, LayIdsRequest, PoDocketNumberRequest } from '@xpparel/shared-models';
import { AxiosRequestConfig } from 'axios';
import { EtsCommonAxiosService } from '../ets-common-axios-service';

export class EtsBullQueueService extends EtsCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/ets-bull-queue-jobs/' + childUrl;
    }
    
    /**
     * Will be called from the CPS after the cut is reported. 
     * @param reqModel 
     * @param config 
     * @returns 
     */
    async addEmbRequestGenJob(reqModel: PoDocketNumberRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('addEmbRequestGenJob'), reqModel, config);
    }

    
    // Will be called from the CPS after the docket unconfirmed / dockets are deleted
    async addEmbHeaderDelJob(reqModel: PoDocketNumberRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('addEmbHeaderDelJob'), reqModel, config);
    }

    // Will be called from the CPS after cut is reversed for 1 laying operation
    async addEmbLineDelJob(reqModel: LayIdsRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('addEmbLineDelJob'), reqModel, config);
    }
}
