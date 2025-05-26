import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocketPlanningHelperService } from './docket-planning-helper.service';
import { DocketPlanningInfoService } from './docket-planning-info.service';
import { DocketPlanningService } from './docket-planning.service';
import { PoDocketCutTableEntity } from './entity/po-docket-cut-table.entity';
import { PoDocketCutTableHistoryEntity } from './entity/po-docket-cut-table-history.entity';
import { PoDocketCutTableHistroyRepository } from './repository/po-docket-cut-table-history.repository';
import { PoDocketCutTableRepository } from './repository/po-docket-cut-table.repository';
import { DocketGenerationModule } from '../docket-generation/docket-generation.module';
import { DocketMaterialModule } from '../docket-material/docket-material.module';
import { CutTableModule } from '../master/cut-table/cut-table.module';
import { FabricRequestCreationService } from '@xpparel/shared-services';
import { DocketPlanningController } from './docket-planning.controller';import { PoDocketMaterialRepository } from '../docket-material/repository/po-docket-material.repository';
@Module({
    imports: [
        TypeOrmModule.forFeature([
           PoDocketCutTableEntity, PoDocketCutTableHistoryEntity
        ]),
        forwardRef(()=>DocketGenerationModule),
        forwardRef(()=>DocketMaterialModule),
        forwardRef(()=>CutTableModule),
    ],
    controllers: [DocketPlanningController],
    providers: [
        PoDocketCutTableHistroyRepository, PoDocketCutTableRepository,
        DocketPlanningService, DocketPlanningHelperService, DocketPlanningInfoService,
        FabricRequestCreationService, PoDocketMaterialRepository
    ],
    exports: [DocketPlanningService, DocketPlanningHelperService, DocketPlanningInfoService]
})
export class DocketPlanningModule { }