import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FgCreationController } from './fg-creation.controller';
import { FgCreationHelperService } from './fg-creation-helper.service';
import { BundleCreationService } from './bundle-creation.service';
import { JobCreationService } from './job-creation.service';
import { OpSequenceService } from './op-sequence.service';
import { ProcOrderCreationService } from './proc-order-creation.service';
import { FgCreationService } from './fg-creation.service';
import { FgEntity } from '../entity/fg.entity';
import { FgOpDepEntity } from '../entity/fg-op-dep.entity';
import { FgBundleEntity } from '../entity/fg-bundle.entity';
import { ProcOrderOslEntity } from '../entity/proc-order-osl.entity';
import { ProcOrderEntity } from '../entity/proc-order.entity';
import { OslInfoEntity } from '../entity/osl-info.entity';
import { OpSequenceOpgEntity } from '../entity/op-sequence-opg.entity';
import { FgRepository } from '../entity/repository/fg.repository';
import { FgOpDepRepository } from '../entity/repository/fg-op-dep.repository';
import { CutBundlingService, KnitOrderService, KnittingReportingService, MOConfigService, OrderCreationService, ProcessingJobsService, SewingProcessingOrderService } from '@xpparel/shared-services';
import { ProcOrderRepository } from '../entity/repository/proc-order.repository';
import { ProcOrderOslRepository } from '../entity/repository/proc-order-osl.repository';
import { OslInfoRepository } from '../entity/repository/osl-info.repository';
import { OpSequenceOpgRepository } from '../entity/repository/op-sequence-opg.repository';
import { MoBundleEntity } from '../entity/mo-bundle.entity';
import { MoBundleRepository } from '../entity/repository/mo-bundle.repository';
import { FgBundleRepository } from '../entity/repository/fg-bundle.repository';
import { OpSequenceOpsEntity } from '../entity/op-sequence-ops.entity';
import { OpSequenceRefEntity } from '../entity/op-sequence-ref.entity';
import { OpSequenceOpsRepository } from '../entity/repository/op-sequence-ops.repository';
import { OpSequenceRefRepository } from '../entity/repository/op-sequence-ref.repository';
import { MoActualBundleEntity } from '../entity/mo-actual-bundle.entity';
import { MoActualBundleParentEntity } from '../entity/mo-actual-bundle-parent.entity';
import { MoActualBundleSProcEntity } from '../entity/mo-actual-bundle-sproc.entity';
import { MoActualBundleRepository } from '../entity/repository/mo-actual-bundle.repository';
import { MoActualBundleParentRepository } from '../entity/repository/mo-actual-bundle-parent.repository';
import { MoActualBundleSProcRepository } from '../entity/repository/mo-actual-bundle-sproc.repository';
import { ActualBundleCreationService } from './actual-bundle-creation.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            MoBundleEntity,
            FgEntity, FgOpDepEntity, FgBundleEntity, 
            ProcOrderOslEntity, ProcOrderEntity, OslInfoEntity,
            OpSequenceOpgEntity, OpSequenceOpsEntity, OpSequenceRefEntity,
            MoActualBundleEntity, MoActualBundleParentEntity, MoActualBundleSProcEntity
        ]),
    ],
    providers: [
        MoBundleRepository,
        FgRepository, FgOpDepRepository, FgBundleRepository,
        ProcOrderRepository, ProcOrderOslRepository, OslInfoRepository,
        OpSequenceOpgRepository, OpSequenceOpsRepository, OpSequenceRefRepository,
        MoActualBundleRepository, MoActualBundleParentRepository, MoActualBundleSProcRepository,
        OrderCreationService, KnitOrderService, SewingProcessingOrderService, MOConfigService, 
        FgCreationService, FgCreationHelperService, BundleCreationService, JobCreationService, OpSequenceService, ProcOrderCreationService,
        ProcessingJobsService, CutBundlingService, KnittingReportingService,
        ActualBundleCreationService
    ],
    controllers: [FgCreationController],
    exports: [FgCreationService, FgCreationHelperService]
})
export class FgCreationModule {}

