import { CommonRequestAttrs, GlobalResponseObject, ItemCodeInfoResponse, OrderNoRequest ,
    //  ManufacturingOrderListRequest 
    } from '@xpparel/shared-models'; //'../../../shared-models/src'
import { WMSCommonAxiosService } from '../../wms/common-axios-service';
import { AxiosRequestConfig } from 'axios';
import { OMSCommonAxiosService } from '../oms-common-axios-service';

export class OMSPreIntegrationServices extends OMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/pre-integration/' + childUrl;
    }

    async getOrderInformationFromDump(reqModel: any, config?: AxiosRequestConfig): Promise<ItemCodeInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getOrderInformationFromDump'), reqModel, config);
    }

    // async saveManufacturingOrderListInformation(reqModel: ManufacturingOrderListRequest, config?: AxiosRequestConfig): Promise<ItemCodeInfoResponse> {
    //     return await this.axiosPostCall(this.getURLwithMainEndPoint('saveManufacturingOrderListInformation'), reqModel, config);
    // }

    async getAllOrdersWithSelectedFields(reqModel: OrderNoRequest, config?: AxiosRequestConfig): Promise<any[]> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllOrdersWithSelectedFields'), reqModel, config);
    }
        
}