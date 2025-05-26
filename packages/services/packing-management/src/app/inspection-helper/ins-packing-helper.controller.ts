import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { InsPackingHelperService } from "./ins-packing-helper.service";
import { CartonIdsRequest, FgInsCreateExtRefRequest, FgInsSelectedBatchResponse, InsCartonsDataResponse, InsFgInsConfigResponse } from "@xpparel/shared-models";
import { returnException } from "@xpparel/backend-utils";

@ApiTags('Ins packing Helper')
@Controller('InsPackingHelper')
export class InsPackingHelperController {
    constructor(
        private readonly insPackingHelperService: InsPackingHelperService,
    ) { }

    @Post('getFgInspectionSelectedItems')
    async getFgInspectionSelectedItems(@Body() req: FgInsCreateExtRefRequest): Promise<FgInsSelectedBatchResponse> {
        try {
            return await this.insPackingHelperService.getFgInspectionSelectedItems(req);
        } catch (error) {
            return returnException(FgInsSelectedBatchResponse, error);
        }
    }

    @Post('getCartonsDataByCartonId')
    async getCartonsDataByCartonId(@Body() req: CartonIdsRequest): Promise<InsCartonsDataResponse> {
        try {
            return await this.insPackingHelperService.getCartonsDataByCartonId(req);
        } catch (error) {
            return returnException(InsCartonsDataResponse, error);
        }
    }



}