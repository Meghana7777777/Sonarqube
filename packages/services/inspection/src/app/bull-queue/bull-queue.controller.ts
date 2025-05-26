import { Body, Controller, Post } from '@nestjs/common';
import { BullQueueService } from './bull-queue.service';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { GlobalResponseObject, INSConfigTransferReqModel } from '@xpparel/shared-models';
import { returnException } from '@xpparel/backend-utils';

@Controller('ins-bull-queue-jobs')
export class BullQueueController {
    constructor(
        private service: BullQueueService
    ) {

    }


    @ApiBody({ type: INSConfigTransferReqModel })
    @Post('/addRMInspections')
    async addRMInspections(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.addRMInspections(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @ApiBody({ type: INSConfigTransferReqModel })
    @Post('/addFGInspections')
    async addFGInspections(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.addFGInspections(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }
}
