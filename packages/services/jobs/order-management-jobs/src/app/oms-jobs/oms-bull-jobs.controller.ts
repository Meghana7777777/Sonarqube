import { Body, Controller, Post } from '@nestjs/common';
import { OmsBullQueueService } from './oms-bull-jobs.service';

@Controller('oms-bull-queue-jobs')
export class OmsBullQueueController {
    constructor(
        private service: OmsBullQueueService
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
