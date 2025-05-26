import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocketMaterialController } from './docket-material.controller';
import { PoMaterialRequestRepository } from './repository/po-material-request.repository';
import { PoDocketMaterialEntity } from './entity/po-docket-material.entity';
import { PoMaterialRequestEntity } from './entity/po-material-request.entity';
import { PoDocketMaterialRequestEntity } from './entity/po-docket-material-request.entity';
import { DocketMaterialService } from './docket-material.service';
import { DocketMaterialHelperService } from './docket-material-helper.service';
import { DocketMaterialInfoService } from './docket-material-info.service';
import { PoDocketMaterialRepository } from './repository/po-docket-material.repository';
import { RollAttrRepository } from '../common/repository/roll-attr.repository';
import { RollAttrEntity } from '../common/entity/roll-attr.entity';
import { PoDocketMaterialRequestRepository } from './repository/po-docket-material-request.repository';
import { LocationAllocationService, POService, PackingListService, PoMarkerService, TrayTrolleyService } from '@xpparel/shared-services';
import { PoMaterialLockEntity } from './entity/po-material-lock.entity';
import { PoMaterialLockRepository } from './repository/po-material-lock.repository';
import { BullQueueModule } from '../bull-queue/bull-queue.module';
import { OnFloorRollsRepository } from './repository/on-floor-rolls.repository';
import { OnFloorRollsEntity } from './entity/on-floor-rolls.entity';
import { DocketGenerationModule } from '../docket-generation/docket-generation.module';
import { DocketPlanningModule } from '../docket-planning/docket-planning.module';
import { LayReportingModule } from '../lay-reporting/lay-reporting.module';
import { CutGenerationModule } from '../cut-generation/cut-generation.module';
import { MrnModule } from '../mrn/mrn.module';
import { ActualMarkerEntity } from './entity/actual-marker.entity';
import { ActualMarkerRepository } from './repository/actual-marker.repository';
@Module({
    imports: [
        TypeOrmModule.forFeature([
           PoMaterialRequestEntity, PoDocketMaterialEntity, PoDocketMaterialRequestEntity, RollAttrEntity, PoMaterialLockEntity, OnFloorRollsEntity, ActualMarkerEntity
        ]),
        forwardRef(() => BullQueueModule),
        forwardRef(() => DocketGenerationModule),
        forwardRef(() => CutGenerationModule),
        forwardRef(() => DocketPlanningModule),
        forwardRef(() => LayReportingModule),
        forwardRef(() => MrnModule),
    ],
    controllers: [DocketMaterialController],
    providers: [DocketMaterialService, DocketMaterialHelperService, DocketMaterialInfoService, PoDocketMaterialRequestRepository, PoMaterialRequestRepository, PoDocketMaterialRepository, RollAttrRepository, PackingListService, PoMaterialLockRepository, OnFloorRollsRepository, POService, ActualMarkerRepository,TrayTrolleyService, LocationAllocationService, PoMarkerService],
    exports: [DocketMaterialService, DocketMaterialHelperService, DocketMaterialInfoService]
})
export class DocketMaterialModule { }