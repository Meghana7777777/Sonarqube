import { GlobalResponseObject, KC_KnitGroupPoSerialRequest, KC_KnitGroupQtySummaryResp, KC_KnitGroupRatioResponse, KC_KnitRatioCreationRequest, KC_KnitRatioPoSerialRequest, ProcessingSerialProdCodeRequest, MOC_MoProductFabConsResponse, KC_KnitJobGenStatusEnum, KC_KnitJobConfStatusEnum } from "@xpparel/shared-models";
import { AxiosRequestConfig } from "axios";
import { KMSCommonAxiosService } from "../kms-common-axios-service";

export class KnittingManagementService extends KMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/knitting-configuration/' + childUrl;
    }


    /**
     * Service to get Knit group qty 
     * Usually calls from UI to show the knit group quantity summary
     * @param reqObj 
     * @param config 
     * @returns 
    */
    async getKnitGroupQtySummaryForPo(reqObj: ProcessingSerialProdCodeRequest, config?: AxiosRequestConfig): Promise<KC_KnitGroupQtySummaryResp> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getKnitGroupQtySummaryForPo'), reqObj, config);
    }


    /**
     * Service to get Knit group qty fir given knit Group
     * Usually calls from UI to show the knit group quantity summary
     * @param reqObj 
     * @param config 
     * @returns 
    */
    async getKnitGroupQtySummaryForPoAndKnitGroup(reqObj: KC_KnitGroupPoSerialRequest, config?: AxiosRequestConfig): Promise<KC_KnitGroupQtySummaryResp> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getKnitGroupQtySummaryForPoAndKnitGroup'), reqObj, config);
        
    }

    /**
     * Service to get knit group ratio Info For PO 
     * Calls from UI to display Ratio Wise information for PO
     * @param reqObj 
     * @param config 
     * @returns 
    */
    async getKnitGroupRatioInfoForPo(reqObj: ProcessingSerialProdCodeRequest, config?: AxiosRequestConfig): Promise<KC_KnitGroupRatioResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getKnitGroupRatioInfoForPo'), reqObj, config);
       
    }


    /**
     * Service to get component level Item consumption for given knit group
     * @param reqObj 
     * @param config 
     * @returns 
    */
    async getComponentLevelItemConsumptionForKnitGroup(reqObj: KC_KnitGroupPoSerialRequest, config?: AxiosRequestConfig): Promise<MOC_MoProductFabConsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getComponentLevelItemConsumptionForKnitGroup'), reqObj, config);
       
    }


    /**
     * Service to create Knit group ratio against to given details 
     * Calls from UI after creating knitting ratio
     * @param reqObj 
     * @param config 
     * @returns 
    */
    async createKnitGroupRatio(reqObj: KC_KnitRatioCreationRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createKnitGroupRatio'), reqObj, config);
    }

    /**
    * Service to create Knitting Jobs for knitting group ratio
    * 
    * @param reqObj 
    * @param config 
    * @returns 
   */
    async deleteKnitGroupRatio(reqObj: KC_KnitRatioPoSerialRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteKnitGroupRatio'), reqObj, config);
    }

}