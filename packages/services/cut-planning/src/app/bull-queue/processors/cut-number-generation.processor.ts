import { BullQueueEvents, OnQueueEvent, Process, Processor } from "@nestjs/bull";
import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { CPS_BULLJSJOBNAMES, PoDocketNumberRequest, PoProdutNameRequest, PoSerialRequest } from "@xpparel/shared-models";
import { Job } from "bull";
import { DocketGenerationService } from "../../docket-generation/docket-generation.service";
import { CutGenerationService } from "../../cut-generation/cut-generation.service";

@Processor(CPS_BULLJSJOBNAMES.CPS_CUT_NUMBER_GEN)
@Injectable()
export class CutNumberGenerationProcessor {
    constructor(
        @Inject(forwardRef(() => CutGenerationService)) private service: CutGenerationService
    ){

    }

    @Process({name: CPS_BULLJSJOBNAMES.CPS_CUT_NUMBER_GEN})
    async processDocketConfirmation(job: Job) {
        try {
            const req: PoProdutNameRequest = job.data;
            return await this.service.generateCuts(req);
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