import { Body, ConsoleLogger, Controller, Post } from '@nestjs/common';
import { BullQueueService } from './bull-queue.service';
import { ApiBearerAuth} from '@nestjs/swagger';
import { GlobalResponseObject, InsPhIdRequest, ShadeDetails } from '@xpparel/shared-models';

@Controller('bull-queue-jobs')
export class BullQueueController {
    constructor(
        private service: BullQueueService
    ) {

    }

    @Post('/addAudioQueue')
    async addAudioQueue(@Body() req: any) {
        try {
            return await this.service.addAudioQueue('Hello I am triggering');
        } catch (err) {
            console.log(err);
            throw err;
        }    
    } 

    @Post('/addShownInInventoryQueue')
    async addShownInInventoryQueue(@Body() req: InsPhIdRequest):Promise<GlobalResponseObject> {
        try {
            return await this.service.addShownInInventoryQueue(req);
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    @Post('/updateShadeQueue')
    async updateShadeQueue(@Body() req: ShadeDetails[]):Promise<GlobalResponseObject> {
        try {
            return await this.service.updateShadeQueue(req);
        } catch (err) {
            console.log(err);
            throw err;
        }
    }


}
