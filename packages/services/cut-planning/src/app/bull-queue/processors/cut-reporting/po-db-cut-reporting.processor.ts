import { BullQueueEvents, OnQueueEvent, Process, Processor } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { CPS_BULLJSJOBNAMES, DbCutReportRequest, DocBundlePanelsRequest, PoSerialRequest } from "@xpparel/shared-models";
import { Job } from "bull";
import { CutReportingService } from "../../../cut-reporting/cut-reporting.service";

//TODO
@Processor(CPS_BULLJSJOBNAMES.CPS_DB_CUT_REP)
@Injectable()
export class PoDbCutReportingProcessor {
    constructor(
        private cutRepService: CutReportingService
    ){

    }

    @Process({name: CPS_BULLJSJOBNAMES.CPS_DB_CUT_REP, concurrency: 5})
    async processPoDocketSerial(job: Job) {
        try {
            const req: DbCutReportRequest = job.data;
            await this.cutRepService.processCutReportingForDocBundle(req);
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