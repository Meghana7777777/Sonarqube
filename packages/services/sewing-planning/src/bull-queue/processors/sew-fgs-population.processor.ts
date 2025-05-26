import { BullQueueEvents, OnQueueEvent, Process, Processor } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { CPS_BULLJSJOBNAMES, SewSerialRequest, SPS_BULLJSJOBNAMES } from "@xpparel/shared-models";
import { Job } from "bull";

@Processor(SPS_BULLJSJOBNAMES.SEW_FG_POPULATION)
@Injectable()
export class PopulateSewFgsProcessor {
    constructor(
        // private service : SewingOrderService
    ){

    }

    @Process({name: SPS_BULLJSJOBNAMES.SEW_FG_POPULATION})
    async processPopulateSewFgs(job: Job) {
        try {
            const req: SewSerialRequest = job.data;
            // return await this.service.populateSewFgsForSewSerial(req)
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