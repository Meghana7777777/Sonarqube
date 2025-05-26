import { Body, Controller, Post } from '@nestjs/common';
import { KnittingConfigurationService } from './knitting-configuration.service';
import { GlobalResponseObject, KC_KnitGroupPoSerialRequest, KC_KnitGroupQtySummaryResp, KC_KnitGroupRatioResponse, KC_KnitRatioCreationRequest, KC_KnitRatioPoSerialRequest, ProcessingSerialProdCodeRequest, MOC_MoProductFabConsResponse } from '@xpparel/shared-models';
import { returnException } from '@xpparel/backend-utils';

@Controller('knitting-configuration')
export class KnittingConfigurationController {
    constructor(
        private service: KnittingConfigurationService
    ) { }

    /**
     * Service to get Knit group qty 
     * Usually calls from UI to show the knit group quantity summary
     * @param reqObj 
     * @param config 
     * @returns 
    */

    @Post('/createKnitGroupRatio')
    async createKnitGroupRatio(@Body() reqObj: KC_KnitRatioCreationRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.createKnitGroupRatio(reqObj);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }


    /**
    * Service to get Knit group qty 
    * Usually calls from UI to show the knit group quantity summary
    * @param reqObj 
    * @param config 
    * @returns 
   */
    @Post('/getKnitGroupQtySummaryForPo')
    async getKnitGroupQtySummaryForPo(@Body() reqObj: ProcessingSerialProdCodeRequest): Promise<KC_KnitGroupQtySummaryResp> {
        try {
            return await this.service.getKnitGroupQtySummaryForPo(reqObj);
        } catch (error) {
            return returnException(KC_KnitGroupQtySummaryResp, error);
        }
    }


    /**
     * Service to get Knit group qty fir given knit Group
     * Usually calls from UI to show the knit group quantity summary
     * @param reqObj 
     * @param config 
     * @returns 
    */
    @Post('/getKnitGroupQtySummaryForPoAndKnitGroup')
    async getKnitGroupQtySummaryForPoAndKnitGroup(@Body() reqObj: KC_KnitGroupPoSerialRequest): Promise<KC_KnitGroupQtySummaryResp> {
        try {
            return await this.service.getKnitGroupQtySummaryForPoAndKnitGroup(reqObj);
        } catch (error) {
            return returnException(KC_KnitGroupQtySummaryResp, error);
        }
    }

    /**
     * Service to get knit group ratio Info For PO 
     * Calls from UI to display Ratio Wise information for PO
     * @param reqObj 
     * @param config 
     * @returns 
    */
    @Post('/getKnitGroupRatioInfoForPo')
    async getKnitGroupRatioInfoForPo(@Body() reqObj: ProcessingSerialProdCodeRequest): Promise<KC_KnitGroupRatioResponse> {
        try {
            return await this.service.getKnitGroupRatioInfoForPo(reqObj);
        } catch (error) {
            return returnException(KC_KnitGroupRatioResponse, error);
        }
    }


    /**
     * Service to get component level Item consumption for given knit group
     * @param reqObj 
     * @param config 
     * @returns 
    */
    @Post('/getComponentLevelItemConsumptionForKnitGroup')
    async getComponentLevelItemConsumptionForKnitGroup(@Body() reqObj: KC_KnitGroupPoSerialRequest): Promise<MOC_MoProductFabConsResponse> {
        try {
            return await this.service.getComponentLevelItemConsumptionForKnitGroup(reqObj);
        } catch (error) {
            return returnException(MOC_MoProductFabConsResponse, error);
        }
    }

    /**
    * Service to create Knitting Jobs for knitting group ratio
    * 
    * @param reqObj 
    * @param config 
    * @returns 
   */
    @Post('/deleteKnitGroupRatio')
    async deleteKnitGroupRatio(@Body() reqObj: KC_KnitRatioPoSerialRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.deleteKnitGroupRatio(reqObj);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }
}
