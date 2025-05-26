import { Body, Controller, Post } from '@nestjs/common';
import { BullQueueService } from './bull-queue.service';
import { ApiBearerAuth, ApiBody} from '@nestjs/swagger';
import { CPS_BULLJSJOBNAMES, GlobalResponseObject, PoSerialRequest } from '@xpparel/shared-models';
import { returnException } from '@xpparel/backend-utils';

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


    /**
     * This API will be triggered from the OES. since the job is under CPS(diff microservice), API is the only way to add the job to the queue in CPS
     * @param req 
     * @returns 
     */
    @ApiBody({ type: PoSerialRequest})
    @Post('/addPoDocketSerialGenerationJob')
    async addPoDocketSerialGenerationJob(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.addPoDocketSerialGenerationJob(req, CPS_BULLJSJOBNAMES.CPS_PO_DOC_SER_GEN);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
        
    }
}
