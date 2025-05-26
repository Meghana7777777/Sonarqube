import { AxiosRequestConfig } from "axios";
import { INVSCommonAxiosService } from "../invs-common-axios-service";
import {GlobalResponseObject,KMS_C_KnitOrderBundlingConfirmationIdRequest,SPS_C_InvOutConfirmationRequest,SI_MoNumberRequest, CPS_C_BundlingConfirmationIdRequest, INV_C_AvlBundlesForPslRequest, INV_R_AvlBundlesForPslResponse, SPS_C_BundleInvConfirmationIdRequest} from "@xpparel/shared-models";

export class InvCreationService extends INVSCommonAxiosService {
    private getURLwithMainEndPoint(childUrl: string): string {
        return '/inv-creation/' + childUrl;
    }

    async createKnitInvInRequestByConfirmationId(reqModel: KMS_C_KnitOrderBundlingConfirmationIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createKnitInvInRequestByConfirmationId'), reqModel, config);
    }

    async deleteKnitInvInRequestByConfirmationId(reqModel: KMS_C_KnitOrderBundlingConfirmationIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteKnitInvInRequestByConfirmationId'), reqModel, config);
    }

    async createPslRefIdsForMo(reqModel: SI_MoNumberRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createPslRefIdsForMo'), reqModel, config);
    }

    async deletePslRefIdsForMo(reqModel: SI_MoNumberRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deletePslRefIdsForMo'), reqModel, config);
    }

    async createSpsInvInRequestByConfirmationId(reqModel: SPS_C_BundleInvConfirmationIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createSpsInvInRequestByConfirmationId'), reqModel, config);
    }

    async deleteSpsInvInRequestByConfirmationId(reqModel: SPS_C_BundleInvConfirmationIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteSpsInvInRequestByConfirmationId'), reqModel, config);
    }

    async createCutInvInRequestByConfirmationId(reqModel: CPS_C_BundlingConfirmationIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createCutInvInRequestByConfirmationId'), reqModel, config);
    }

    async deleteCutInvInRequestByConfirmationId(reqModel: CPS_C_BundlingConfirmationIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteCutInvInRequestByConfirmationId'), reqModel, config);
    }

    async getAvailableBundlesInvForPslIds(reqModel: INV_C_AvlBundlesForPslRequest, config?: AxiosRequestConfig): Promise<INV_R_AvlBundlesForPslResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAvailableBundlesInvForPslIds'), reqModel, config);
    }
}
