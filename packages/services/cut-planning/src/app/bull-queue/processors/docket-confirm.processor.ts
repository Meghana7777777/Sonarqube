import { BullQueueEvents, OnQueueEvent, Process, Processor } from "@nestjs/bull";
import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { CPS_BULLJSJOBNAMES, PoDocketNumberRequest, PoProdutNameRequest } from "@xpparel/shared-models";
import { Job } from "bull";
import { DocketGenerationService } from "../../docket-generation/docket-generation.service";

@Processor(CPS_BULLJSJOBNAMES.CPS_DOC_CON)
@Injectable()
export class DocketConfirmProcessor {
    constructor(
        @Inject(forwardRef(() => DocketGenerationService)) private service: DocketGenerationService
    ){

    }

    @Process({name: CPS_BULLJSJOBNAMES.CPS_DOC_CON})
    async processDocketConfirmation(job: Job) {
        try {
            const req: PoProdutNameRequest = job.data;
            return await this.service.docketConfirmation(req);
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