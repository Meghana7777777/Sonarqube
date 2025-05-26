import { Body, Controller, Post } from '@nestjs/common';
import { PtsBullQueueService } from './pts-bull-jobs.service';

@Controller('pts-bull-queue-jobs')
export class PtsBullQueueController {
    constructor(
        private service: PtsBullQueueService
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
