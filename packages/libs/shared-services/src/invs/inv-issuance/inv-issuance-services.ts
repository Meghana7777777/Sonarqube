import { AxiosRequestConfig } from "axios";
import { INVSCommonAxiosService } from "../invs-common-axios-service";
import { GlobalResponseObject, INV_C_InvOutAllocExtRefIdRequest, INV_C_InvOutAllocIdRequest, INV_C_InvOutExtRefIdToGetAllocationsRequest, INV_C_InvCheckForProcTypeAndBundlesRequest, INV_R_InvCheckForProcTypeBundlesResponse, INV_R_InvOutAllocationInfoAndBundlesResponse, SPS_C_InvOutConfirmationRequest, INV_C_PslIdsRequest, BundlesBarcodeResponse } from "@xpparel/shared-models";

export class InvIssuanceService extends INVSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/inv-issuance/' + childUrl;
    }

    async createInvOutRequestForOutConfirmationId(reqModel: SPS_C_InvOutConfirmationRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createInvOutRequestForOutConfirmationId'), reqModel, config);
    }

    async deleteInvOutRequestForOutConfirmationId(reqModel: SPS_C_InvOutConfirmationRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteInvOutRequestForOutConfirmationId'), reqModel, config);
    }

    async allocateInventoryForInvOutRequest(reqModel: INV_C_InvOutAllocExtRefIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('allocateInventoryForInvOutRequest'), reqModel, config);
    }

    async issueInvOutAllocation(reqModel: INV_C_InvOutAllocIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('issueInvOutAllocation'), reqModel, config);
    }

    async getInventoryForGivenBundlesAndProcessTypes(reqModel: INV_C_InvCheckForProcTypeAndBundlesRequest, config?: AxiosRequestConfig): Promise<INV_R_InvCheckForProcTypeBundlesResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getInventoryForGivenBundlesAndProcessTypes'), reqModel, config);
    }

    async getAllocatedInventoryForAllocationId(reqModel: INV_C_InvOutAllocIdRequest, config?: AxiosRequestConfig): Promise<INV_R_InvOutAllocationInfoAndBundlesResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllocatedInventoryForAllocationId'), reqModel, config);
    }

    async getAllocationsForInvOutRequestRefId(reqModel: INV_C_InvOutExtRefIdToGetAllocationsRequest, config?: AxiosRequestConfig): Promise<INV_R_InvOutAllocationInfoAndBundlesResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllocationsForInvOutRequestRefId'), reqModel, config);
    }

    async updateInvAckForAllocationIdSPS(reqModel: INV_C_InvOutAllocIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateInvAckForAllocationIdSPS'), reqModel, config);
    }

    async updateInvIssAckForAllocationIdSPS(reqModel: INV_C_InvOutAllocIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateInvIssAckForAllocationIdSPS'), reqModel, config);
    }

    async updateInvIssAckForAllocationIdPTS(reqModel: INV_C_InvOutAllocIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateInvIssAckForAllocationIdPTS'), reqModel, config);
    }

    async getBundlesBarcodeDetails(reqModel: INV_C_PslIdsRequest, config?: AxiosRequestConfig): Promise<BundlesBarcodeResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getBundlesBarcodeDetails'), reqModel, config);
    }

}
