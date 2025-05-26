import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { returnException } from "@xpparel/backend-utils";
import { GlobalResponseObject, InsBatchNosRequest, InsIrActivityChangeRequest, PackJobIdsRequest, PKMSIrActivityChangeRequest, ThreadInsCreateExtRefRequest } from "@xpparel/shared-models";
import { ThreadInspectionCreationService } from "./thread-inspection-creation.service";

@ApiTags('Thread Inspection Creation')
@Controller('thread-inspection-creation')

export class ThreadInspectionCreationController {
    constructor(
        private threadInspectionCreationService: ThreadInspectionCreationService,
    ) { }


    @Post('/createThreadInspectionRequest')
    async createThreadInspectionRequest(@Body() reqModel: ThreadInsCreateExtRefRequest): Promise<GlobalResponseObject> {
        try {
            return await this.threadInspectionCreationService.createThreadInspectionRequest(reqModel);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @Post('/deleteThreadInspectionRequest')
    async deleteThreadInspectionRequest(@Body() reqModel: InsBatchNosRequest): Promise<GlobalResponseObject> {
        try {
            return await this.threadInspectionCreationService.deleteThreadInspectionRequest(reqModel);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }


    @Post('/updateThreadInspectionActivityStatus')
    async updateThreadInspectionActivityStatus(@Body() reqModel: InsIrActivityChangeRequest): Promise<GlobalResponseObject> {
        try {
            return await this.threadInspectionCreationService.updateThreadInspectionActivityStatus(reqModel);
        } catch (err) {
            return returnException(GlobalResponseObject, err)
        }
    }
}