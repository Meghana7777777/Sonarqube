import { BullQueueEvents, OnQueueEvent, Process, Processor } from "@nestjs/bull";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { PackingBullJobNames, PackingListIdRequest } from "@xpparel/shared-models";
import { Job } from "bull";
import { PackListService } from "../../packing-list/packing-list.service";

@Processor(PackingBullJobNames.PACK_JOB_GEN)
@Injectable()
export class PackJobGenProcessor {
    constructor(
        @Inject(forwardRef(() => PackListService)) private packListService: PackListService
    ) {

    }

    @Process({ name: PackingBullJobNames.PACK_JOB_GEN })
    async processPopulateSewFgs(job: Job) {
        try {
            const req: PackingListIdRequest = job.data;
            return await this.packListService.processJOBsGeneration(req)
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