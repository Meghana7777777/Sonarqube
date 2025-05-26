import { BullQueueEvents, OnQueueEvent, Process, Processor } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { CPS_BULLJSJOBNAMES, DocBundlePanelsRequest } from "@xpparel/shared-models";
import { Job } from "bull";
import { DocketGenerationService } from "../../docket-generation/docket-generation.service";

@Processor(CPS_BULLJSJOBNAMES.CPS_DOC_BUN_PANEL_GEN)
@Injectable()
export class DocketPanelGenerationProcessor {
    constructor(
        private service : DocketGenerationService
    ){

    }

    @Process({ name: CPS_BULLJSJOBNAMES.CPS_DOC_BUN_PANEL_GEN, concurrency: 5})
    async processDocketPanelGeneration(job: Job) {
        try {
            const req: DocBundlePanelsRequest = job.data;
            return await this.service.generatePanelsForDocBundle(req)
        } catch (error) {
            throw new Error(JSON.stringify(error));
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