import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { GlobalResponseObject, Rm_C_OutExtRefIdToGetAllocationsRequest, Rm_R_OutAllocationInfoAndBundlesResponse, SPS_C_JobTrimReqIdRequest, WhFabReqStatusRequest, WMS_C_IssuanceIdRequest, WMS_C_STrimIssuanceRequest, WMS_C_WhTrimRequestIdRequest, WMS_R_IssuanceIdItemsResponse, WMS_TRIM_R_JobRequestedTrimResponse } from "@xpparel/shared-models";
import { WmsSpsTrimRequestService } from "./wms-sps-trim.service";
import { returnException } from "@xpparel/backend-utils";

@ApiTags('WMS Sew Trim Request Handling')
@Controller('wms-strim-request-handling')
export class WmsSpsTrimRequestController {
    constructor(private service: WmsSpsTrimRequestService) { }

    @ApiBody({ type: SPS_C_JobTrimReqIdRequest })
    @Post('/allocateSTrimsForAJobByRequestId')
    async allocateSTrimsForAJobByRequestId(@Body() req: SPS_C_JobTrimReqIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.allocateSTrimsForAJobByRequestId(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }

    @ApiBody({ type: WMS_C_STrimIssuanceRequest })
    @Post('/issueSTrimForWhReqId')
    async issueSTrimForWhReqId(@Body() req: WMS_C_STrimIssuanceRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.issueSTrimForWhReqId(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }

    @ApiBody({ type: WMS_C_WhTrimRequestIdRequest })
    @Post('/getAllocatedMaterialForWhSTrimsRequestId')
    async getAllocatedMaterialForWhSTrimsRequestId(@Body() req: WMS_C_WhTrimRequestIdRequest): Promise<WMS_TRIM_R_JobRequestedTrimResponse> {
        try {
            return await this.service.getAllocatedMaterialForWhSTrimsRequestId(req);
        } catch (error) {
            return returnException(WMS_TRIM_R_JobRequestedTrimResponse, error)
        }
    }

    @ApiBody({ type: SPS_C_JobTrimReqIdRequest })
    @Post('/getAllocatedSTrimMaterialForExtRefId')
    async getAllocatedSTrimMaterialForExtRefId(@Body() req: SPS_C_JobTrimReqIdRequest): Promise<WMS_TRIM_R_JobRequestedTrimResponse> {
        try {
            return await this.service.getAllocatedSTrimMaterialForExtRefId(req);
        } catch (error) {
            return returnException(WMS_TRIM_R_JobRequestedTrimResponse, error)
        }
    }

    @ApiBody({ type: WhFabReqStatusRequest })
    @Post('/changeWhSTrimReqStatus')
    async changeWhSTrimReqStatus(@Body() req: WhFabReqStatusRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.changeWhSTrimReqStatus(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }

    @ApiBody({ type: WMS_C_IssuanceIdRequest })
    @Post('/getIssuedItemsUnderIssuanceId')
    async getIssuedItemsUnderIssuanceId(@Body() req: WMS_C_IssuanceIdRequest): Promise<WMS_R_IssuanceIdItemsResponse> {
        try {
            return await this.service.getIssuedItemsUnderIssuanceId(req);
        } catch (error) {
            return returnException(WMS_R_IssuanceIdItemsResponse, error)
        }
    }

    @ApiBody({ type: Rm_C_OutExtRefIdToGetAllocationsRequest })
    @Post('/getRmAllocatedMaterialForRequestRefId')
    async getRmAllocatedMaterialForRequestRefId(@Body() req: Rm_C_OutExtRefIdToGetAllocationsRequest): Promise<Rm_R_OutAllocationInfoAndBundlesResponse> {
        try {
            return await this.service.getRmAllocatedMaterialForRequestRefId(req);
        } catch (error) {
            console.log(error);
            return returnException(Rm_R_OutAllocationInfoAndBundlesResponse, error);
        }
    }
}