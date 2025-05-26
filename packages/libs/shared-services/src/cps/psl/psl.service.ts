import { GlobalResponseObject, MrnCreateRequest, MrnIdStatusRequest, MrnRequestResponse, MrnStatusRequest, PoSerialRequest, SI_MoNumberRequest } from '@xpparel/shared-models';
import { AxiosRequestConfig } from 'axios';
import { CPSCommonAxiosService } from '../cps-common-axios-service';

export class CpsPslService extends CPSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/psl/' + childUrl;
    }

    async createPslBundlesInCPS(req: PoSerialRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createPslBundlesInCPS'), req, config);
    }

    async deletePslBundlesInCPS(req: PoSerialRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deletePslBundlesInCPS'), req, config);
    }
    
    async createOslRefIdsForMo(reqModel: SI_MoNumberRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createOslRefIdsForMo'), reqModel, config);
    }
   
    async deleteOslRefIdsForMo(reqModel: SI_MoNumberRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteOslRefIdsForMo'), reqModel, config);
    }

}
