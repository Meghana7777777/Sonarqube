import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { returnException } from '@xpparel/backend-utils';
import { GlobalResponseObject, INV_C_InvOutAllocIdRequest, IpsBarcodeDetailsForQualityResultsResponse, JobNumberRequest, MoOperationReportedQtyInfoResponse, MoOpSequenceInfoResponse, MoProductColorReq, MoPslIdProcessTypeReq, OslRefIdRequest, P_LocationCodeRequest, PTS_C_BundleReportingRequest, PTS_C_OperatorIdRequest, PTS_C_ProcTypeBundleBarcodeRequest, PTS_C_QmsBarcodeNumberRequest, PTS_C_TranLogIdPublishAckRequest, PTS_C_TranLogIdRequest, PTS_R_BundleScanResponse, PTS_R_ProcTypeBundleCompletedQtyResponse, PTS_R_QmsBarcodeInfoResponse, PTS_R_TranLogIdInfoResponse, SewSerialRequest, SewVersionRequest } from '@xpparel/shared-models';
import { OpReportingService } from './op-reporting.service';
import { OpReportingInfoService } from './op-reporting-info.service';
import { OpReportingPublishService } from './op-reporting-publish.service';
import { PTS_C_QmsInspectionLogRequest } from '@xpparel/shared-services';


@ApiTags('Op Reporting')
@Controller('op-reporting')
export class OpReportingController {
    constructor(
        private readonly opRepService: OpReportingService,
        private opReportingInfoService: OpReportingInfoService,
        private opRepPublishService: OpReportingPublishService
    ) {

    }

    @ApiBody({ type: PTS_C_BundleReportingRequest })
    @Post('/reportBundleForAnOp')
    async reportBundleForAnOp(@Body() req: PTS_C_BundleReportingRequest): Promise<PTS_R_BundleScanResponse> {
        try {
            return await this.opRepService.reportBundleForAnOp(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }


    @ApiBody({ type: PTS_C_TranLogIdPublishAckRequest })
    @Post('/updateExtSystemAckStatusForTranLogId')
    async updateExtSystemAckStatusForTranLogId(@Body() req: PTS_C_TranLogIdPublishAckRequest): Promise<GlobalResponseObject> {
        try {
            return await this.opRepPublishService.updateExtSystemAckStatusForTranLogId(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }


    @ApiBody({ type: PTS_C_TranLogIdRequest })
    @Post('/getReportedInfoForTranIds')
    async getReportedInfoForTranIds(@Body() req: PTS_C_TranLogIdRequest): Promise<PTS_R_TranLogIdInfoResponse> {
        try {
            return await this.opReportingInfoService.getReportedInfoForTranIds(req);
        } catch (error) {
            return returnException(PTS_R_TranLogIdInfoResponse, error);
        }
    }

    
    @ApiBody({ type: PTS_C_QmsBarcodeNumberRequest })
    @Post('/getBundleTrackingInfoForBundleBarcode')
    async getBundleTrackingInfoForBundleBarcode(@Body() req: PTS_C_QmsBarcodeNumberRequest): Promise<PTS_R_QmsBarcodeInfoResponse> {
        try {
            return await this.opReportingInfoService.getBundleTrackingInfoForBundleBarcode(req);
        } catch (error) {
            return returnException(PTS_R_QmsBarcodeInfoResponse, error);
        }
    }

    @ApiBody({ type: PTS_C_OperatorIdRequest })
    @Post('/getOperatorLastBundleInfo')
    async getOperatorLastBundleInfo(@Body() req: PTS_C_OperatorIdRequest): Promise<PTS_R_BundleScanResponse> {
        try {
            return await this.opReportingInfoService.getOperatorLastBundleInfo(req);
        } catch (error) {
            return returnException(PTS_R_BundleScanResponse, error);
        }
    }

    @ApiBody({ type: PTS_C_QmsInspectionLogRequest })
    @Post('/logQualityReporting')
    async logQualityReporting(@Body() req: PTS_C_QmsInspectionLogRequest): Promise<GlobalResponseObject> {
        try {
            return await this.opRepService.logQualityReporting(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @ApiBody({ type: P_LocationCodeRequest })
    @Post('/getQualityInfoForGivenLocationCode')
    async getQualityInfoForGivenLocationCode(@Body() req: P_LocationCodeRequest): Promise<IpsBarcodeDetailsForQualityResultsResponse> {
        try {
            return await this.opRepService.getQualityInfoForGivenLocationCode(req);
        } catch (error) {
            return returnException(IpsBarcodeDetailsForQualityResultsResponse, error);
        }
    }

    @ApiBody({ type: MoProductColorReq })
    @Post('/getOpSequenceForGiveMoPRoductFgColor')
    async getOpSequenceForGiveMoPRoductFgColor(@Body() req: MoProductColorReq): Promise<MoOpSequenceInfoResponse> {
        try {
            return await this.opReportingInfoService.getOpSequenceForGiveMoPRoductFgColor(req);
        } catch (error) {
            return returnException(MoOpSequenceInfoResponse, error);
        }
    }

    @ApiBody({ type: MoPslIdProcessTypeReq })
    @Post('/getQtyInfoForGivenPslIdAndProcType')
    async getQtyInfoForGivenPslIdAndProcType(@Body() req: MoPslIdProcessTypeReq): Promise<MoOperationReportedQtyInfoResponse> {
        try {
            return await this.opReportingInfoService.getQtyInfoForGivenPslIdAndProcType(req);
        } catch (error) {
            return returnException(MoOperationReportedQtyInfoResponse, error);
        }
    }
    
    @ApiBody({ type: PTS_C_ProcTypeBundleBarcodeRequest })
    @Post('/getProcessTypeCompletedQtyForGivenPoProdColBundles')
    async getProcessTypeCompletedQtyForGivenPoProdColBundles(@Body() req: PTS_C_ProcTypeBundleBarcodeRequest): Promise<PTS_R_ProcTypeBundleCompletedQtyResponse> {
        try {
            return await this.opReportingInfoService.getProcessTypeCompletedQtyForGivenPoProdColBundles(req);
        } catch (error) {
            return returnException(PTS_R_ProcTypeBundleCompletedQtyResponse, error);
        }
    }
}