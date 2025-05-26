import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { returnException } from "@xpparel/backend-utils";
import { GlobalResponseObject, InsBatchNosRequest, InsIrActivityChangeRequest, PackJobIdsRequest, PKMSIrActivityChangeRequest, YarnInsCreateExtRefRequest } from "@xpparel/shared-models";
import { YarnInspectionCreationService } from "./yarn-inspection-creation.service";

@ApiTags('Yarn Inspection Creation')
@Controller('yarn-inspection-creation')

export class YarnInspectionCreationController {
    constructor(
        private yarnInspectionCreationService: YarnInspectionCreationService,
    ) { }


    @Post('/createYarnInspectionRequest')
    async createYarnInspectionRequest(@Body() reqModel: YarnInsCreateExtRefRequest): Promise<GlobalResponseObject> {
        try {
            return await this.yarnInspectionCreationService.createYarnInspectionRequest(reqModel);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @Post('/deleteYarnInspectionRequest')
    async deleteYarnInspectionRequest(@Body() reqModel: InsBatchNosRequest): Promise<GlobalResponseObject> {
        try {
            return await this.yarnInspectionCreationService.deleteYarnInspectionRequest(reqModel);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }


    @Post('/updateYarnInspectionActivityStatus')
    async updateYarnInspectionActivityStatus(@Body() reqModel: InsIrActivityChangeRequest): Promise<GlobalResponseObject> {
        try {
            return await this.yarnInspectionCreationService.updateYarnInspectionActivityStatus(reqModel);
        } catch (err) {
            return returnException(GlobalResponseObject, err)
        }
    }
}