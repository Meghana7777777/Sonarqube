import { BullQueueEvents, OnQueueEvent, Process, Processor } from "@nestjs/bull";
import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { ETS_BULLJSJOBNAMES, PoDocketNumberRequest } from "@xpparel/shared-models";
import { Job } from "bull";
import { EmbRequestService } from "../../emb-request/emb-request.service";

@Processor(ETS_BULLJSJOBNAMES.ETS_EMB_REQ_GEN)
@Injectable()
export class EmbRequestGenerationProcessor {
    constructor(
        @Inject(forwardRef(() => EmbRequestService)) private service: EmbRequestService
    ){

    }

    @Process({ name: ETS_BULLJSJOBNAMES.ETS_EMB_REQ_GEN})
    async processDocketBundleGeneration(job: Job) {
        try {
            const req: PoDocketNumberRequest = job.data;
            return await this.service.createEmbRequest(req)
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