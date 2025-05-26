import { Body, Controller, Post } from '@nestjs/common';
import { InsBullQueueService } from './ins-bull-jobs.service';

@Controller('ins-bull-queue-jobs')
export class InsBullQueueController {
    constructor(
        private service: InsBullQueueService
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
