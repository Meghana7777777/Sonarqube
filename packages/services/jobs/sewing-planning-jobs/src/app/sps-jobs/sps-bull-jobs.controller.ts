import { Body, Controller, Post } from '@nestjs/common';
import { SpsBullQueueService } from './sps-bull-jobs.service';

@Controller('sps-bull-queue-jobs')
export class SpsBullQueueController {
    constructor(
        private service: SpsBullQueueService
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
