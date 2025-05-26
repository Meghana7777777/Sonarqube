import { CommonRequestAttrs, GlobalResponseObject, ShiftCreateRequest, ShiftResponse } from '@xpparel/shared-models'; //'../../../shared-models/src'
import { AxiosRequestConfig } from 'axios';
import { UmsCommonAxiosService } from '../common-axios-service';

export class ShiftService extends UmsCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/shift/' + childUrl;
    }

    async createShift(reqModel: ShiftCreateRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createShift'), reqModel, config);
    }

    async deleteShift(reqModel: ShiftCreateRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteShift'), reqModel, config);
    }

    async getAllShifts(reqModel: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<ShiftResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllShifts'), reqModel, config);
    }
    
}