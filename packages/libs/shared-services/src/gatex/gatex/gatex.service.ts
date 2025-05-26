import { ADDHistoryReqModel, ADDVehicleReqModal, CommonRequestAttrs, CommonResponse, GatexRefIdReqDto, GetVehicleNAInrReqModal, GetVehicleResModel, InsBuyerCodeRequest, InsFabInsConfigRequest, InsFabInsConfigResponse, InsFgInsConfigRequest, InsFgInsConfigResponse, InsSupplierCodeRequest, VehicleINRDto, VehicleOTRDto, VehicleRecordsForReferenceIdResponse, VRRefIdsResponseModel, VRStatusReqModel } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { GATEXCommonAxiosService } from "../gatex-common-axios-service";

export class GatexService extends GATEXCommonAxiosService {

    private getUrlWithMainEndPoint(childUrl: string) {
        return '/vhr/' + childUrl;
    }

    async createVINR(req?: VehicleINRDto[], config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('createVINR'), req, config)
    }

    async createVOTR(req?: VehicleOTRDto[], config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('createVOTR'), req, config)
    }

    async getVehicleNotAssignedVINRRequestIds(req?: GetVehicleNAInrReqModal, config?: AxiosRequestConfig): Promise<VRRefIdsResponseModel> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getVehicleNotAssignedVINRRequestIds'), req, config)
    }

    async getVehicleRecordForReferenceId(req?: GatexRefIdReqDto, config?: AxiosRequestConfig): Promise<VehicleRecordsForReferenceIdResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getVehicleRecordForReferenceId'), req, config)
    }

    async getRefIdsByStatus(req?: VRStatusReqModel, config?: AxiosRequestConfig): Promise<VRRefIdsResponseModel> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getRefIdsByStatus'), req, config)
    }
    async addVehicleToVINR(req?: ADDVehicleReqModal, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('addVehicleToVINR'), req, config)
    }
    
    async getVehicleDetails(req: ADDVehicleReqModal, config?: AxiosRequestConfig): Promise<GetVehicleResModel> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('getVehicleDetails'), req, config)
    }

    async addHistoryRecords(req: ADDHistoryReqModel, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getUrlWithMainEndPoint('addHistoryRecords'), req, config)
    }
}