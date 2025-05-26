import { GlobalResponseObject, PackingListIdRequest, PackSerialRequest, SI_MoNumberRequest } from '@xpparel/shared-models';
import { AxiosRequestConfig } from 'axios';
import { PKMSCommonAxiosService } from '../pkms-common-axios-service';

export class PKMSBullQueueService extends PKMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/bull-queue-jobs/' + childUrl;
    }
    
    async addJobForPopulatePackFinishedGoods(reqModel: PackSerialRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('addJobForPopulatePackFinishedGoods'), reqModel, config);
    }

    async addJobsToGeneratePackJobs(reqModel: PackingListIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('addJobsToGeneratePackJobs'), reqModel, config);
    }

    async sendMoConfirmationStatusToPKMS(reqModel: SI_MoNumberRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('sendMoConfirmationStatusToPKMS'), reqModel, config);
    }
    
    async sendMoDeConfirmationStatusToPKMS(reqModel: SI_MoNumberRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('sendMoDeConfirmationStatusToPKMS'), reqModel, config);
    }
}
