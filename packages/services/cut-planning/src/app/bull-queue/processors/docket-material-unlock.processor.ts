import { BullQueueEvents, OnQueueEvent, Process, Processor } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { CPS_BULLJSJOBNAMES, ItemCodeCronPatternRequest, PoDocketNumberRequest, PoProdutNameRequest } from "@xpparel/shared-models";
import { Job } from "bull";
import { DocketMaterialService } from "../../docket-material/docket-material.service";

@Processor(CPS_BULLJSJOBNAMES.CPS_UN_LOCK_DOC_MATERIAL)
@Injectable()
export class DocketMaterialUnlockProcessor {
    constructor(
        private service: DocketMaterialService
    ) {

    }
    @Process({name: CPS_BULLJSJOBNAMES.CPS_UN_LOCK_DOC_MATERIAL})
    async processDocketConfirmation(job: Job) {
        try {
            const jobData: ItemCodeCronPatternRequest = job.data;
            return await this.service.unlockMaterial(jobData.itemCode, jobData.unitCode, jobData.companyCode, jobData.username, jobData.lockId)
        } catch (error) {
            throw new Error(error);
        }
    }
    @OnQueueEvent(BullQueueEvents.ERROR)
    onError(job: Job, err: Error) {
        
    }

    @OnQueueEvent(BullQueueEvents.FAILED)
    onFailed(job: Job, err: Error) {
    }

    @OnQueueEvent(BullQueueEvents.COMPLETED)
    onCompleted(job: Job) {
        job.progress(100);
    }
}