import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { returnException } from '@xpparel/backend-utils';
import { GlobalResponseObject, PackingListIdRequest, PoSerialRequest, SI_MoNumberRequest } from '@xpparel/shared-models';
import { BullQueueService } from './bull-queue.service';

@Controller('bull-queue-jobs')
export class BullQueueController {
    constructor(
        private service: BullQueueService
    ) {

    }

    @ApiBody({ type: PoSerialRequest })
    @Post('/addJobForPopulatePackFinishedGoods')
    async addJobForPopulatePackFinishedGoods(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.addJobForPopulatePackFinishedGoods(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }
    @ApiBody({ type: PackingListIdRequest })
    @Post('/addJobsToGeneratePackJobs')
    async addJobsToGeneratePackJobs(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.addJobsToGeneratePackJobs(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @ApiBody({ type: SI_MoNumberRequest })
    @Post('/sendMoConfirmationStatusToPKMS')
    async sendMoConfirmationStatusToPKMS(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.sendMoConfirmationStatusToPKMS(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @ApiBody({ type: SI_MoNumberRequest })
    @Post('/sendMoDeConfirmationStatusToPKMS')
    async sendMoDeConfirmationStatusToPKMS(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.sendMoDeConfirmationStatusToPKMS(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }
}
