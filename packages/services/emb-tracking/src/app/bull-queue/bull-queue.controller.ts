import { Body, Controller, Post } from '@nestjs/common';
import { BullQueueService } from './bull-queue.service';
import { ApiBearerAuth, ApiBody} from '@nestjs/swagger';
import { ETS_BULLJSJOBNAMES, GlobalResponseObject, LayIdsRequest, PoDocketNumberRequest } from '@xpparel/shared-models';
import { returnException } from '@xpparel/backend-utils';

@Controller('ets-bull-queue-jobs')
export class BullQueueController {
    constructor(
        private service: BullQueueService
    ) {

    }

    /**
     * Will be called from the CPS after the docket confirmation is done
     * @param req 
     * @returns 
     */
    @ApiBody({ type: PoDocketNumberRequest})
    @Post('/addEmbRequestGenJob')
    async addEmbRequestGenJob(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.addEmbRequestGenJob(req, ETS_BULLJSJOBNAMES.ETS_EMB_REQ_GEN);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    /**
     * Will be called from the CPS after the docket unconfirmed / dockets are deleted
     * @param req 
     * @returns 
     */
    @ApiBody({ type: PoDocketNumberRequest})
    @Post('/addEmbHeaderDelJob')
    async addEmbHeaderDelJob(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.addEmbHeaderDelJob(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    /**
     * Will be called from the CPS after cut is reversed
     * @param req 
     * @returns 
     */
    @ApiBody({ type: LayIdsRequest})
    @Post('/addEmbLineDelJob')
    async addEmbLineDelJob(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.addEmbLineDelJob(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }
}
