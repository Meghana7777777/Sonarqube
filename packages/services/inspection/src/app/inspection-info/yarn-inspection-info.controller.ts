import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { handleResponse, returnException } from "@xpparel/backend-utils";
import { CommonResponse, InsGetInspectionHeaderRollInfoResp, YarnInspectionBasicInfoResponse, InsInspectionTypeRequest, InsIrIdRequest, InsPackListAndPoIdsReqDto, PKMSInsReqIdDto, ThreadInspectionTypeRequest, YarnInspectionTypeRequest, InsIrRollsResponse, YarnInsIrRollsResponse, YarnInspectionHeaderRollInfoResp, InsRollBarcodeInspCategoryReq, InsConeBarcodeInspCategoryReq, YarnInsInspectionRequestsFilterRequest } from "@xpparel/shared-models";
import { YarnInspectionInfoService } from "./yarn-inspection-info.service";

@ApiTags('Yarn Inspection Info')
@Controller('yarn-inspection-info')
export class YarnInspectionInfoController {
    constructor(
        private yarnInspectionInfoService: YarnInspectionInfoService,
    ) {

    }


    @Post('/getInspectionMaterialPendingData')
    async getInspectionMaterialPendingData(@Body() reqModel: YarnInspectionTypeRequest): Promise<YarnInspectionBasicInfoResponse> {
        try {
            return await this.yarnInspectionInfoService.getInspectionMaterialPendingData(reqModel);
        } catch (err) {
            return returnException(YarnInspectionBasicInfoResponse, err);
        }
    }

    @ApiBody({ type: InsIrIdRequest })
    @Post('/getInspectionRequestSpollsInfo')
    async getInspectionRequestSpollsInfo(@Body() req: InsIrIdRequest): Promise<YarnInsIrRollsResponse> {
        try {
            return await this.yarnInspectionInfoService.getInspectionRequestSpollsInfo(req);
        } catch (error) {
            return returnException(YarnInsIrRollsResponse, error);
        }
    }


    @Post('/getYarnInspectionDetailsForRequestId')
    async getYarnInspectionDetailsForRequestId(@Body() reqObj: InsIrIdRequest): Promise<YarnInspectionHeaderRollInfoResp> {
        try {
            return await this.yarnInspectionInfoService.getYarnInspectionDetailsForRequestId(reqObj.irId, reqObj.unitCode, reqObj.companyCode, 0, 0, reqObj.isReport);
        } catch (error) {
            return returnException(YarnInspectionHeaderRollInfoResp, error);
        }
    }

    @Post('/getInspectionDetailForConeIdAndInspCategory')
    async getInspectionDetailForConeIdAndInspCategory(@Body() reqObj: InsConeBarcodeInspCategoryReq): Promise<YarnInspectionHeaderRollInfoResp> {
        try {
            return await this.yarnInspectionInfoService.getInspectionDetailForConeIdAndInspCategory(reqObj.barcode, reqObj.inspectionCategory, reqObj.unitCode, reqObj.companyCode);
        } catch (error) {
            return returnException(YarnInspectionHeaderRollInfoResp, error);
        }
    }

    @ApiBody({ type: YarnInsInspectionRequestsFilterRequest })
    @Post('/getYarnInspectionRequestBasicInfoByLotCode')
    async getYarnInspectionRequestBasicInfoByLotCode(@Body() req: YarnInsInspectionRequestsFilterRequest): Promise<YarnInspectionBasicInfoResponse> {
        try {
            return await this.yarnInspectionInfoService.getYarnInspectionRequestBasicInfoByLotCode(req);
        } catch (error) {
            return returnException(YarnInspectionBasicInfoResponse, error);
        }
    }
}