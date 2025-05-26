import { BullQueueEvents, OnQueueEvent, Process, Processor } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { CPS_BULLJSJOBNAMES, DocBundlePanelsRequest, PoSerialRequest } from "@xpparel/shared-models";
import { Job } from "bull";
import { DocketGenerationService } from "../../docket-generation/docket-generation.service";

@Processor(CPS_BULLJSJOBNAMES.CPS_PO_DOC_SER_GEN)
@Injectable()
export class PoDocketSerialGenerationProcessor {
    constructor(
        private service : DocketGenerationService
    ){

    }

    @Process({name: CPS_BULLJSJOBNAMES.CPS_PO_DOC_SER_GEN})
    async processPoDocketSerial(job: Job) {
        try {
            const req: PoSerialRequest = job.data;
            return await this.service.createPoDocketSerialDetails(req)
        } catch (error) {
            console.log(error);
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