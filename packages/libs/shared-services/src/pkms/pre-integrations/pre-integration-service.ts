
import { CommonRequestAttrs, CommonResponse, GlobalResponseObject, MaterialTypesResponse, MoNumberResDto, PackOrderCreationModel, PackOrderCreationResponse, PackSerialDropDownResponse, PackSerialRequest, PackSubLineIdsByOrderNoRequest, PackSubLineIdsByOrderNoResponse, PKMS_C_ReadyToPackFgsRequest, PoDataSummaryResponse, ProcessingOrderCreationInfoResponse, ProcessingOrderCreationRequest, ProcessingOrderInfoRequest, ProcessingOrderInfoResponse, ProcessingOrderSerialRequest, SI_MoNumberRequest, StyleMoRequest ,MoPslIdsRequest, MoPslQtyInfoResponse,} from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { PKMSCommonAxiosService } from "../pkms-common-axios-service";

export class PreIntegrationServicePKMS extends PKMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/pre-integration/' + childUrl;
    }

    async savePOData(req: PackOrderCreationModel, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('savePOData'), req, config);
    }

    async deletePackOrder(req: PackSerialRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deletePackOrder'), req, config);
    }

    async getMOInfoForPKMSPrcOrdCreation(req: StyleMoRequest, config?: AxiosRequestConfig): Promise<ProcessingOrderCreationInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getMOInfoForPKMSPrcOrdCreation'), req, config);
    }


    async getOrderInfo(req: PackSerialRequest, config?: AxiosRequestConfig): Promise<MaterialTypesResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getOrderInfo'), req, config);
    }

    async getAllPackSerialDropdownData(req: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<PackSerialDropDownResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllPackSerialDropdownData'), req, config)
    }

    async getAllPoLinesDropDownData(req: any, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllPoLinesDropDownData'), req, config)
    }

    async getAllPoSubLineDropDownData(req: any, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllPoSubLineDropDownData'), req, config)
    }

    async getPackSubLineIdsByOrderNumber(reqModel: PackSubLineIdsByOrderNoRequest, config?: AxiosRequestConfig): Promise<PackSubLineIdsByOrderNoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPackSubLineIdsByOrderNumber'), reqModel, config);
    }

    async getPackSerialNumbers(reqModel: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<PackOrderCreationResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPackSerialNumbers'), reqModel, config);
    }

    async createPKMSProcessingOrder(reqModel: ProcessingOrderCreationRequest, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createPKMSProcessingOrder'), reqModel, config);
    }

    async getPKMSPoInfoForStyleAndMo(reqModel: StyleMoRequest, config?: AxiosRequestConfig): Promise<ProcessingOrderInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPKMSPoInfoForStyleAndMo'), reqModel, config);
    }

    async getProcessingOrderInfo(reqModel: ProcessingOrderInfoRequest, config?: AxiosRequestConfig): Promise<ProcessingOrderInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getProcessingOrderInfo'), reqModel, config);
    }
    //MoNumberResDto resDto
    async getPKMSMoNumbers(reqModel: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPKMSMoNumbers'), reqModel, config);
    }

    async getPKMSPackOrdersByMo(reqModel: MoNumberResDto, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPKMSPackOrdersByMo'), reqModel, config);
    }

    async getPoSummary(req: ProcessingOrderSerialRequest, config?: AxiosRequestConfig): Promise<PoDataSummaryResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPoSummary'), req, config);
    }

    async getPoQtysInfoForMoPSLIds(req: MoPslIdsRequest, config?: AxiosRequestConfig): Promise<MoPslQtyInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPoQtysInfoForMoPSLIds'), req, config);
    }
    
    async createOslRefIdsForMo(reqModel: SI_MoNumberRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createOslRefIdsForMo'), reqModel, config);
    }

    async deleteOslRefIdsForMo(reqModel: SI_MoNumberRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteOslRefIdsForMo'), reqModel, config);
    }

    async logReadyToPackFgs(reqModel: PKMS_C_ReadyToPackFgsRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('logReadyToPackFgs'), reqModel, config);
    }
}
