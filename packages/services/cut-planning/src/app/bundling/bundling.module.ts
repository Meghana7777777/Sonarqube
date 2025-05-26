import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BundlingService } from './bundling.service';
import { BundlingInfoService } from './bundling-info.service';
import { BundlingHelperService } from './bundling-helper.service';
import { DocketGenerationModule } from '../docket-generation/docket-generation.module';
import { LayReportingModule } from '../lay-reporting/lay-reporting.module';
import { CutReportingModule } from '../cut-reporting/cut-reporting.module';
import { CutGenerationModule } from '../cut-generation/cut-generation.module';
import { CutOrderService, EmbRequestHandlingService, EmbTrackingService, FgCreationService, InvCreationService, PoMaterialService, POService, VendorService } from '@xpparel/shared-services';
import { BundlingController } from './bundling.controller';
import { PoBundlingEntity } from './entity/po-bundling.entity';
import { ActualPbEntity } from './entity/actual-pb.entity';
import { PoBundlingRepository } from './repository/po-bundling.repo';
import { ActualPbRepository } from './repository/actual-pb.repository';
import { PoSubLineBundleEntity } from '../common/entity/po-sub-line-bundle.entity';
import { PoSubLineBundleRepository } from '../common/repository/po-sub-line-bundle.repo';
import { PoDocketPanelRepository } from '../docket-generation/repository/po-docket-panel.repository';
import { PslInfoRepository } from '../common/repository/psl-info.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            PoBundlingEntity, ActualPbEntity, PoSubLineBundleEntity
        ]),
        forwardRef(()=>DocketGenerationModule),
        forwardRef(()=>LayReportingModule),
        forwardRef(()=>CutReportingModule),
        forwardRef(()=>CutGenerationModule),
    ],
    controllers: [BundlingController],
    providers: [
        PoBundlingRepository, ActualPbRepository, PoSubLineBundleRepository,
        BundlingInfoService, BundlingHelperService, BundlingService, 
        InvCreationService,PoDocketPanelRepository,VendorService,POService,EmbTrackingService,EmbRequestHandlingService,CutOrderService,PslInfoRepository, PoMaterialService, FgCreationService
    ],
    exports: [ BundlingInfoService, BundlingHelperService, BundlingService ]
})
export class BundlingModule { }