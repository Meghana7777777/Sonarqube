import { Body, Controller, Post } from '@nestjs/common';
import { InvsBullQueueService } from './invs-bull-jobs.service';

@Controller('invs-bull-queue-jobs')
export class InvsBullQueueController {
    constructor(
        private service: InvsBullQueueService
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
