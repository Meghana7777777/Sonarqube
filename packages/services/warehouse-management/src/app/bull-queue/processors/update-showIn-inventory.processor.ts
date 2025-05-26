import { BullQueueEvents, OnQueueEvent, Process, Processor } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { InsPhIdRequest, WMSBullJobNames } from "@xpparel/shared-models";
import { FabricInspectionInfoService } from "@xpparel/shared-services";
import { Job } from "bull";
import { InspectionHelperService } from "../../inspection-helper.ts/inspection-helper.service";

@Processor(WMSBullJobNames.UPDATE_SHOW_INVENTORY)
@Injectable()
export class WMSInsProcessor {
    constructor(
        private fabricInspectionInfoService:FabricInspectionInfoService,
        private inspectionHelperService:InspectionHelperService,
    ) {}



    @Process({ name: WMSBullJobNames.UPDATE_SHOW_INVENTORY })
    async updateShowInventory(job: Job) {
        try {
            const req:InsPhIdRequest=job.data
           const res=await this.inspectionHelperService.updateShowInInventoryJob(req)
           if(!res.data)
           {
            throw new Error(res.internalMessage);
           }
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