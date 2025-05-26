import { Injectable } from '@nestjs/common';
import { InspectionBullJobNames } from '@xpparel/shared-models';
import { redisJobConfigs } from '../../config/redis/redis-config';
import { RedisHelperService } from '../../config/redis/redis-helper.service';

@Injectable()
export class InsBullQueueService {
    // inject the redisConfig
    private redisConfig;
    constructor(
        private redisHelper: RedisHelperService,
    ) {
        this.redisConfig = redisJobConfigs.redis;
    }

    async addAudioQueue(req: string) {
        try {
            return await this.redisHelper.addJobToQueue(InspectionBullJobNames.AUDIO, req, this.redisConfig);
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
}

