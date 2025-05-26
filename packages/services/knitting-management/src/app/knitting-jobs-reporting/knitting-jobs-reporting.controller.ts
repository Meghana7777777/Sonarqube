import { Body, Controller, Post } from '@nestjs/common';
import { returnException } from '@xpparel/backend-utils';
import { GlobalResponseObject, KJ_C_KnitJobNumberRequest, KJ_C_KnitJobReportingRequest, KJ_R_KnitJobReportedQtyResponse, KJ_R_LocationKnitJobsSummaryRequest, KJ_R_LocationKnitJobsSummaryResponse, KMS_C_KnitOrderBundlesConfirmationRequest, KMS_C_KnitOrderBundlingConfirmationIdRequest, KMS_ELGBUN_C_KnitProcSerialRequest, KMS_R_KnitBundlingProductColorBundlingSummaryRequest, KMS_R_KnitBundlingProductColorBundlingSummaryResponse, KMS_R_KnitJobBundlingMapResponse, KMS_R_KnitOrderElgBundlesResponse } from '@xpparel/shared-models';
import { KnittingJobsReportingService } from './knitting-jobs-reporting.service';
import { KnittingOrderBundlingService } from './knitting-order-bundling.service';
import { KnittingOrderBundlingInfoService } from './knitting-order-bundling-info.service';

@Controller('knit-reporting')
export class KnittingJobsReportingController {

    constructor(
        private kjRepService: KnittingJobsReportingService,
        private kjBundlingService: KnittingOrderBundlingService,
        private kjBundleInfoService: KnittingOrderBundlingInfoService
    ) {

    }

    // Called from UI
    @Post('/reportKnitJob')
    async reportKnitJob(@Body() req: KJ_C_KnitJobReportingRequest): Promise<GlobalResponseObject> {
        try {
            return await this.kjRepService.reportKnitJob(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    // Called from UI
    // Used by the knit planning dashboard / reporting dashboard
    @Post('/getKnitJobReportedSummaryForJobNumbersUnderALocationId')
    async getKnitJobReportedSummaryForJobNumbersUnderALocationId(@Body() req: KJ_R_LocationKnitJobsSummaryRequest): Promise<KJ_R_LocationKnitJobsSummaryResponse> {
        try {
            return await this.kjRepService.getKnitJobReportedSummaryForJobNumbersUnderALocationId(req);
        } catch (error) {
            return returnException(KJ_R_LocationKnitJobsSummaryResponse, error);
        }
    }

    @Post('/getKnitJobRepQtysForKitJobNumber')
    async getKnitJobRepQtysForKitJobNumber(@Body() req: KJ_C_KnitJobNumberRequest): Promise<KJ_R_KnitJobReportedQtyResponse> {
        try {
            return await this.kjRepService.getKnitJobRepQtysForKitJobNumber(req);
        } catch (error) {
            return returnException(KJ_R_KnitJobReportedQtyResponse, error);
        }
    }

    @Post('/getEligibleBundlesForKnitOrder')
    async getEligibleBundlesForKnitOrder(@Body() req: KMS_ELGBUN_C_KnitProcSerialRequest): Promise<KMS_R_KnitOrderElgBundlesResponse> {
        try {
            return await this.kjBundlingService.getEligibleBundlesForKnitOrder(req);
        } catch (error) {
            console.log(error);
            return returnException(KMS_R_KnitOrderElgBundlesResponse, error);
        }
    }

    @Post('/confirmProductBundlesForBundling')
    async confirmProductBundlesForBundling(@Body() req: KMS_C_KnitOrderBundlesConfirmationRequest): Promise<GlobalResponseObject> {
        try {
            return await this.kjBundlingService.confirmProductBundlesForBundling(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }

    @Post('/getTheBundlesAgainstConfirmationId')
    async getTheBundlesAgainstConfirmationId(@Body() req: KMS_C_KnitOrderBundlingConfirmationIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.kjBundlingService.getTheBundlesAgainstConfirmationId(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }

    @Post('/getKnitOrderBundlingSummaryForProductCodeAndColor')
    async getKnitOrderBundlingSummaryForProductCodeAndColor(@Body() req: KMS_R_KnitBundlingProductColorBundlingSummaryRequest): Promise<KMS_R_KnitBundlingProductColorBundlingSummaryResponse> {
        try {
            return await this.kjBundleInfoService.getKnitOrderBundlingSummaryForProductCodeAndColor(req);
        } catch (error) {
            console.log(error);
            return returnException(KMS_R_KnitBundlingProductColorBundlingSummaryResponse, error);
        }
    }

    @Post('/updateExtSystemAckForBundlingConfirmation')
    async updateExtSystemAckForBundlingConfirmation(@Body() req: KMS_C_KnitOrderBundlingConfirmationIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.kjBundlingService.updateExtSystemAckForBundlingConfirmation(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    } 

    @Post('/updatePtsSystemAckForBundlingConfirmation')
    async updatePtsSystemAckForBundlingConfirmation(@Body() req: KMS_C_KnitOrderBundlingConfirmationIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.kjBundlingService.updatePtsSystemAckForBundlingConfirmation(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    } 

    @Post('/getPoBundlingDepMapForCoonfirmationIds')
    async getPoBundlingDepMapForCoonfirmationIds(@Body() req: KMS_C_KnitOrderBundlingConfirmationIdRequest): Promise<KMS_R_KnitJobBundlingMapResponse> {
        try {
            return await this.kjBundleInfoService.getPoBundlingDepMapForCoonfirmationIds(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }
}
