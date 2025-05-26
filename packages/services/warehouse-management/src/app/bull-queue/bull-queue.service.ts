import { Injectable } from '@nestjs/common';
import { redisJobConfigs } from '../../config/redis/redis-config';
import { RedisHelperService } from '../../config/redis/redis-helper.service';
import { GlobalResponseObject, InsPhIdRequest, ShadeDetails, WMSBullJobNames } from '@xpparel/shared-models';

@Injectable()
export class BullQueueService {
    // inject the redisConfig
    private redisConfig;
    constructor(
        private redisHelper: RedisHelperService,
    ) {
        this.redisConfig = redisJobConfigs.redis;
    }

    async addAudioQueue(req: string) {
        try {
            return await this.redisHelper.addJobToQueue(WMSBullJobNames.AUDIO, req, this.redisConfig);
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async addShownInInventoryQueue(req: InsPhIdRequest):Promise<GlobalResponseObject> {
        await this.redisHelper.addJobToQueue(WMSBullJobNames.UPDATE_SHOW_INVENTORY, req, this.redisConfig);
        return new GlobalResponseObject(true, 930, 'Job added successfully');
    } 

    async updateShadeQueue(req: ShadeDetails[]):Promise<GlobalResponseObject> {
        console.log('job added4334987')
        await this.redisHelper.addJobToQueue(WMSBullJobNames.UPDATE_SHADE, req, this.redisConfig);
        console.log('job added4334')
        return new GlobalResponseObject(true, 930, 'Job added successfully');
    }
}

