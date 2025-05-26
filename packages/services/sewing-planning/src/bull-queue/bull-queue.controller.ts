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

    @ApiBody({ type: PoSerialRequest})
    @Post('/addJobForPopulateCutFinishedGoods')
    async addJobForPopulateCutFinishedGoods(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.addJobForPopulateSewFinishedGoods(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
        
    }
}
