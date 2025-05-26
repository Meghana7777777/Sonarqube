import { Body, Controller, Post } from '@nestjs/common';
import { QualityChecksService } from './quality-checks.service';
import { DateRequest, QMS_BarcodeInfoResponse, QMS_BarcodeReq, QMS_CommonDatesReq, QMS_DefectRatesReqDto, QMS_DefectRatesResponse, QMS_LocVsQualitytypeDefectsResponse, QMS_ReportingStatsResponse, QualityCheckCreationRequest, QualityChecksInfoReq, QualityChecksInfoResponse } from '@xpparel/shared-models';
import { ApiBody } from '@nestjs/swagger';
import { GlobalResponseObject } from '@xpparel/shared-models';
import { returnException } from '@xpparel/backend-utils';

@Controller('quality-checks')
export class QualityChecksController {
    constructor(
        private readonly qualityCheckListService: QualityChecksService
    ) { }


    @Post('/createQualityCheck')
    @ApiBody({ type: QualityCheckCreationRequest })
    async createQualityCheck(@Body() createDto: any): Promise<GlobalResponseObject> {
        try {
            return await this.qualityCheckListService.createQualityCheck(createDto);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @Post('/getQualityChecksInfo')
    @ApiBody({ type: QualityChecksInfoReq })
    async getQualityChecksInfo(@Body() createDto: any): Promise<QualityChecksInfoResponse> {
        try {
            return await this.qualityCheckListService.getQualityChecksInfo(createDto);
        } catch (error) {
            return returnException(QualityChecksInfoResponse, error);
        }
    }

    @Post('/getBarCodeInfoForBarcode')
    @ApiBody({ type: QMS_BarcodeReq })
    async getBarCodeInfoForBarcode(@Body() reqObj: any): Promise<QMS_BarcodeInfoResponse> {
        try {
            return await this.qualityCheckListService.getBarCodeInfoForBarcode(reqObj);
        } catch (error) {
            console.log(error, 'err')
            return returnException(QMS_BarcodeInfoResponse, error);
        }
    }

    @Post('/getDefectRates')
    @ApiBody({ type: QMS_DefectRatesReqDto })
    async getDefectRates(@Body() reqObj: any): Promise<QMS_DefectRatesResponse> {
        try {
            return await this.qualityCheckListService.getDefectRates(reqObj);
        } catch (error) {
            return returnException(QMS_DefectRatesResponse, error);
        }
    }

    @Post('/getDashboardHeaderStats')
    @ApiBody({ type: DateRequest })
    async getDashboardHeaderStats(@Body() reqObj: any): Promise<QMS_ReportingStatsResponse> {
        try {
            return await this.qualityCheckListService.getDashboardHeaderStats(reqObj);
        } catch (error) {
            return returnException(QMS_ReportingStatsResponse, error);
        }
    }

    @Post('/getLocationAndQualityTypeWiseDefectQty')
    @ApiBody({ type: QMS_CommonDatesReq })
    async getLocationAndQualityTypeWiseDefectQty(@Body() reqObj: any): Promise<QMS_LocVsQualitytypeDefectsResponse> {
        try {
            return await this.qualityCheckListService.getLocationAndQualityTypeWiseDefectQty(reqObj);
        } catch (error) {
            return returnException(QMS_LocVsQualitytypeDefectsResponse, error);
        }
    }
}
