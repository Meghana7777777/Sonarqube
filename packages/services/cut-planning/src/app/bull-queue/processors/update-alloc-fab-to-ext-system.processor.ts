import { BullQueueEvents, OnQueueEvent, Process, Processor } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { CPS_BULLJSJOBNAMES, ItemCodeCronPatternRequest, LayIdRequest, LayItemIdRequest, PoDocketNumberRequest, PoProdutNameRequest, RollIdsConsumptionRequest, RollIdsRequest } from "@xpparel/shared-models";
import { Job } from "bull";
import { DocketMaterialService } from "../../docket-material/docket-material.service";

// This job is added after the cut reporting. This will release all the rolls mapped to the laying operation and will create entries in the on-floor
@Processor(CPS_BULLJSJOBNAMES.CPS_UPDATE_ALLOC_FAB_TO_EXT_SYS)
@Injectable()
export class UpdateAllocationStockToExtSystemProcessor {
    constructor(
        private service: DocketMaterialService
    ) {

    }

    @Process({name: CPS_BULLJSJOBNAMES.CPS_UPDATE_ALLOC_FAB_TO_EXT_SYS})
    async processUpdateAllocationStockToExtSystem(job: Job) {
        try {
            const allocationReq: RollIdsConsumptionRequest = job.data;
            return await this.service.updateAllocatedQtyByRollIds(allocationReq.rollIds, allocationReq.unitCode, allocationReq.companyCode, allocationReq.username, allocationReq.requestNumber, allocationReq.requestType, allocationReq.lastIssuanceDate, allocationReq.isReversal);
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