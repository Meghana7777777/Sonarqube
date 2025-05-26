import { BullQueueEvents, OnQueueEvent, Process, Processor } from "@nestjs/bull";
import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { ETS_BULLJSJOBNAMES, EmbJobNumberOpCodeRequest, PoDocketNumberRequest } from "@xpparel/shared-models";
import { Job } from "bull";
import { EmbRequestService } from "../../emb-request/emb-request.service";
import { EmbTrackingService } from "../../emb-tracking/emb-tracking.service";

@Processor(ETS_BULLJSJOBNAMES.ETS_EMB_OP_QTY_UPD)
@Injectable()
export class EmbOpQtyUpdateProcessor {
    constructor(
        @Inject(forwardRef(() => EmbTrackingService)) private service: EmbTrackingService
    ){

    }

    @Process({ name: ETS_BULLJSJOBNAMES.ETS_EMB_OP_QTY_UPD})
    async processEmbOpqtyUpdate(job: Job) {
        try {
            const req: EmbJobNumberOpCodeRequest = job.data;
            return await this.service.updateEmbJobOperationQty(req);
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