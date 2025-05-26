import { Injectable } from '@nestjs/common';
import { RedisHelperService } from '../../config/redis/redis-helper.service';
import { redisJobConfigs } from '../../config/redis/redis-config';
import { ETS_BULLJSJOBNAMES, EmbJobNumberOpCodeRequest, GlobalResponseObject, LayIdsRequest, PoDocketNumberRequest } from "@xpparel/shared-models";

@Injectable()
export class BullQueueService {
    // inject the redisConfig
    private redisConfig;
    constructor(
        private redisHelper: RedisHelperService,
    ) {
        this.redisConfig = redisJobConfigs.redis;
    }

    async addEmbRequestGenJob(req: PoDocketNumberRequest, bullJobName: ETS_BULLJSJOBNAMES): Promise<GlobalResponseObject> {
        await this.redisHelper.addJobToQueue(bullJobName, req, this.redisConfig);
        return new GlobalResponseObject(true,  930, 'Job added successfully');
    }

    async addEmbHeaderDelJob(req: PoDocketNumberRequest): Promise<GlobalResponseObject> {
        await this.redisHelper.addJobToQueue(ETS_BULLJSJOBNAMES.ETS_EMB_HEADER_DEL, req, this.redisConfig);
        return new GlobalResponseObject(true,  930, 'Job added successfully');
    }

    async addEmbLineDelJob(req: LayIdsRequest): Promise<GlobalResponseObject> {
        await this.redisHelper.addJobToQueue(ETS_BULLJSJOBNAMES.ETS_EMB_LINE_DEL, req, this.redisConfig);
        return new GlobalResponseObject(true,  930, 'Job added successfully');
    }

    // called after bundle scan or reversal operation
    async addEmbOpQtyUpdate(req: EmbJobNumberOpCodeRequest): Promise<GlobalResponseObject> {
        await this.redisHelper.addJobToQueue(ETS_BULLJSJOBNAMES.ETS_EMB_OP_QTY_UPD, req, this.redisConfig);
        return new GlobalResponseObject(true,  930, 'Job added successfully');
    }


}

