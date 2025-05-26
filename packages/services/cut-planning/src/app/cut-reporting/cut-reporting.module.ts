import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CutReportingController } from './cut-reporting.controller';
import { CutReportingHelperService } from './cut-reporting-helper.service';
import { CutReportingInfoService } from './cut-reporting-info.service';
import { CutReportingService } from './cut-reporting.service';
import { DocketGenerationModule } from '../docket-generation/docket-generation.module';
import { DocketMaterialModule } from '../docket-material/docket-material.module';
import { CutTableModule } from '../master/cut-table/cut-table.module';
import { EtsBullQueueService, FabricRequestCreationService, PackingListService, PoMaterialService } from '@xpparel/shared-services';
import { PoDocketCutAttrEntity } from './entity/po-docket-cut-attr.entity';
import { PoAdbRollEntity } from './entity/po-adb-roll.entity';
import { PoAdbEntity } from './entity/po-adb.entity';
import { PoAdbRollRepository } from './repository/po-adb-roll.repository';
import { PoAdbRepository } from './repository/po-adb.repository';
import { LayReportingModule } from '../lay-reporting/lay-reporting.module';
import { BullQueueModule } from '../bull-queue/bull-queue.module';
import { PoAdbShadeEntity } from './entity/po-adb-shade.entity';
import { PoAdbShadeRepository } from './repository/po-adb-shade.repository';
import { PoAdbComponentEntity } from './entity/po-adb-component.entity';
import { PoAdbComponentRepository } from './repository/po-adb-component.repository';
import { PoActualDocketPanelEntity } from './entity/po-actual-docket-panel.entity';
import { PoActualDocketPanelRepository } from './repository/po-actual-docket-bundle.repository';
import { DocketPlanningModule } from '../docket-planning/docket-planning.module';
import { PoDocketLayShadeRepository } from '../lay-reporting/repository/po-docket-lay-shade.repository';
import { PoDocketLayShadeEntity } from '../lay-reporting/entity/po-docket-lay-shade.entity';
@Module({
    imports: [
        TypeOrmModule.forFeature([
            PoDocketCutAttrEntity, PoAdbEntity , PoAdbRollEntity, PoAdbShadeEntity, PoAdbComponentEntity, PoActualDocketPanelEntity, PoDocketLayShadeEntity
        ]),
        forwardRef(()=>DocketGenerationModule),
        forwardRef(()=>DocketMaterialModule),
        forwardRef(()=>CutTableModule),
        forwardRef(()=>LayReportingModule),
        forwardRef(()=>BullQueueModule),
        forwardRef(()=>DocketPlanningModule),
    ],
    controllers: [CutReportingController],
    providers: [
        CutReportingService, CutReportingHelperService, CutReportingInfoService,
        FabricRequestCreationService, PoAdbRollRepository, PoAdbRepository, PoAdbShadeRepository, PoAdbComponentRepository, PoActualDocketPanelRepository,
        PackingListService, EtsBullQueueService,PoDocketLayShadeRepository, PoMaterialService
    ],
    exports: [CutReportingService, CutReportingHelperService, CutReportingInfoService]
})
export class CutReportingModule { }