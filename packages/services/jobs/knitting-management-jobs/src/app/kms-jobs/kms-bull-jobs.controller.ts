import { Body, Controller, Post } from '@nestjs/common';
import { KmsBullQueueService } from './kms-bull-jobs.service';

@Controller('kms-bull-queue-jobs')
export class KmsBullQueueController {
    constructor(
        private service: KmsBullQueueService
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
