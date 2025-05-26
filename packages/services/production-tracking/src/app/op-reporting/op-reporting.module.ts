import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FgEntity } from '../entity/fg.entity';
import { FgOpDepEntity } from '../entity/fg-op-dep.entity';
import { FgBundleEntity } from '../entity/fg-bundle.entity';
import { ProcOrderOslEntity } from '../entity/proc-order-osl.entity';
import { ProcOrderEntity } from '../entity/proc-order.entity';
import { OslInfoEntity } from '../entity/osl-info.entity';
import { OpSequenceOpgEntity } from '../entity/op-sequence-opg.entity';
import { FgRepository } from '../entity/repository/fg.repository';
import { FgOpDepRepository } from '../entity/repository/fg-op-dep.repository';
import { OslInfoRepository } from '../entity/repository/osl-info.repository';
import { OpSequenceOpgRepository } from '../entity/repository/op-sequence-opg.repository';
import { FgBundleRepository } from '../entity/repository/fg-bundle.repository';
import { OpSequenceOpsEntity } from '../entity/op-sequence-ops.entity';
import { OpSequenceRefEntity } from '../entity/op-sequence-ref.entity';
import { InvReceivingRepository } from '../entity/repository/inv-receiving.repository';
import { InvReceivingEntity } from '../entity/inv-receiving.entity';
import { OperatorActivityEntity } from '../entity/operator-activity.entity';
import { BundleTransEntity } from '../entity/bundle-trans.entity';
import { BundleTransRepository } from '../entity/repository/bundle-trans.repository';
import { OpReportingController } from './op-reporting.controller';
import { OpReportingHelperService } from './op-reporting-helper.service';
import { OpReportingInfoService } from './op-reporting-info.service';
import { OpReportingService } from './op-reporting.service';
import { OpSequenceRefRepository } from '../entity/repository/op-sequence-ref.repository';
import { OpSequenceOpsRepository } from '../entity/repository/op-sequence-ops.repository';
import { MoBundleRepository } from '../entity/repository/mo-bundle.repository';
import { TranLogFgEntity } from '../entity/tran-log-fg.entity';
import { TranLogFgRepository } from '../entity/repository/tran-log-fg.repository';
import { PreIntegrationServicePKMS, ProcessingJobsService } from '@xpparel/shared-services';
import { OpReportingPublishService } from './op-reporting-publish.service';
import { TranLogPublishRepository } from '../entity/repository/tran-log-publish.repository';
import { TranLogPublishEntity } from '../entity/tran-log-publish.entity';
import { OperatorActivityRepository } from '../entity/repository/operator-activity.repository';
import { QMSTransLogEntity } from '../entity/qms-trans-log.entity';
import { QMSTransLogRepository } from '../entity/repository/qms-trans-log.repository';
import { MoActualBundleParentRepository } from '../entity/repository/mo-actual-bundle-parent.repository';
import { MoActualBundleSProcRepository } from '../entity/repository/mo-actual-bundle-sproc.repository';
import { MoActualBundleRepository } from '../entity/repository/mo-actual-bundle.repository';
import { MoActualBundleEntity } from '../entity/mo-actual-bundle.entity';
import { MoActualBundleSProcEntity } from '../entity/mo-actual-bundle-sproc.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            FgEntity, FgOpDepEntity, FgBundleEntity, 
            ProcOrderOslEntity, ProcOrderEntity, OslInfoEntity,
            OpSequenceOpgEntity, OpSequenceOpsEntity, OpSequenceRefEntity, TranLogFgEntity,
            InvReceivingEntity, OperatorActivityEntity, BundleTransEntity,
            TranLogPublishEntity, OperatorActivityEntity,QMSTransLogEntity,
            MoActualBundleEntity, MoActualBundleSProcEntity
        ]),
    ],
    providers: [
        FgOpDepRepository, FgRepository, FgBundleRepository, OslInfoRepository, OpSequenceOpgRepository,
        InvReceivingRepository, OpSequenceRefRepository, OpSequenceOpsRepository, MoBundleRepository,
        BundleTransRepository, TranLogFgRepository, 
        TranLogPublishRepository,
        OpReportingHelperService, OpReportingInfoService, OpReportingService,
        ProcessingJobsService, OpReportingPublishService, PreIntegrationServicePKMS,
        OperatorActivityRepository,QMSTransLogRepository,
        MoActualBundleRepository, MoActualBundleSProcRepository
    ],
    controllers: [OpReportingController],
    exports: [OpReportingHelperService, OpReportingInfoService, OpReportingService]
})
export class OpReportingModule {}
