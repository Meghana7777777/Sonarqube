import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CPS_C_BundlingConfirmationIdRequest, CPS_C_BundlingConfirmationRequest, CPS_ELGBUN_C_MainDocketRequest, CPS_R_ActualDocketsForBundlingResponse, CPS_R_BundlingConfirmationResponse, CPS_R_CutBundlingProductColorBundlingSummaryResponse, CPS_R_CutBundlingSummaryRequest, CPS_R_CutOrderConfirmedBundlesResponse, CPS_R_CutOrderEligibleBundlesResponse, CutDispatchIdStatusRequest, GlobalResponseObject, PoSerialRequest } from '@xpparel/shared-models';
import { returnException } from '@xpparel/backend-utils';
import { BundlingService } from './bundling.service';
import { BundlingInfoService } from './bundling-info.service';
import { PslBundleService } from '../psl/psl-bundle.service';
 

@ApiTags('Bundling')
@Controller('cut-bundling')
export class BundlingController {
    constructor(
        private service: BundlingService,
        private infoService: BundlingInfoService,
    ) {

    }

    @ApiBody({type: CPS_R_CutBundlingSummaryRequest})
    @Post('/getBundlingSummaryForPoProdCodeAndColor')
    async getBundlingSummaryForPoProdCodeAndColor(@Body() req: any): Promise<CPS_R_CutBundlingProductColorBundlingSummaryResponse> {
        try {
            return await this.infoService.getBundlingSummaryForPoProdCodeAndColor(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }

    @ApiBody({type: CPS_R_CutBundlingSummaryRequest})
    @Post('/getActualDocketsFoBundlingForPoProdCodeAndColor')
    async getActualDocketsFoBundlingForPoProdCodeAndColor(@Body() req: any): Promise<CPS_R_ActualDocketsForBundlingResponse> {
        try {
            return await this.infoService.getActualDocketsFoBundlingForPoProdCodeAndColor(req);
        } catch (error) {
            console.log(error);
            return returnException(CPS_R_ActualDocketsForBundlingResponse, error);
        }
    }

    @ApiBody({type: CPS_C_BundlingConfirmationRequest})
    @Post('/confirmBundlingForActualDocket')
    async confirmBundlingForActualDocket(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.confirmBundlingForActualDocket(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }


    @ApiBody({type: CPS_C_BundlingConfirmationIdRequest})
    @Post('/getConfirmedBundlesForConfirmationId')
    async getConfirmedBundlesForConfirmationId(@Body() req: any): Promise<CPS_R_CutOrderConfirmedBundlesResponse> {
        try {
            return await this.infoService.getConfirmedBundlesForConfirmationId(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }

    @ApiBody({type: CPS_ELGBUN_C_MainDocketRequest})
    @Post('/getEligibleBundlesAgainstDocketForBundling')
    async getEligibleBundlesAgainstDocketForBundling(@Body() req: any): Promise<CPS_R_CutOrderEligibleBundlesResponse> {
        try {
            return await this.service.getEligibleBundlesAgainstDocketForBundling(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }

    @ApiBody({type: CPS_R_CutBundlingSummaryRequest})
    @Post('/getBundlingConfirmationsForPoProdColor')
    async getBundlingConfirmationsForPoProdColor(@Body() req: any): Promise<CPS_R_BundlingConfirmationResponse> {
        try {
           return await this.infoService.getBundlingConfirmationsForPoProdColor(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }

    @ApiBody({type: CPS_C_BundlingConfirmationIdRequest})
    @Post('/deleteBundling')
    async deleteBundling(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.deleteBundling(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }

    @ApiBody({type: CPS_C_BundlingConfirmationIdRequest})
    @Post('/updateExtSystemAckForBundlingConfirmation')
    async updateExtSystemAckForBundlingConfirmation(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.updateExtSystemAckForBundlingConfirmation(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    } 

    @ApiBody({type: CPS_C_BundlingConfirmationIdRequest})
    @Post('/updatePtsSystemAckForBundlingConfirmation')
    async updatePtsSystemAckForBundlingConfirmation(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.updatePtsSystemAckForBundlingConfirmation(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    } 
}