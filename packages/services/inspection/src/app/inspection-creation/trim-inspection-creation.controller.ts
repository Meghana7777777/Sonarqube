import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { returnException } from "@xpparel/backend-utils";
import { GlobalResponseObject, InsBatchNosRequest, InsIrActivityChangeRequest, PackJobIdsRequest, PKMSIrActivityChangeRequest, TrimInsCreateExtRefRequest } from "@xpparel/shared-models";
import { TrimInspectionCreationService } from "./trim-inspection-creation.service";

@ApiTags('Trim Inspection Creation')
@Controller('trim-inspection-creation')

export class TrimInspectionCreationController {
    constructor(
        private trimInspectionCreationService: TrimInspectionCreationService,
    ) { }


    @Post('/createTrimInspectionRequest')
    async createTrimInspectionRequest(@Body() reqModel: TrimInsCreateExtRefRequest): Promise<GlobalResponseObject> {
        try {
            return await this.trimInspectionCreationService.createTrimInspectionRequest(reqModel);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @Post('/deleteTrimInspectionRequest')
    async deleteTrimInspectionRequest(@Body() reqModel: InsBatchNosRequest): Promise<GlobalResponseObject> {
        try {
            return await this.trimInspectionCreationService.deleteTrimInspectionRequest(reqModel);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }


    @Post('/updateTrimInspectionActivityStatus')
    async updateTrimInspectionActivityStatus(@Body() reqModel: InsIrActivityChangeRequest): Promise<GlobalResponseObject> {
        try {
            return await this.trimInspectionCreationService.updateTrimInspectionActivityStatus(reqModel);
        } catch (err) {
            return returnException(GlobalResponseObject, err)
        }
    }
}