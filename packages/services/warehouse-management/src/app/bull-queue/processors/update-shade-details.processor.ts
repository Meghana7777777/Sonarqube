import { BullQueueEvents, OnQueueEvent, Process, Processor } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { InsPhIdRequest, ShadeDetails, WMSBullJobNames } from "@xpparel/shared-models";
import { FabricInspectionInfoService } from "@xpparel/shared-services";
import { Job } from "bull";
import { InspectionHelperService } from "../../inspection-helper.ts/inspection-helper.service";

@Processor(WMSBullJobNames.UPDATE_SHADE)
@Injectable()
export class WMSupdateShadeProcessor {
    constructor(
        private inspectionHelperService: InspectionHelperService,
    ) { }



    @Process({ name: WMSBullJobNames.UPDATE_SHADE })
    async updateShowInventory(job: Job) {
        try {
            const data: ShadeDetails[] = job.data
            this.inspectionHelperService.updateShadeDetails(data)
        } catch (error) {
            // console.log(error);
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