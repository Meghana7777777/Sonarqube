import { BullQueueEvents, OnQueueEvent, Process, Processor } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { CPS_BULLJSJOBNAMES, ItemCodeCronPatternRequest, LayIdRequest, LayItemIdRequest, PoDocketNumberRequest, PoProdutNameRequest } from "@xpparel/shared-models";
import { Job } from "bull";
import { DocketMaterialService } from "../../../docket-material/docket-material.service";
import { CutReportingService } from "../../../cut-reporting/cut-reporting.service";

// This job is added after the cut reporting. This will release all the rolls mapped to the laying operation and will create entries in the on-floor
@Processor(CPS_BULLJSJOBNAMES.CPS_UPDATE_CONSUMED_FAB_TO_EXT_SYS)
@Injectable()
export class UpdateConsumedStockToExtSystemProcessor {
    constructor(
        private service: CutReportingService
    ) {

    }

    @Process({name: CPS_BULLJSJOBNAMES.CPS_UPDATE_CONSUMED_FAB_TO_EXT_SYS})
    async processDocketConfirmation(job: Job) {
        try {
            const layIdReq: LayIdRequest = job.data;
            return await this.service.updateTheConsumedStockToExternalSystem(layIdReq);
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