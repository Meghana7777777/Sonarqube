import { BullQueueEvents, OnQueueEvent, Process, Processor } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { INSConfigTransferReqModel, InsFabInsCreateExtRefRequest, InspectionBullJobNames, InsSupplierCodeRequest, PhItemCategoryEnum, ThreadInsCreateExtRefRequest, TrimInsCreateExtRefRequest, YarnInsCreateExtRefRequest } from "@xpparel/shared-models";
import { WMSInspectionConfigService } from "@xpparel/shared-services";
import { Job } from "bull";
import { FabricInspectionCreationService } from "../../inspection-creation/fabric-inspection-creation.service";
import { ThreadInspectionCreationService } from "../../inspection-creation/thread-inspection-creation.service";
import { YarnInspectionCreationService } from "../../inspection-creation/yarn-inspection-creation.service";
import { TrimInspectionCreationService } from "../../inspection-creation/trim-inspection-creation.service";

@Processor(InspectionBullJobNames.RM_INSPECTION_GEN)
@Injectable()
export class RMInsProcessor {
    constructor(
        private insFabService: FabricInspectionCreationService,
        private insConfigService: WMSInspectionConfigService,
        private insYarnService: YarnInspectionCreationService,
        private insThreadService: ThreadInspectionCreationService,
        private insTrimService: TrimInspectionCreationService,
    ) {

    }

    @Process({ name: InspectionBullJobNames.RM_INSPECTION_GEN })
    async rmInsGen(job: Job) {
        try {
            const req: INSConfigTransferReqModel = job.data;
            const insItems = await this.insConfigService.getFabInsConfigPLLevel(new InsSupplierCodeRequest(req.username, req.unitCode, req.companyCode, req.userId, req.supplierCode, req.plRefId, req.itemCategory));
            if (req.itemCategory === PhItemCategoryEnum.FABRIC) {
                const rollIds: number[] = []
                insItems.data[0].insConfigs.forEach(item =>
                    item.insConfigItems.forEach(insItem => rollIds.push(insItem.refId))
                );
                await this.insFabService.createFabricInspectionRequest(new InsFabInsCreateExtRefRequest(req.username, req.unitCode, req.companyCode, req.userId, [req.plRefId], [], [], rollIds, false, false, req.insType));
            }

            if (req.itemCategory === PhItemCategoryEnum.THREAD) {
                //Thread
                const rollIds: number[] = []
                insItems.data[0].insConfigs.forEach(item =>
                    item.insConfigItems.forEach(insItem => rollIds.push(insItem.refId))
                );
                await this.insThreadService.createThreadInspectionRequest(new ThreadInsCreateExtRefRequest(req.username, req.unitCode, req.companyCode, req.userId, [req.plRefId], [], [], rollIds, false, false, req.insType));

            }

            if (req.itemCategory === PhItemCategoryEnum.TRIM) {
                //Trim
                console.log("Trim Ins Gen3332",req)
                const rollIds: number[] = []
                insItems.data[0].insConfigs.forEach(item =>
                    item.insConfigItems.forEach(insItem => rollIds.push(insItem.refId))
                );
                await this.insTrimService.createTrimInspectionRequest(new TrimInsCreateExtRefRequest(req.username, req.unitCode, req.companyCode, req.userId, [req.plRefId], [], [], rollIds, false, false, req.insType));
            }

            if (req.itemCategory === PhItemCategoryEnum.YARN) {
                //Yarn
                const rollIds: number[] = []
                insItems.data[0].insConfigs.forEach(item =>
                    item.insConfigItems.forEach(insItem => rollIds.push(insItem.refId))
                );
                await this.insYarnService.createYarnInspectionRequest(new YarnInsCreateExtRefRequest(req.username, req.unitCode, req.companyCode, req.userId, [req.plRefId], [], [], rollIds, false, false, req.insType));
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