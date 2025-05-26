import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { InsFabInsConfigRequest, InsFabInsConfigResponse, InsSupplierCodeRequest, PackListIdRequest } from "@xpparel/shared-models";
import { returnException } from "@xpparel/backend-utils";
import { WMSInspectionConfigService } from "./inspection-config.service";


@ApiTags('Inspection Config')
@Controller('inspection-config')
export class InspectionConfigController {
    constructor(private readonly inspectionConfigService: WMSInspectionConfigService) {}


    @Post('saveFabInsConfigPLLevel')
    async saveFabInsConfigPLLevel(@Body() req: InsFabInsConfigRequest): Promise<InsFabInsConfigResponse> {
        try {
            return await this.inspectionConfigService.saveFabInsConfigPLLevel(req);
        } catch (error) {
            return returnException(InsFabInsConfigResponse, error);
        }
    }


    @Post('getFabInsConfigPLLevel')
    async getFabInsConfigPLLevel(@Body() req: InsSupplierCodeRequest): Promise<InsFabInsConfigResponse> {
        try {
            return await this.inspectionConfigService.getFabInsConfigPLLevel(req);
        } catch (error) {
            return returnException(InsFabInsConfigResponse, error);
        }
    }

    @Post('isAllInsConfigurationsSaved')
    async isAllInsConfigurationsSaved(@Body() req: PackListIdRequest): Promise<InsFabInsConfigResponse> {
        try {
            return await this.inspectionConfigService.isAllInsConfigurationsSaved(req);
        } catch (error) {
            return returnException(InsFabInsConfigResponse, error);
        }
    }

}
