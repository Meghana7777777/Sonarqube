import { ComponentResponse, GlobalResponseObject } from '@xpparel/shared-models'; //'../../../shared-models/src'
import { WMSCommonAxiosService } from '../../wms/common-axios-service';
import { AxiosRequestConfig } from 'axios';
import { OMSCommonAxiosService } from '../oms-common-axios-service';

export class ComponentServices extends OMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/component/' + childUrl;
    }

    async createComponent(reqModel: any, config?: AxiosRequestConfig): Promise<ComponentResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createComponent'), reqModel, config);
    }

    async deleteComponent(reqModel: any, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteComponent'), reqModel, config);
    }

    async getAllComponents(reqModel: any, config?: AxiosRequestConfig): Promise<ComponentResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllComponents'), reqModel, config);
    }

    async getComponent(reqModel: any, config?: AxiosRequestConfig): Promise<ComponentResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getComponent'), reqModel, config);
    }
    
}