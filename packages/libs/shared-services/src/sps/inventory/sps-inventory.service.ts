import { GlobalResponseObject, SPS_C_ProdColorEligibleBundlesForMoveToInvRequest, SPS_R_ProdColorEligibleBundlesForMoveToInvResponse, SPS_C_BundleInvConfirmationIdRequest, SPS_C_ProdColorEligibleBundlesMovingToInvRequest, SPS_R_MoveToInvConfirmationsResponse, SPS_C_ProdColorInvConfirmationsRetrievalRequest, SPS_C_ProdColorBundlesSummaryRequest, SPS_R_MoveToInvAllBundlesResponse, SPS_R_MoveToInvProcSerialSummaryResponse } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { SPSCommonAxiosService } from "../sps-common-axios.service";


export class SpsInventoryService extends SPSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/inventory/' + childUrl;
    }
        
    async getEligibleBundlesToMoveToInventoryForPoProdColorProcType(req: SPS_C_ProdColorEligibleBundlesForMoveToInvRequest, config?: AxiosRequestConfig): Promise<SPS_R_ProdColorEligibleBundlesForMoveToInvResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getEligibleBundlesToMoveToInventoryForPoProdColorProcType'), req, config);
    }

    async moveOutputCompletedProcTypeBundlesToInventory(req: SPS_C_ProdColorEligibleBundlesMovingToInvRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('moveOutputCompletedProcTypeBundlesToInventory'), req, config);
    }
    
    async deleteBundleInventoryMovedConfirmation(req: SPS_C_BundleInvConfirmationIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteBundleInventoryMovedConfirmation'), req, config);
    }

    async getInventoryConfirmationsForPoProdColorProcType(req: SPS_C_ProdColorInvConfirmationsRetrievalRequest, config?: AxiosRequestConfig): Promise<SPS_R_MoveToInvConfirmationsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getInventoryConfirmationsForPoProdColorProcType'), req, config);
    }

    async getInventoryConfirmedBundlesForConfirmationId(req: SPS_C_BundleInvConfirmationIdRequest, config?: AxiosRequestConfig): Promise<SPS_R_MoveToInvConfirmationsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getInventoryConfirmedBundlesForConfirmationId'), req, config);
    }

    async updateExtSystemAckForInventoryConfirmation(req: SPS_C_BundleInvConfirmationIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateExtSystemAckForInventoryConfirmation'), req, config);
    }

    async getAllBundlesForPoProdColorProcType(req: SPS_C_ProdColorBundlesSummaryRequest, config?: AxiosRequestConfig): Promise<SPS_R_MoveToInvAllBundlesResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllBundlesForPoProdColorProcType'), req, config);
    } 

    async getInventoryMovementSummaryForPoProdColorProcType(req: SPS_C_ProdColorBundlesSummaryRequest, config?: AxiosRequestConfig): Promise<SPS_R_MoveToInvProcSerialSummaryResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getInventoryMovementSummaryForPoProdColorProcType'), req, config);
    }
}