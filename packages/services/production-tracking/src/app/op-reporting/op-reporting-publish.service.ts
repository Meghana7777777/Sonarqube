import { GlobalResponseObject, OslRefIdRequest, ManufacturingOrderProductName, SI_MoNumberRequest, ProcessTypeEnum, INV_C_InvOutAllocIdRequest, INV_R_InvOutAllocationInfoAndBundlesResponse, INV_R_InvOutAllocationInfoAndBundlesModel, PTS_C_BundleReportingRequest, FixedOpCodeEnum, PTS_C_TranLogIdRequest, PTS_C_BundleReversalRequest, PTS_R_BundleScanResponse, PTS_R_BundleScanModel, JobBarcodeTypeEnum, PTS_R_TranLogIdInfoModel, PTS_C_TranLogIdPublishAckRequest, PtsExtSystemNamesEnum } from "@xpparel/shared-models";
import { OpSequenceOpgRepository } from "../entity/repository/op-sequence-opg.repository";
import { FgRepository } from "../entity/repository/fg.repository";
import { FgOpDepRepository } from "../entity/repository/fg-op-dep.repository";
import { OslInfoRepository } from "../entity/repository/osl-info.repository";
import { DataSource, In, Not } from "typeorm";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { InvReceivingRepository } from "../entity/repository/inv-receiving.repository";
import { BundleTransRepository } from "../entity/repository/bundle-trans.repository";
import { ErrorResponse } from "@xpparel/backend-utils";
import { FgBundleRepository } from "../entity/repository/fg-bundle.repository";
import { MoBundleRepository } from "../entity/repository/mo-bundle.repository";
import { OpReportingHelperService } from "./op-reporting-helper.service";
import { BundleTransEntity } from "../entity/bundle-trans.entity";
import { FgOpDepEntity } from "../entity/fg-op-dep.entity";
import { OperatorActivityEntity } from "../entity/operator-activity.entity";
import { Injectable } from "@nestjs/common";
import { OpSequenceOpsRepository } from "../entity/repository/op-sequence-ops.repository";
import { TranLogFgEntity } from "../entity/tran-log-fg.entity";
import { TranLogPublishEntity } from "../entity/tran-log-publish.entity";
import { TranLogPublishRepository } from "../entity/repository/tran-log-publish.repository";
import { Cron } from '@nestjs/schedule';
import { TranLogFgRepository } from "../entity/repository/tran-log-fg.repository";

@Injectable()
export class OpReportingPublishService {

    constructor(
        private dataSource: DataSource,
        private fgRepo: FgRepository,
        private fgOpDepRepo: FgOpDepRepository,
        private oslRepo: OslInfoRepository,
        private fgBundleRepo: FgBundleRepository,
        private opSeqOpgRepo: OpSequenceOpgRepository,
        private invReceivingRepo: InvReceivingRepository,
        private bunTranLogRepo: BundleTransRepository,
        private moBundleRepo: MoBundleRepository,
        private repHelperService: OpReportingHelperService,
        private opSeqOpsRepo: OpSequenceOpsRepository,
        private tranLogPublishRepo: TranLogPublishRepository,
        private tranLogFgRepo: TranLogFgRepository
    ) {
        
    }

    // Helper. Called after bundle / Fg scan. We will save those records which we are interested to send to ext systems
    async saveTranLogPublishRecord(tranLogId: number, system: PtsExtSystemNamesEnum, companyCode: string, unitCode: string, manager: GenericTransactionManager): Promise<boolean> {
        const ent = new TranLogPublishEntity();
        ent.extSystem = system;
        ent.tranLogId = tranLogId;
        ent.companyCode = companyCode;
        ent.unitCode = unitCode;
        await manager.getRepository(TranLogPublishEntity).save(ent, {reload: false});
        return false;
    }

    // called from SPS / PKMS
    async updateExtSystemAckStatusForTranLogId(req: PTS_C_TranLogIdPublishAckRequest): Promise<GlobalResponseObject> {
        const { companyCode, unitCode, extSystem, tranLogIds } = req;
        if(!extSystem) {
            throw new ErrorResponse(0, 'Ext system not provided');
        }
        if(tranLogIds.length > 0) {
            await this.tranLogPublishRepo.update({ tranLogId: In(tranLogIds), extSystem: extSystem, companyCode, unitCode }, { ack: true });
        }
        return new GlobalResponseObject(true, 0, `Tran log ack updated by `)
    }

    @Cron('*/1 * * * *')
    async publishOpReportingInfoToPkmsSystem(): Promise<GlobalResponseObject> {
        try {
            const pendingRecs = await this.tranLogPublishRepo.find({where: { ack: false, extSystem: PtsExtSystemNamesEnum.PKMS }, take: 500 });
            if(pendingRecs.length == 0) {
                return new GlobalResponseObject(true, 0, 'No Pending transactions found to report');
            }
            for(const rec of pendingRecs) {
                // will be a bull job in future
                const fgsForTran = await this.tranLogFgRepo.find({select: ['fgNumber'], where: { tranLogId: rec.tranLogId }});
                const tranLogRec = await this.bunTranLogRepo.findOne({select: ['pslId'], where: {companyCode: rec.companyCode, unitCode: rec.unitCode, id: rec.tranLogId}});
                const fgs = fgsForTran.map(r => r.fgNumber);
                await this.repHelperService.sendTranIdFgsToPkms(rec.tranLogId, fgs, tranLogRec.pslId, rec.companyCode, rec.unitCode, null);
                // await this.tranLogPublishRepo.update({ tranLogId: rec.tranLogId, extSystem: PtsExtSystemNamesEnum.PKMS, companyCode: rec.companyCode, unitCode: rec.unitCode }, { ack: true });
            }
            return new GlobalResponseObject(true, 0, 'Last operation info published to external system');
        } catch (error) {
            throw error;
        }
    }

    @Cron('*/1 * * * *')
    async publishOpReportingInfoToSpsSystem(): Promise<GlobalResponseObject> {
        try {
            const username = 'CRON';
            const pendingRecs = await this.tranLogPublishRepo.find({where: { ack: false, extSystem: PtsExtSystemNamesEnum.SPS }, take: 500 });
            if(pendingRecs.length == 0) {
                return new GlobalResponseObject(true, 0, 'No Pending transactions found to report');
            }
            for(const rec of pendingRecs) {
                // will be a bull job in future
                await this.repHelperService.sendTranIdRefToSps( [rec.tranLogId], rec.companyCode, rec.unitCode, username);
            }
            return new GlobalResponseObject(true, 0, 'Last operation info published to external system');
        } catch (error) {
            throw error;
        }
    }
}

