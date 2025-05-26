import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { CPS_BULLJSJOBNAMES, CutReportRequest, DbCutReportRequest, DocBundlePanelsRequest, GlobalResponseObject, ItemCodeCronPatternRequest, LayIdRequest, PoDocketNumberRequest, PoProdutNameRequest, PoSerialRequest, RollIdQtyRequest, RollIdsConsumptionRequest, RollIdsRequest, SewSerialRequest, SPS_BULLJSJOBNAMES } from "@xpparel/shared-models";
import { RedisHelperService } from '../config/redis/redis-helper.service';
import redisJobConfigs from '../config/redis/redis-config';

@Injectable()
export class BullQueueService {
    // inject the redisConfig
    private redisConfig;
    constructor(
        private redisHelper: RedisHelperService,
    ) {
        this.redisConfig = redisJobConfigs.redis;
    }

    async addJobForPopulateSewFinishedGoods(req: SewSerialRequest): Promise<GlobalResponseObject> {
        await this.redisHelper.addJobToQueue(SPS_BULLJSJOBNAMES.SEW_FG_POPULATION, req, this.redisConfig);
        return new GlobalResponseObject(true, 930, 'Job added successfully');
    } 

}

