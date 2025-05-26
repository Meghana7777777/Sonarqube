import { BullQueueEvents, OnQueueEvent, Process, Processor } from "@nestjs/bull";
import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { ETS_BULLJSJOBNAMES, LayIdsRequest, PoDocketNumberRequest } from "@xpparel/shared-models";
import { Job } from "bull";
import { EmbRequestService } from "../../emb-request/emb-request.service";

@Processor(ETS_BULLJSJOBNAMES.ETS_EMB_LINE_DEL)
@Injectable()
export class EmbLineDeleteProcessor {
    constructor(
        @Inject(forwardRef(() => EmbRequestService)) private service: EmbRequestService
    ){

    }

    @Process({ name: ETS_BULLJSJOBNAMES.ETS_EMB_LINE_DEL})
    async processDocketBundleGeneration(job: Job) {
        try {
            const req: LayIdsRequest = job.data;
            return await this.service.deleteEmbLine(req)
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