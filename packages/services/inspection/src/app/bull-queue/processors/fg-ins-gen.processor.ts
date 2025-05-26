import { BullQueueEvents, OnQueueEvent, Process, Processor } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { ErrorResponse } from "@xpparel/backend-utils";
import { FGItemCategoryEnum, FgInsCreateExtRefRequest, INSConfigTransferReqModel, InsBuyerCodeRequest, InsSupplierCodeRequest, InspectionBullJobNames, PhItemCategoryEnum } from "@xpparel/shared-models";
import { PKMSInspectionConfigService } from "@xpparel/shared-services";
import { Job } from "bull"; 
import { FgInspectionCreationService } from "../../inspection-creation/fg-inspection/fg-inspection-creation.service";

@Processor(InspectionBullJobNames.FG_INSPECTION_GEN)
@Injectable()
export class FGInsProcessor {
    constructor(

        private insConfigService: PKMSInspectionConfigService,
        // private fgInspectionCreationService: FgInspectionCreationService,
        private fgInspectionCreationService: FgInspectionCreationService
    ) {

    }

    @Process({ name: InspectionBullJobNames.FG_INSPECTION_GEN })
    async fgInsGen(job: Job) {
        try {
            const req: INSConfigTransferReqModel = job.data;
            const fgInsReq = new FgInsCreateExtRefRequest(req.username, req.unitCode, req.companyCode, req.userId, [], [req.plRefId], [], false, req.insType, req.insConfigItems.map(rec => rec.refBarcode))
            await this.fgInspectionCreationService.createFgInspectionRequest(fgInsReq)
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