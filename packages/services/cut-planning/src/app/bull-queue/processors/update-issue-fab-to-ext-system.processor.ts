import { BullQueueEvents, OnQueueEvent, Process, Processor } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { CPS_BULLJSJOBNAMES, RollIdsConsumptionRequest, RollIdsRequest } from "@xpparel/shared-models";
import { Job } from "bull";
import { DocketMaterialService } from "../../docket-material/docket-material.service";

@Processor(CPS_BULLJSJOBNAMES.CPS_UPDATE_ISSUE_FAB_TO_EXT_SYS)
@Injectable()
export class UpdateIssuanceStockToExtSystemProcessor {
    constructor(
        private service: DocketMaterialService
    ) {

    }

    @Process({name: CPS_BULLJSJOBNAMES.CPS_UPDATE_ISSUE_FAB_TO_EXT_SYS})
    async processUpdateIssuanceStockToExtSystem(job: Job) {
        try {
            const allocationReq: RollIdsConsumptionRequest = job.data;
            return await this.service.updateIssuedQtyByRollIds(allocationReq.rollIds, allocationReq.unitCode, allocationReq.companyCode, allocationReq.username, allocationReq.requestNumber, allocationReq.requestType, allocationReq.lastIssuanceDate, allocationReq.isReversal);
        } catch (error) {
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