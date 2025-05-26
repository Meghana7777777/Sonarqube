import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { returnException } from "@xpparel/backend-utils";
import { InsBoxBarcodeInspCategoryReq, InsIrIdRequest, TrimInsInspectionRequestsFilterRequest, TrimInsIrRollsResponse, TrimInspectionBasicInfoResponse, TrimInspectionHeaderRollInfoResp, TrimInspectionTypeRequest } from "@xpparel/shared-models";
import { TrimInspectionInfoService } from "./trim-inspection-info.service";

@ApiTags('Trim Inspection Info')
@Controller('trim-inspection-info')
export class TrimInspectionInfoController {
    constructor(
        private yarnInspectionInfoService: TrimInspectionInfoService,
    ) {

    }


    @Post('/getInspectionMaterialPendingData')
    async getInspectionMaterialPendingData(@Body() reqModel: TrimInspectionTypeRequest): Promise<TrimInspectionBasicInfoResponse> {
        try {
            return await this.yarnInspectionInfoService.getInspectionMaterialPendingData(reqModel);
        } catch (err) {
            return returnException(TrimInspectionBasicInfoResponse, err);
        }
    }

    @ApiBody({ type: InsIrIdRequest })
    @Post('/getInspectionRequestSpollsInfo')
    async getInspectionRequestSpollsInfo(@Body() req: InsIrIdRequest): Promise<TrimInsIrRollsResponse> {
        try {
            return await this.yarnInspectionInfoService.getInspectionRequestSpollsInfo(req);
        } catch (error) {
            return returnException(TrimInsIrRollsResponse, error);
        }
    }


    @Post('/getTrimInspectionDetailsForRequestId')
    async getTrimInspectionDetailsForRequestId(@Body() reqObj: InsIrIdRequest): Promise<TrimInspectionHeaderRollInfoResp> {
        try {
            return await this.yarnInspectionInfoService.getTrimInspectionDetailsForRequestId(reqObj.irId, reqObj.unitCode, reqObj.companyCode, 0, 0, reqObj.isReport);
        } catch (error) {
            return returnException(TrimInspectionHeaderRollInfoResp, error);
        }
    }

    @ApiBody({ type: TrimInsInspectionRequestsFilterRequest })
    @Post('/getTrimInspectionRequestBasicInfoByLotCode')
    async getTrimInspectionRequestBasicInfoByLotCode(@Body() req: TrimInsInspectionRequestsFilterRequest): Promise<TrimInspectionBasicInfoResponse> {
        try {
            return await this.yarnInspectionInfoService.getTrimInspectionRequestBasicInfoByLotCode(req);
        } catch (error) {
            return returnException(TrimInspectionBasicInfoResponse, error);
        }
    }

    @Post('/getInspectionDetailForBoxIdAndInspCategory')
    async getInspectionDetailForBoxIdAndInspCategory(@Body() reqObj: InsBoxBarcodeInspCategoryReq): Promise<TrimInspectionHeaderRollInfoResp> {
        try {
            return await this.yarnInspectionInfoService.getInspectionDetailForBoxIdAndInspCategory(reqObj.barcode, reqObj.inspectionCategory, reqObj.unitCode, reqObj.companyCode);
        } catch (error) {
            return returnException(TrimInspectionHeaderRollInfoResp, error);
        }
    }
}