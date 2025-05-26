import { Injectable } from '@nestjs/common';
import { GlobalResponseObject, PackingBullJobNames, PackingListIdRequest, PackSerialRequest, SI_MoNumberRequest } from "@xpparel/shared-models";
import redisJobConfigs from '../../config/redis/redis-config';
import { RedisHelperService } from '../../config/redis/redis-helper.service';

@Injectable()
export class BullQueueService {
    // inject the redisConfig
    private redisConfig;
    constructor(
        private redisHelper: RedisHelperService,
    ) {
        this.redisConfig = redisJobConfigs.redis;
    }

    async addJobForPopulatePackFinishedGoods(req: PackSerialRequest): Promise<GlobalResponseObject> {
        await this.redisHelper.addJobToQueue(PackingBullJobNames.PACK_FG_POPULATION, req, this.redisConfig);
        return new GlobalResponseObject(true, 930, 'Job added successfully');
    }

    async addJobsToGeneratePackJobs(req: PackingListIdRequest): Promise<GlobalResponseObject> {
        await this.redisHelper.addJobToQueue(PackingBullJobNames.PACK_JOB_GEN, req, this.redisConfig);
        return new GlobalResponseObject(true, 930, 'Job added successfully');
    }

    async sendMoConfirmationStatusToPKMS(req: SI_MoNumberRequest): Promise<GlobalResponseObject> {
        await this.redisHelper.addJobToQueue(PackingBullJobNames.PACK_OSL_INFO_GEN, req, this.redisConfig);
        return new GlobalResponseObject(true, 930, 'Job added successfully');
    }

    async sendMoDeConfirmationStatusToPKMS(req: SI_MoNumberRequest): Promise<GlobalResponseObject> {
        await this.redisHelper.addJobToQueue(PackingBullJobNames.PACK_OSL_INFO_DEL, req, this.redisConfig);
        return new GlobalResponseObject(true, 930, 'Job added successfully');
    }


}

