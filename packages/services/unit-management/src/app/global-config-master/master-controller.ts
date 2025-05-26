import { Body, Controller, Post } from "@nestjs/common";
import { handleResponse } from "@xpparel/backend-utils";
import { AttributesIdModelDto, AttributesMasterCreateReq, AttributesMasterResponse, CommonRequestAttrs, CommonResponse, ConfigGcIdModelDto, ConfigMasterCreateReq, ConfigMasterModelIdDto, ConfigMasterResponse, GetAttributesByGcIdResponseDto, MasterCreateRequest, MasterModelDto, MasterResponse, MasterToggleDto } from "@xpparel/shared-models";
import { MasterService } from "./master-service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('master')
@Controller('master')
export class MasterController {
    constructor(
        private service: MasterService
    ) {

    }

    @Post('saveGlobalConfigMasters')
    async saveGlobalConfigMasters(@Body() req: MasterModelDto): Promise<MasterResponse> {
        return handleResponse(
            async () => this.service.saveGlobalConfigMasters(req),
            CommonResponse
        )
    }

    @Post('saveConfigMasters')
    async saveConfigMasters(@Body() req: any): Promise<ConfigMasterResponse> {
        return handleResponse(
            async () => this.service.saveConfigMasters(req),
            CommonResponse
        )
    }
    @Post('getDropDownParentId')
    async getDropDownParentId(@Body() req: any): Promise<CommonResponse> {
        return handleResponse(
            async () => this.service.getDropDownParentId(req),
            CommonResponse
        )
    }

    @Post('getGlobalConfigMasters')
    async getGlobalConfigMasters(@Body() req: ConfigMasterModelIdDto): Promise<CommonResponse> {
        return handleResponse(
            async () => this.service.getGlobalConfigMasters(req),
            CommonResponse
        )
    }

    @Post('getConfigMasters')
    async getConfigMasters(@Body() req: ConfigGcIdModelDto): Promise<CommonResponse> {
        return handleResponse(
            async () => this.service.getConfigMasters(req),
            CommonResponse
        )
    }
    @Post('getParentIdDropDownAgainstGcID')
    async getParentIdDropDownAgainstGcID(@Body() req: ConfigGcIdModelDto): Promise<CommonResponse> {
        return handleResponse(
            async () => this.service.getParentIdDropDownAgainstGcID(req),
            CommonResponse
        )
    }


    @Post('toggleGlobalConfigMasters')
    async toggleGlobalConfigMasters(@Body() req: MasterToggleDto): Promise<CommonResponse> {
        return handleResponse(
            async () => this.service.toggleGlobalConfigMasters(req),
            CommonResponse
        )
    }
    @Post('toggleConfigMasters')
    async toggleConfigMasters(@Body() req: MasterToggleDto): Promise<CommonResponse> {
        return handleResponse(
            async () => this.service.toggleConfigMasters(req),
            CommonResponse
        )
    }
    // attributes master
    @Post('saveAttributesMasters')
    async saveAttributesMasters(@Body() req: AttributesMasterCreateReq): Promise<AttributesMasterResponse> {
        return handleResponse(
            async () => this.service.saveAttributesMasters(req),
            CommonResponse
        )
    }
    @Post('getAttributesMasters')
    async getAttributesMasters(@Body() req: CommonRequestAttrs): Promise<AttributesMasterResponse> {
        return handleResponse(
            async () => this.service.getAttributesMasters(req),
            AttributesMasterResponse
        )
    }


    @Post('toggleAttributesMasters')
    async toggleAttributesMasters(@Body() req: MasterToggleDto): Promise<CommonResponse> {
        return handleResponse(
            async () => this.service.toggleAttributesMasters(req),
            CommonResponse
        )
    }

    @Post('getAttributesByGcId')
    async getAttributesByGcId(@Body() req: ConfigGcIdModelDto): Promise<GetAttributesByGcIdResponseDto> {
        return handleResponse(
            async () => this.service.getAttributesByGcId(req),
            GetAttributesByGcIdResponseDto
        )
    }


}