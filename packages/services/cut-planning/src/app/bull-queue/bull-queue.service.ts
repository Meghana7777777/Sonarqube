import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { RedisHelperService } from '../../config/redis/redis-helper.service';
import { redisJobConfigs } from '../../config/redis/redis-config';
import { redlock } from '../../config/redis/redlock.config';
import { CPS_BULLJSJOBNAMES, CutReportRequest, DbCutReportRequest, DocBundlePanelsRequest, GlobalResponseObject, ItemCodeCronPatternRequest, LayIdRequest, PoDocketNumberRequest, PoProdutNameRequest, PoSerialRequest, RollIdQtyRequest, RollIdsConsumptionRequest, RollIdsRequest } from "@xpparel/shared-models";

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
            return await this.redisHelper.addJobToQueue('audio', req, this.redisConfig);
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async addDocketBundleGeneration(req: PoDocketNumberRequest, bullJobName: CPS_BULLJSJOBNAMES): Promise<GlobalResponseObject> {
        try {
            await this.redisHelper.addJobToQueue(bullJobName, req, this.redisConfig);
            return new GlobalResponseObject(true, 0, 'Job added successfully');
        } catch (err) {
            throw err;
        }
    }

    async addDocketPanelGeneration(req: DocBundlePanelsRequest, bullJobName: CPS_BULLJSJOBNAMES): Promise<GlobalResponseObject> {
        try {
            await this.redisHelper.addJobToQueue(bullJobName, req, this.redisConfig);
            return new GlobalResponseObject(true, 0, 'Job added successfully');
        } catch (err) {
            throw err;
        }
    }

    async addDocketConfirmation(req: PoProdutNameRequest, bullJobName: CPS_BULLJSJOBNAMES): Promise<GlobalResponseObject> {
        try {
            await this.redisHelper.addJobToQueue(bullJobName, req, this.redisConfig);
            return new GlobalResponseObject(true, 0, 'Job added successfully');
        } catch (err) {
            throw err;
        }
    }

    async addScheduledJobForMaterialUnLock(reqObj: ItemCodeCronPatternRequest): Promise<GlobalResponseObject> {
        const jobConfigData = {
            delay: 360 * 1000
        };
        console.log(jobConfigData);
        // await this.redisHelper.removeAllRepeatable(BULLJSJOBNAMES.CPS_UN_LOCK_DOC_MATERIAL, this.redisConfig, jobConfigData);
        await this.redisHelper.addJobToQueue(CPS_BULLJSJOBNAMES.CPS_UN_LOCK_DOC_MATERIAL, reqObj, this.redisConfig, jobConfigData);
        return new GlobalResponseObject(true, 0, 'Job added successfully');
    }

    async addPoDocketSerialGenerationJob(req: PoSerialRequest, bullJobName: CPS_BULLJSJOBNAMES): Promise<GlobalResponseObject> {
        try {
            await this.redisHelper.addJobToQueue(bullJobName, req, this.redisConfig);
            return new GlobalResponseObject(true, 0, 'Job added successfully');
        } catch (err) {
            throw err;
        }
    }


    async addJobForProcessingCutReportingForLay(req: CutReportRequest, bullJobName: CPS_BULLJSJOBNAMES): Promise<GlobalResponseObject> {
        await this.redisHelper.addJobToQueue(bullJobName, req, this.redisConfig);
        return new GlobalResponseObject(true, 0, 'Job added successfully');
    }
    
    async addJobForProcessingCutReportingForDocBundle(req: DbCutReportRequest, bullJobName: CPS_BULLJSJOBNAMES): Promise<GlobalResponseObject> {
        await this.redisHelper.addJobToQueue(bullJobName, req, this.redisConfig);
        return new GlobalResponseObject(true, 0, 'Job added successfully');
    } 

    async addJobForProcessingCutReversingForLay(req: LayIdRequest, bullJobName: CPS_BULLJSJOBNAMES): Promise<GlobalResponseObject> {
        await this.redisHelper.addJobToQueue(bullJobName, req, this.redisConfig);
        return new GlobalResponseObject(true, 0, 'Job added successfully');
    } 

    async addJobForProcessingPendingRollsToOnFloor(req: LayIdRequest, bullJobName: CPS_BULLJSJOBNAMES): Promise<GlobalResponseObject> {
        await this.redisHelper.addJobToQueue(bullJobName, req, this.redisConfig);
        return new GlobalResponseObject(true, 0, 'Job added successfully');
    } 

    async addJobForUpdatingConsumedFabToExtSystem(req: LayIdRequest): Promise<GlobalResponseObject> {
        await this.redisHelper.addJobToQueue(CPS_BULLJSJOBNAMES.CPS_UPDATE_CONSUMED_FAB_TO_EXT_SYS, req, this.redisConfig, { backoff: 30000, attempts: 5});
        return new GlobalResponseObject(true, 0, 'Job added successfully');
    } 

    async addJobForCutNumberGeneration(req: PoSerialRequest): Promise<GlobalResponseObject> {
        await this.redisHelper.addJobToQueue(CPS_BULLJSJOBNAMES.CPS_CUT_NUMBER_GEN, req, this.redisConfig);
        return new GlobalResponseObject(true, 0, 'Job added successfully');
    } 

    async addJobForUpdatingAllocFabToExtSystem(req: RollIdsConsumptionRequest): Promise<GlobalResponseObject> {
        await this.redisHelper.addJobToQueue(CPS_BULLJSJOBNAMES.CPS_UPDATE_ALLOC_FAB_TO_EXT_SYS, req, this.redisConfig, { backoff: 30000, attempts: 5});
        return new GlobalResponseObject(true, 0, 'Job added successfully');
    } 


    async addJobForUpdatingIssuedFabToExtSystem(req: RollIdsConsumptionRequest): Promise<GlobalResponseObject> {
        await this.redisHelper.addJobToQueue(CPS_BULLJSJOBNAMES.CPS_UPDATE_ISSUE_FAB_TO_EXT_SYS, req, this.redisConfig, { backoff: 30000, attempts: 5});
        return new GlobalResponseObject(true, 0, 'Job added successfully');
    } 

}

