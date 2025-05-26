import { GlobalResponseObject, ManufacturingOrderDumpRequest } from '@xpparel/shared-models';
import { AxiosRequestConfig } from 'axios';
import { OMSCommonAxiosService } from '../oms-common-axios-service';

export class OrderManagementServiceOld extends OMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/order-management/' + childUrl;
    }

    async saveManufacturingOrderDumpData(reqModel: ManufacturingOrderDumpRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject[]> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('saveManufacturingOrderDumpData'), reqModel, config);
    }
}