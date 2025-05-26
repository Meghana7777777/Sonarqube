import { CommonRequestAttrs, DeleteSewOrderCreation, GlobalResponseObject, MoCustomerInfoHelperResponse, OslIdFgsSpsResponse, OslRefIdRequest, SewingCreationOptionsModel, SewingCreationResponse, SewingOrderCreationRequest, SewSerialRequest, SewSerialResponse, SubLineIdsByOrderNoRequest, SubLineIdsByOrderNoResponse } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { SPSCommonAxiosService } from "../sps-common-axios.service";


export class SewingOrderCreationService extends SPSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/sewing-order/' + childUrl;
    }

    async saveSewingOrderCreation(reqModel: SewingCreationOptionsModel, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('saveSewingOrderCreation'), reqModel, config);
    }

    async getSewingOrderCreatedData(reqModel: SewingOrderCreationRequest, config?: AxiosRequestConfig): Promise<SewingCreationResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getSewingOrderCreatedData'),reqModel,config);
    }

    async getSewSubLineIdsByOrderNumber(reqModel: SubLineIdsByOrderNoRequest, config?: AxiosRequestConfig): Promise<SubLineIdsByOrderNoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getSewSubLineIdsByOrderNumber'),reqModel,config);
    }

    async getMoCustomerPoInfoForSewSerial(reqModel: SewSerialRequest, config?: AxiosRequestConfig): Promise<MoCustomerInfoHelperResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getMoCustomerPoInfoForSewSerial'), reqModel, config);
    }

    async deleteSewingOrder(reqModel:DeleteSewOrderCreation,config?:AxiosRequestConfig):Promise<GlobalResponseObject>{
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteSewingOrder'),reqModel,config)
    }

    async getFgInfoByOSLRefIds(reqModel:OslRefIdRequest, config?:AxiosRequestConfig):Promise<OslIdFgsSpsResponse>{
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getFgInfoByOSLRefIds'),reqModel,config)
    }
    async getAllSewSerials(reqModel: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<SewSerialResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllSewSerials'), reqModel, config)
    }
}