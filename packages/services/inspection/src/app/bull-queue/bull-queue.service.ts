import { Injectable } from '@nestjs/common';
import { ErrorResponse } from '@xpparel/backend-utils';
import { GlobalResponseObject, INSConfigTransferReqModel, InspectionBullJobNames } from '@xpparel/shared-models';
import { redisJobConfigs } from '../../config/redis/redis-config';
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

    async addRMInspections(req: INSConfigTransferReqModel) {
        await this.redisHelper.addJobToQueue(InspectionBullJobNames.RM_INSPECTION_GEN, req, this.redisConfig);
        return new GlobalResponseObject(true, 930, 'Job added successfully');
    }

    async addFGInspections(req: INSConfigTransferReqModel) {
        try {
            await this.redisHelper.addJobToQueue(InspectionBullJobNames.FG_INSPECTION_GEN, req, this.redisConfig);
            return new GlobalResponseObject(true, 930, 'Job added successfully');
        } catch (error) {
            console.log(error)
            throw new ErrorResponse(6948, error.message)
        }

    }
}

