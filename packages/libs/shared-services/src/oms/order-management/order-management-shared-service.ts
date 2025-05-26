import { CommonRequestAttrs, GlobalResponseObject, MoConfigStatusEnum, MoDataForSoSummaryResponse, MoNumberDropdownModel, ProcessingOrderCreationInfoResponse, ProcessTypeEnum, ProcessTypeSizeWiseRequest, ProcessTypeWiseSizeResponse, SoSummaryRequest, StyleCodeRequest, StyleCodesDropdownModel, StyleCodesDropdownResponse } from '@xpparel/shared-models';
import { ManufacturingOrderDumpRequest, MoNumberDropdownResponse, SI_ManufacturingOrderInfoResponse, SI_MoNumberRequest, SI_MoProductSubLineIdsRequest, StyleMoRequest } from '@xpparel/shared-models';
import { AxiosRequestConfig } from 'axios';
import { OMSCommonAxiosService } from '../oms-common-axios-service';

export class OrderManagementService extends OMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/order-management/' + childUrl;
    }

    async saveManufacturingOrderDumpData(reqModel: ManufacturingOrderDumpRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject[]> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('saveManufacturingOrderDumpData'), reqModel, config);
    }

    async getMoDataBySoForSoSummary(reqObj: SoSummaryRequest, config?: AxiosRequestConfig): Promise<MoDataForSoSummaryResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getModataBySoForSoSummary'), reqObj, config);
    }

    async sampleApiOne(reqObj: ProcessTypeSizeWiseRequest, config?: AxiosRequestConfig): Promise<ProcessTypeWiseSizeResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('sampleApiOne'), reqObj, config)
    }

    async sampleApiTwo(reqObj: ProcessTypeSizeWiseRequest, config?: AxiosRequestConfig): Promise<ProcessTypeWiseSizeResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('sampleApiTwo'), reqObj, config)
    }

    async sampleApiThree(reqObj: ProcessTypeSizeWiseRequest, config?: AxiosRequestConfig): Promise<ProcessTypeWiseSizeResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('sampleApiThree'), reqObj, config)
    }

}