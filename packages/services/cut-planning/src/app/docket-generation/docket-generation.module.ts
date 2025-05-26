import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocketGenerationController } from './docket-generation.controller';
import { DocketGenerationService } from './docket-generation.service';
import { DocketGenerationInfoService } from './docket-generation-info.service';
import { DocketGenerationHelperService } from './docket-generation-helper.service';
import { PoDocketEntity } from './entity/po-docket.entity';
import { PoDocketGroupEntity } from './entity/po-docket-group.entity';
import { PoDocketBundleEntity } from './entity/po-docket-bundle.entity';
import { PoDocketPanelEntity } from './entity/po-docket-panel.entity';
import { PoDocketGroupRepository } from './repository/po-docket-group.repository';
import { PoDocketRepository } from './repository/po-docket.repository';
import { PoDocketBundleRepository } from './repository/po-docket-bundle.repository';
import { PoDocketPanelRepository } from './repository/po-docket-panel.repository';
import { PoRatioAttrEntity } from '../common/entity/po-ratio-attr.entity';
import { PoRatioAttrRepository } from '../common/repository/po-ratio-attr.repository';
import { CutOrderService, EtsBullQueueService, OpVersionService, OrderManipulationServices, POService, PoMarkerService, PoMaterialService, PoRatioService } from '@xpparel/shared-services';
import { PoDocketSerialsEntity } from './entity/po-docket-serials.entity';
import { PoDocketSerialRepository } from './repository/po-docket-serial.repository';
import { BullQueueModule } from '../bull-queue/bull-queue.module';
import { PoDocketAttrRepository } from './repository/po-docket-attr.repository';
import { PoDocketAttrEntity } from './entity/po-docket-attr.entity';
import { DocketMaterialModule } from '../docket-material/docket-material.module';
import { PoComponentSerialsEntity } from './entity/po-component-serials.entity';
import { PoComponentSerialsRepository } from './repository/po-component-serial.repository';
import { CutGenerationModule } from '../cut-generation/cut-generation.module';
import { LayReportingModule } from '../lay-reporting/lay-reporting.module';
import { RemarksPoDocketRepository } from './repository/remarks-po docket.repository';
import { DocketPlanningModule } from '../docket-planning/docket-planning.module';
import { PoDocketBundlePslEntity } from './entity/po-docket-bundle-psl.entity';
import { PoDocketPslEntity } from './entity/po-docket-psl.entity';
import { PoDocketPslRepository } from './repository/po-docket-psl.repository';
import { PoDocketBundlePslRepository } from './repository/po-docket-bundle-psl.repository';
import { PslInfoRepository } from '../common/repository/psl-info.repository';
@Module({
    imports: [
        TypeOrmModule.forFeature([
            PoDocketEntity, PoDocketGroupEntity, PoDocketBundleEntity, PoDocketPanelEntity, PoRatioAttrEntity, PoDocketSerialsEntity, PoDocketAttrEntity, PoComponentSerialsEntity, PoDocketBundlePslEntity, PoDocketPslEntity
        ]),
        forwardRef(() => BullQueueModule),
        forwardRef(() => DocketMaterialModule),
        forwardRef(() => CutGenerationModule),
        forwardRef(() => LayReportingModule),
        forwardRef(() => DocketPlanningModule),
        
    ],
    controllers: [DocketGenerationController],
    providers: [
        DocketGenerationService, DocketGenerationInfoService, DocketGenerationHelperService, PoDocketGroupRepository, PoDocketRepository, PoDocketBundleRepository, PoDocketSerialRepository, PoDocketPanelRepository, PoRatioAttrRepository, PoDocketAttrRepository, PoComponentSerialsRepository, PoDocketPslRepository, PoDocketBundlePslRepository, 
        PoRatioService, PoDocketSerialRepository, PoMaterialService, POService, PoMarkerService,
        EtsBullQueueService, OpVersionService, OrderManipulationServices,RemarksPoDocketRepository,CutOrderService, PslInfoRepository
    ],
    exports: [DocketGenerationService, DocketGenerationInfoService, DocketGenerationHelperService]
})
export class DocketGenerationModule { }
