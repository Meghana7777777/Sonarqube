import { Body, Controller, Post } from '@nestjs/common';
import { WmsBullQueueService } from './wms-bull-jobs.service';

@Controller('wms-bull-queue-jobs')
export class WmsBullQueueController {
    constructor(
        private service: WmsBullQueueService
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

   
}
