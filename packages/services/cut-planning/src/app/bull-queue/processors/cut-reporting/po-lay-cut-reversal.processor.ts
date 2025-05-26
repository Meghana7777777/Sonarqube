import { BullQueueEvents, OnQueueEvent, Process, Processor } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { CPS_BULLJSJOBNAMES, DocBundlePanelsRequest, LayIdRequest, PoSerialRequest } from "@xpparel/shared-models";
import { Job } from "bull";
import { DocketGenerationService } from "../../../docket-generation/docket-generation.service";
import { CutReportingService } from "../../../cut-reporting/cut-reporting.service";

@Processor(CPS_BULLJSJOBNAMES.CPS_LAY_CUT_REV)
@Injectable()
export class PoLayCutReversalProcessor {
    constructor(
        private cutRepService: CutReportingService
    ){

    }

    @Process({name: CPS_BULLJSJOBNAMES.CPS_LAY_CUT_REV})
    async processPoDocketSerial(job: Job) {
        try {
            const req: LayIdRequest = job.data;
            await this.cutRepService.validateAndTriggerReverseCutForLay(req);
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