import { BullQueueEvents, OnQueueEvent, Process, Processor } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { PackingBullJobNames, SI_MoNumberRequest } from "@xpparel/shared-models";
import { Job } from "bull";
import { PKMSFgCreationService } from "../../pre-integrations/fg-creation.service";

@Processor(PackingBullJobNames.PACK_OSL_INFO_DEL)
@Injectable()
export class PKMS_OSL_DEL_Processor {
    constructor(
        private service: PKMSFgCreationService
    ) {

    }

    @Process({ name: PackingBullJobNames.PACK_OSL_INFO_DEL })
    async processPopulateSewFgs(job: Job) {
        try {
            const req: SI_MoNumberRequest = job.data;
            return await this.service.deleteOslRefIdsForMo(req)
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