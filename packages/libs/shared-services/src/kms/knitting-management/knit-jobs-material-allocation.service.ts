import { GlobalResponseObject, KC_KnitGroupPoSerialRequest, KG_JobWiseMaterialAllocationDetailRequest, KG_JobWiseMaterialAllocationDetailResponse, KG_KnitJobMaterialAllocationRequest, KG_KnitJobMaterialAllocationResponse, KG_MaterialRequirementDetailResp, KG_MaterialRequirementForKitGroupRequest, KJ_C_KnitJobNumberRequest, KMS_C_JobMainMaterialReqIdRequest, KMS_C_KnitJobMaterialRequest, KMS_R_KnitJobRequestedItemsResponse, WMS_C_IssuanceIdRequest, WMS_MAINMAT_R_JobRequestedMainMatResponse } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { KMSCommonAxiosService } from "../kms-common-axios-service";

export class KnittingJobMaterialAllocationService extends KMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/knitting-jobs-material-allocation/' + childUrl;
    }

    /**
     * Service to get material requirement details for knit group and job numbers
     * Usually calls from UI to show all object info to select the cones
     * @param reqObj 
     * @param config 
     * @returns 
    */
    async getMaterialRequirementForGivenKnitGroup(reqObj: KG_MaterialRequirementForKitGroupRequest, config?: AxiosRequestConfig): Promise<KG_MaterialRequirementDetailResp> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getMaterialRequirementForGivenKnitGroup'), reqObj, config);
    }

    /**
     * Service to Allocate Material for Knit Group
     * Usually calls from UI to after clicking on allocation button 
     * @param reqObj 
     * @param config 
     * @returns 
    */
    async allocateMaterialForKnitGroup(reqObj: KG_KnitJobMaterialAllocationRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('allocateMaterialForKnitGroup'), reqObj, config);
    }

    /**
     * Service to get material allocation details for the knit group 
     * It gives item code wise already allocated qty etc..
     * @param reqObj 
     * @param config 
     * @returns 
    */
    async getMaterialAllocationDetailsForKnitGroup(reqObj: KC_KnitGroupPoSerialRequest, config?: AxiosRequestConfig): Promise<KG_KnitJobMaterialAllocationResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getMaterialAllocationDetailsForKnitGroup'), reqObj, config);
    }

    /**
     * Service to get knitting job wise material allocation details for given knit group
     * Usually calls from UI to show already allocated quantity for particular job
     * @param reqObj 
     * @param config 
     * @returns 
    */
    async getJobWiseMaterialAllocationDetailsForKnitGroup(reqObj: KG_JobWiseMaterialAllocationDetailRequest, config?: AxiosRequestConfig): Promise<KG_JobWiseMaterialAllocationDetailResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getJobWiseMaterialAllocationDetailsForKnitGroup'), reqObj, config);
    }

    /**
     * Service to get the KNit job wise material allocation details for the given knit job including objects 
     * @param reqObj 
     * @param config 
     * @returns 
    */
    async getJobWiseMaterialAllocationDetailsForKnitJob(reqObj: KJ_C_KnitJobNumberRequest, config?: AxiosRequestConfig): Promise<KG_JobWiseMaterialAllocationDetailResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getJobWiseMaterialAllocationDetailsForKnitJob'), reqObj, config);
    }

    /**
     * Service to get the requested Knit materials for the Material request id
     * Usually calls from WMS, Once the request is raised from the KMS
     * @param reqObjgetRequestedKnitMaterialForReqId
     * @param config 
     * @returns 
    */
    async getRequestedKnitMaterialForReqId(reqObj: KMS_C_JobMainMaterialReqIdRequest, config?: AxiosRequestConfig): Promise<KMS_R_KnitJobRequestedItemsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getRequestedKnitMaterialForReqId'), reqObj, config);
    }
    
    /**
     * Service to update issued quantity for knit materials from after getting the info from WMS against to each item code and job
     * make an API to WMS and get the items issued under a issuance id getIssuedItemsUnderAIssuanceId
     * fill the items from top to bottom based on the item code and the extRefId
     * after doing all the activity make an API call to WMS to update the handled status in the WMS
     * @param req 
     * @returns 
     */
    async updateIssuedKnitMaterialFromWms(req: WMS_C_IssuanceIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('updateIssuedKnitMaterialFromWms'), req, config);
    }

}
