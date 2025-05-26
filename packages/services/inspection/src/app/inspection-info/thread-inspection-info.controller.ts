import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { returnException } from "@xpparel/backend-utils";
import { InsConeBarcodeInspCategoryReq, InsIrIdRequest, InsSpoolBarcodeInspCategoryReq, ThreadInsInspectionRequestsFilterRequest, ThreadInsIrRollsResponse, ThreadInspectionBasicInfoResponse, ThreadInspectionHeaderRollInfoResp, ThreadInspectionTypeRequest } from "@xpparel/shared-models";
import { ThreadInspectionInfoService } from "./thread-inspection-info.service";

@ApiTags('Thread Inspection Info')
@Controller('thread-inspection-info')
export class ThreadInspectionInfoController {
    constructor(
        private fgInspectionInfoService: ThreadInspectionInfoService,
    ) {

    }


    @Post('/getThreadInspectionMaterialPendingData')
    async getThreadInspectionMaterialPendingData(@Body() reqModel: ThreadInspectionTypeRequest): Promise<ThreadInspectionBasicInfoResponse> {
        try {
            return await this.fgInspectionInfoService.getThreadInspectionMaterialPendingData(reqModel);
        } catch (err) {
            return returnException(ThreadInspectionBasicInfoResponse, err);
        }
    }

    @ApiBody({ type: InsIrIdRequest })
    @Post('/getInspectionRequestSpollsInfo')
    async getInspectionRequestSpollsInfo(@Body() req: InsIrIdRequest): Promise<ThreadInsIrRollsResponse> {
        try {
            return await this.fgInspectionInfoService.getInspectionRequestSpollsInfo(req);
        } catch (error) {
            return returnException(ThreadInsIrRollsResponse, error);
        }
    }


    @Post('/getThreadInspectionDetailsForRequestId')
    async getThreadInspectionDetailsForRequestId(@Body() reqObj: InsIrIdRequest): Promise<ThreadInspectionHeaderRollInfoResp> {
        try {
            return await this.fgInspectionInfoService.getThreadInspectionDetailsForRequestId(reqObj.irId, reqObj.unitCode, reqObj.companyCode, 0, 0, reqObj.isReport);
        } catch (error) {
            return returnException(ThreadInspectionHeaderRollInfoResp, error);
        }
    }

    @Post('/getInspectionDetailForSpoolIdAndInspCategory')
    async getInspectionDetailForSpoolIdAndInspCategory(@Body() reqObj: InsSpoolBarcodeInspCategoryReq): Promise<ThreadInspectionHeaderRollInfoResp> {
        try {
            return await this.fgInspectionInfoService.getInspectionDetailForSpoolIdAndInspCategory(reqObj.barcode, reqObj.inspectionCategory, reqObj.unitCode, reqObj.companyCode);
        } catch (error) {
            return returnException(ThreadInspectionHeaderRollInfoResp, error);
        }
    }

    @ApiBody({ type: ThreadInsInspectionRequestsFilterRequest })
    @Post('/getThreadInspectionRequestBasicInfoByLotCode')
    async getThreadInspectionRequestBasicInfoByLotCode(@Body() req: ThreadInsInspectionRequestsFilterRequest): Promise<ThreadInspectionBasicInfoResponse> {
        try {
            return await this.fgInspectionInfoService.getThreadInspectionRequestBasicInfoByLotCode(req);
        } catch (error) {
            return returnException(ThreadInspectionBasicInfoResponse, error);
        }
    }

}