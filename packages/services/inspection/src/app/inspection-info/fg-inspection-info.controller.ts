import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { returnException } from "@xpparel/backend-utils";
import { CommonResponse, InsGetInspectionHeaderRollInfoResp, InsIrIdRequest, InsPackListAndPoIdsReqDto, PKMSInsReqIdDto } from "@xpparel/shared-models";
import { FgInspectionInfoService } from "./fg-inspection-info.service";

@ApiTags('Fg Inspection Info')
@Controller('fg-inspection-info')
export class FgInspectionInfoController {
    constructor(
        private fgInspectionInfoService: FgInspectionInfoService,
    ) {

    }

    @Post('/getFgInspectionDetailsForRequestId')
    async getFgInspectionDetailsForRequestId(@Body() reqObj: InsIrIdRequest): Promise<InsGetInspectionHeaderRollInfoResp> {
        try {
            return await this.fgInspectionInfoService.getFgInspectionDetailsForRequestId(reqObj.username, reqObj.irId, reqObj.unitCode, reqObj.companyCode);
        } catch (error) {
            return returnException(InsGetInspectionHeaderRollInfoResp, error);
        }
    }

    @Post('/getInspectionMaterialPendingData')
    async getInspectionMaterialPendingData(@Body() reqModel: InsPackListAndPoIdsReqDto): Promise<CommonResponse> {
        try {
            return await this.fgInspectionInfoService.getInspectionMaterialPendingData(reqModel);
        } catch (err) {
            return returnException(CommonResponse, err);
        }
    }

    @Post('/getPKMSInsCartonsData')
    async getPKMSInsCartonsData(@Body() reqModel: PKMSInsReqIdDto): Promise<CommonResponse> {
        try {
            return await this.fgInspectionInfoService.getPKMSInsCartonsData(reqModel);
        } catch (err) {
            return returnException(CommonResponse, err);
        }
    }

    @Post('/getInsCartonsSummary')
    async getInsCartonsSummary(@Body() reqModel: PKMSInsReqIdDto): Promise<CommonResponse> {
        try {
            return await this.fgInspectionInfoService.getInsCartonsSummary(reqModel);
        } catch (err) {
            return returnException(CommonResponse, err);
        }
    }
}