import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CommonResponse, GlobalResponseObject, InsBuyerCodeRequest, InsFabInsConfigRequest, InsFabInsConfigResponse, InsFgInsConfigRequest, InsFgInsConfigResponse, InsSupplierCodeRequest } from "@xpparel/shared-models";
import { returnException } from "@xpparel/backend-utils";
import { PKMSInspectionConfigService } from "./pkms-inspection-config.service";


@ApiTags('Inspection Config')
@Controller('inspection-config')
export class PKMSInspectionConfigController {
    constructor(private readonly inspectionConfigService: PKMSInspectionConfigService) { }


    @Post('savePKMSFgInsConfigPLLevel')
    async savePKMSFgInsConfigPLLevel(@Body() req: InsFgInsConfigRequest): Promise<InsFabInsConfigResponse> {
        try {
            return await this.inspectionConfigService.savePKMSFgInsConfigPLLevel(req);
        } catch (error) {
            return returnException(InsFabInsConfigResponse, error);
        }
    }


    @Post('getFgInsConfigPLLevel')
    async getFgInsConfigPLLevel(@Body() req: InsBuyerCodeRequest): Promise<InsFgInsConfigResponse> {
        try {
            return await this.inspectionConfigService.getFgInsConfigPLLevel(req);
        } catch (error) {
            return returnException(InsFgInsConfigResponse, error);
        }
    }
 


}
