import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LayReportingHelperService } from './lay-reporting-helper.service';
import { LayReportingInfoService } from './lay-reporting-info.service';
import { LayReportingService } from './lay-reporting.service';
import { DocketGenerationModule } from '../docket-generation/docket-generation.module';
import { DocketMaterialModule } from '../docket-material/docket-material.module';
import { CutTableModule } from '../master/cut-table/cut-table.module';
import { CutOrderService, FabricRequestCreationService, OrderManipulationServices, POService, PackingListService, ReasonsService } from '@xpparel/shared-services';
import { PoDocketLayEntity } from './entity/po-docket-lay.entity';
import { PoDocketLayItemEntity } from './entity/po-docket-lay-item.entity';
import { PoDocketLayDowntimeEntity } from './entity/po-docket-lay-downtime.entity';
import { PoDocketLayRepository } from './repository/po-docket-lay.repository';
import { PoDocketLayItemRepository } from './repository/po-docket-lay-item.repository';
import { PoDocketLayDowntimeRepository } from './repository/po-docket-lay-downtime.repository';
import { LayReportingController } from './lay-reporting.controller';
import { PoDocketLayBundlePrintRepository } from './repository/po-docket-lay-bundle-print.repository';
import { PoDocketLayBundlePrintEntity } from './entity/po-docket-lay-bundle-print.entity';
import { CutReportingModule } from '../cut-reporting/cut-reporting.module';
import { CutDispatchModule } from '../cut-dispatch/cut-dispatch.module';
import { CutGenerationModule } from '../cut-generation/cut-generation.module';
import { MrnModule } from '../mrn/mrn.module';
import { PoDocketMaterialRepository } from '../docket-material/repository/po-docket-material.repository';
import { DocketPlanningInfoService } from '../docket-planning/docket-planning-info.service';
import { DocketPlanningHelperService } from '../docket-planning/docket-planning-helper.service';
import { PoDocketCutTableRepository } from '../docket-planning/repository/po-docket-cut-table.repository';
import { PoDocketLayShadeEntity } from './entity/po-docket-lay-shade.entity';
import { CutGenerationInfoService } from '../cut-generation/cut-generation-info.service';
import { PoCutRepository } from '../cut-generation/repository/po-cut.repository';
import { PoCutDocketRepository } from '../cut-generation/repository/po-cut-docket.repository';
@Module({
    imports: [
        TypeOrmModule.forFeature([
           PoDocketLayEntity, PoDocketLayItemEntity, PoDocketLayDowntimeEntity, PoDocketLayBundlePrintEntity, PoDocketLayShadeEntity
        ]),
        forwardRef(()=>DocketGenerationModule),
        forwardRef(()=>DocketMaterialModule),
        forwardRef(()=>CutTableModule),
        forwardRef(()=>CutReportingModule),
        forwardRef(() => CutDispatchModule),
        forwardRef(() => CutGenerationModule),
        forwardRef(() => MrnModule),
    ],
    controllers: [LayReportingController],
    providers: [
        PoDocketLayRepository, PoDocketLayItemRepository, PoDocketLayDowntimeRepository,PoDocketLayBundlePrintRepository,
        LayReportingService, LayReportingHelperService, LayReportingInfoService, PoDocketMaterialRepository,
        FabricRequestCreationService, PackingListService, POService, ReasonsService, OrderManipulationServices, DocketPlanningInfoService , DocketPlanningHelperService, PoDocketCutTableRepository,CutGenerationInfoService,PoCutRepository,PoCutDocketRepository,CutOrderService
    ],
    exports: [LayReportingService, LayReportingHelperService, LayReportingInfoService]
})
export class LayReportingModule { }