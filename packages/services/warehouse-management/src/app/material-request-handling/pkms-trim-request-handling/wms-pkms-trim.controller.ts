import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { GlobalResponseObject, PKMS_C_JobTrimReqIdRequest, SPS_C_JobTrimReqIdRequest, WhFabReqStatusRequest, WMS_C_IssuanceIdRequest, WMS_C_KnitMaterialIssuanceRequest, WMS_C_PTrimIssuanceRequest, WMS_C_STrimIssuanceRequest, WMS_C_WhTrimRequestIdRequest, WMS_R_IssuanceIdItemsResponse, WMS_TRIM_R_JobRequestedTrimResponse } from "@xpparel/shared-models";
import { WmsPKMSTrimRequestService } from "./wms-pkms-trim.service";
import { returnException } from "@xpparel/backend-utils";

@ApiTags('WMS Pack Trim Request Handling')
@Controller('wms-pack-trim-request-handling')
export class WmsPKMSTrimRequestController {
    constructor(private service: WmsPKMSTrimRequestService) { }

    @ApiBody({ type: PKMS_C_JobTrimReqIdRequest })
    @Post('/allocatePackTrimsByRequestId')
    async allocatePackTrimsByRequestId(@Body() req: PKMS_C_JobTrimReqIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.allocatePackTrimsByRequestId(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }

    @ApiBody({ type: WMS_C_PTrimIssuanceRequest })
    @Post('/issuePTrimForWhReqId')
    async issuePTrimForWhReqId(@Body() req: WMS_C_PTrimIssuanceRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.issuePTrimForWhReqId(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }

    @ApiBody({ type: WMS_C_WhTrimRequestIdRequest })
    @Post('/getAllocatedMaterialForWhTrimsRequestId')
    async getAllocatedMaterialForWhTrimsRequestId(@Body() req: WMS_C_WhTrimRequestIdRequest): Promise<WMS_TRIM_R_JobRequestedTrimResponse> {
        try {
            return await this.service.getAllocatedMaterialForWhTrimsRequestId(req);
        } catch (error) {
            return returnException(WMS_TRIM_R_JobRequestedTrimResponse, error)
        }
    }

    @ApiBody({ type: SPS_C_JobTrimReqIdRequest })
    @Post('/getAllocatedMaterialForExtRefId')
    async getAllocatedMaterialForExtRefId(@Body() req: SPS_C_JobTrimReqIdRequest): Promise<WMS_TRIM_R_JobRequestedTrimResponse> {
        try {
            return await this.service.getAllocatedMaterialForExtRefId(req);
        } catch (error) {
            return returnException(WMS_TRIM_R_JobRequestedTrimResponse, error)
        }
    }

    @ApiBody({ type: WhFabReqStatusRequest })
    @Post('/changeWhPTrimReqStatus')
    async changeWhPTrimReqStatus(@Body() req: WhFabReqStatusRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.changeWhPTrimReqStatus(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }

    @ApiBody({ type: WMS_C_KnitMaterialIssuanceRequest })
    @Post('/getIssuedItemsUnderIssuanceId')
    async getIssuedItemsUnderIssuanceId(@Body() req: WMS_C_IssuanceIdRequest): Promise<WMS_R_IssuanceIdItemsResponse> {
        try {
            return await this.service.getIssuedItemsUnderIssuanceId(req);
        } catch (error) {
            return returnException(WMS_R_IssuanceIdItemsResponse, error)
        }
    }
}