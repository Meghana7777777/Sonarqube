import { GlobalResponseObject, SI_MoNumberRequest, MOC_MoBOMCreationRequest, MOC_MoBomModelResponse, MOC_MoOrderRevisionRequest, MOC_MoOrderRevisionResponse, MOC_MoProdCodeRequest, MOC_MoProductFabConsResponse, MOC_MoProductFabConsumptionRequest, MOCProductFgColorVersionRequest, MC_PoPslbBundleDetailModel, ProductSubLineAndBundleDetailResponse, MC_MoProcessTypeModel, MoProductSubLineIdsRequest, MC_StyleMoNumbersRequest, RoutingGroupDetailsResponse, MC_ProductSubLineProcessTypeRequest, ProcessTypeEnum, OMS_R_MoOperationsListInfoResponse, ProcessingOrderSerialRequest, MC_MoNumberRequest, PlannedBundleResponseModel } from "@xpparel/shared-models";
import { OMSCommonAxiosService } from "../oms-common-axios-service";
import { AxiosRequestConfig } from "axios";


export class MOConfigService extends OMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/order-config/' + childUrl;
    }


    async updateBomForOpVersionMoProductFgColor(reqModel: MOC_MoBOMCreationRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateBomForOpVersionMoProductFgColor'), reqModel, config);
    }

    async getBomForOpVersionMoProductFgColor(reqModel: MOCProductFgColorVersionRequest, config?: AxiosRequestConfig): Promise<MOC_MoBomModelResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getBomForOpVersionMoProductFgColor'), reqModel, config);
    }

    async saveFabConsumptionForMoProduct(reqModel: MOC_MoProductFabConsumptionRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('saveFabConsumptionForMoProduct'), reqModel, config);
    }

    async getFabConsumptionForMoProduct(reqModel: MOC_MoProdCodeRequest, config?: AxiosRequestConfig): Promise<MOC_MoProductFabConsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getFabConsumptionForMoProduct'), reqModel, config);
    }

    // ----------------------------- ORDER REVISION ---------------------
    async saveOrderRevisionForMo(reqModel: MOC_MoOrderRevisionRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('saveOrderRevisionForMo'), reqModel, config);
    }

    async getOrderRevisionForMo(reqModel: MOC_MoProdCodeRequest, config?: AxiosRequestConfig): Promise<MOC_MoOrderRevisionResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getOrderRevisionForMo'), reqModel, config);
    }

    async confirmMoProceeding(reqModel: SI_MoNumberRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        // need to update the proceeding status for the MO in the mo_info table
        return await this.axiosPostCall(this.getURLwithMainEndPoint('confirmMoProceeding'), reqModel, config);
    }

    async unConfirmMoProceedingForOMS(reqModel: SI_MoNumberRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        // need to update the proceeding status for the MO in the mo_info table
        return await this.axiosPostCall(this.getURLwithMainEndPoint('unConfirmMoProceedingForOMS'), reqModel, config);
    }

    async unConfirmMoProceeding(reqModel: SI_MoNumberRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        // need to update the proceeding status for the MO in the mo_info table
        return await this.axiosPostCall(this.getURLwithMainEndPoint('unConfirmMoProceeding'), reqModel, config);
    }


    async createProcessingBundlesForMO(reqModel: SI_MoNumberRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createProcessingBundlesForMO'), reqModel, config);
    }


    async getEligibleBundleInfoToCreatePO(reqModel: MC_MoProcessTypeModel, config?: AxiosRequestConfig): Promise<ProductSubLineAndBundleDetailResponse> {
        console.log(this.getURLwithMainEndPoint('getEligibleBundleInfoToCreatePO'))
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getEligibleBundleInfoToCreatePO'), reqModel, config)
    }

    async updateProcessSerialToBundles(reqModel: MC_PoPslbBundleDetailModel, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateProcessSerialToBundles'), reqModel, config);
    }


    async getEligibleBundleInfoForGivenSubLineIds(reqModel: MoProductSubLineIdsRequest, config?: AxiosRequestConfig): Promise<ProductSubLineAndBundleDetailResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getEligibleBundleInfoForGivenSubLineIds'), reqModel, config);
    }

    async checkAndGetBundleGroupsForGivenMos(reqModel: MC_StyleMoNumbersRequest, config?: AxiosRequestConfig): Promise<RoutingGroupDetailsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('checkAndGetBundleGroupsForGivenMos'), reqModel, config);
    }

    async getSizeWiseComponentConsumptionForSubLineIds(reqModel: MC_ProductSubLineProcessTypeRequest, config?: AxiosRequestConfig): Promise<MOC_MoProductFabConsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getSizeWiseComponentConsumptionForSubLineIds'), reqModel, config);
    }

    async getOperationsListInfoForMo(reqModel: SI_MoNumberRequest, config?: AxiosRequestConfig): Promise<OMS_R_MoOperationsListInfoResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getOperationsListInfoForMo'), reqModel, config);
    }

    async unMapProcessingSerialsToBundles(reqModel: ProcessingOrderSerialRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('unMapProcessingSerialsToBundles'), reqModel, config);
    }

    async getMoPlannedBundlesFromRequest(reqModel: MC_MoNumberRequest, config?: AxiosRequestConfig): Promise<PlannedBundleResponseModel> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getMoPlannedBundlesFromRequest'), reqModel, config);
    }

}