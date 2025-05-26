import { BullQueueEvents, OnQueueEvent, Process, Processor } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { PackingBullJobNames, PKMS_C_ReadyToPackFgsRequest } from "@xpparel/shared-models";
import { Job } from "bull";
import { PKMSFgCreationService } from "../../pre-integrations/fg-creation.service";

@Processor(PackingBullJobNames.PACK_FG_POPULATION)
@Injectable()
export class PackFGGenProcessor {
    constructor(
        private service: PKMSFgCreationService
    ) {

    }

    @Process({ name: PackingBullJobNames.PACK_FG_POPULATION })
    async processPopulateSewFgs(job: Job) {
        try {
            const req: PKMS_C_ReadyToPackFgsRequest = job.data;
            return await this.service.logReadyToPackFgs(req);
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