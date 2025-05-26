import { BullQueueEvents, OnQueueEvent, Process, Processor } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { CPS_BULLJSJOBNAMES, CutReportRequest, DocBundlePanelsRequest, PoSerialRequest } from "@xpparel/shared-models";
import { Job } from "bull";
import { CutReportingService } from "../../../cut-reporting/cut-reporting.service";

//TODO
@Processor(CPS_BULLJSJOBNAMES.CPS_LAY_CUT_REP)
@Injectable()
export class PoLayCutReportingProcessor {
    constructor(
        private cutRepService: CutReportingService
    ){

    }

    @Process({name: CPS_BULLJSJOBNAMES.CPS_LAY_CUT_REP})
    async processPoDocketSerial(job: Job) {
        try {
            const req: CutReportRequest = job.data;
            await this.cutRepService.processCutReportingForLay(req);
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