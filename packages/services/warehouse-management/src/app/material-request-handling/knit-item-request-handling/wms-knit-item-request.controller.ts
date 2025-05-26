import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { GlobalResponseObject, KMS_C_JobMainMaterialReqIdRequest, WhFabReqStatusRequest, WMS_C_IssuanceIdRequest, WMS_C_KnitMaterialIssuanceRequest, WMS_C_WhKnitMaterialRequestIdRequest, WMS_C_WhTrimRequestIdRequest, WMS_MAINMAT_R_JobRequestedMainMatResponse, WMS_R_IssuanceIdItemsResponse, WMS_TRIM_R_JobRequestedTrimResponse } from "@xpparel/shared-models";
import { WmsKnitItemRequestService } from "./wms-knit-item-request.service";
import { returnException } from "@xpparel/backend-utils";

@ApiTags('Main Material Request Handling')
@Controller('wms-knit-request')
export class WmsKnitItemRequestController {
     constructor(private readonly service: WmsKnitItemRequestService) {}

    @ApiBody({ type: KMS_C_JobMainMaterialReqIdRequest })
    @Post('/allocateKnitMaterialByRequestId')
    async allocateKnitMaterialByRequestId(@Body() req: KMS_C_JobMainMaterialReqIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.allocateKnitMaterialByRequestId(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }

    @ApiBody({ type: WMS_C_WhKnitMaterialRequestIdRequest })
    @Post('/getAllocatedKnitMaterialForWhRequestId')
    async getAllocatedKnitMaterialForWhRequestId(@Body() req: WMS_C_WhKnitMaterialRequestIdRequest): Promise<WMS_MAINMAT_R_JobRequestedMainMatResponse> {
        try {
            return await this.service.getAllocatedKnitMaterialForWhRequestId(req);
        } catch (error) {
            return returnException(WMS_MAINMAT_R_JobRequestedMainMatResponse, error)
        }
    }

    @ApiBody({ type: KMS_C_JobMainMaterialReqIdRequest })
    @Post('/getAllocatedKnitMaterialForExtRefId')
    async getAllocatedKnitMaterialForExtRefId(@Body() req: KMS_C_JobMainMaterialReqIdRequest): Promise<WMS_MAINMAT_R_JobRequestedMainMatResponse> {
        try {
            return await this.service.getAllocatedKnitMaterialForExtRefId(req);
        } catch (error) {
            return returnException(WMS_MAINMAT_R_JobRequestedMainMatResponse, error)
        }
    }

    @ApiBody({ type: WMS_C_KnitMaterialIssuanceRequest })
    @Post('/issueKnitMaterialForWhReqId')
    async issueKnitMaterialForWhReqId(@Body() req: WMS_C_KnitMaterialIssuanceRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.issueKnitMaterialForWhReqId(req);
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

    @ApiBody({ type: WMS_C_IssuanceIdRequest })
    @Post('/updateIssuedItemsHandlingStatusForIssuanceId')
    async updateIssuedItemsHandlingStatusForIssuanceId(@Body() req: WMS_C_IssuanceIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.updateIssuedItemsHandlingStatusForIssuanceId(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }

    @ApiBody({ type: WhFabReqStatusRequest })
    @Post('/changeWhYarnReqStatus')
    async changeWhYarnReqStatus(@Body() req: WhFabReqStatusRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.changeWhYarnReqStatus(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }
}