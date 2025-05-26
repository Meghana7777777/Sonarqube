import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CutDispatchController } from './cut-dispatch.controller';
import { CutDispatchService } from './cut-dispatch.service';
import { CutDispatchInfoService } from './cut-dispatch-info.service';
import { CutDispatchHelperService } from './cut-dispatch-helper.service';
import { CutDispatchHeaderEntity } from './entity/cut-dispatch-header.entity';
import { CutDispatchLineEntity } from './entity/cut-dispatch-line.entity';
import { CutDispatchProgressEntity } from './entity/cut-dispatch-progress.entity';
import { CutDisptachHeaderRepository } from './repository/cut-dispatch-header.repository';
import { CutDispatchLineRepository } from './repository/cut-dispatch-line.repository';
import { CutDispatchProgressRepository } from './repository/cut-dispatch-progress.repository';
import { DocketGenerationModule } from '../docket-generation/docket-generation.module';
import { LayReportingModule } from '../lay-reporting/lay-reporting.module';
import { CutReportingModule } from '../cut-reporting/cut-reporting.module';
import { CutGenerationModule } from '../cut-generation/cut-generation.module';
import { CutDispatchVehicleEntity } from './entity/cut-dispatch-vehicle.entity';
import { CutDispatchVehicleRepository } from './repository/cut-dipatch-vehicle.repository';
import { CutOrderService, EmbRequestHandlingService, EmbTrackingService, POService, VendorService } from '@xpparel/shared-services';
import { CutDispatchAttrEntity } from './entity/cut-dispatch-attr.entity';
import { CutDispatchAttrRepository } from './repository/cut-dispatch-attr.repository';
import { CutDispatchSubLineEntity } from './entity/cut-dispatch-sub-line.entity';
import { CutDispatchSubLineRepository } from './repository/cut-dispatch-sub-line.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            CutDispatchHeaderEntity, CutDispatchLineEntity, CutDispatchProgressEntity, CutDispatchVehicleEntity, CutDispatchAttrEntity, CutDispatchSubLineEntity
        ]),
        forwardRef(()=>DocketGenerationModule),
        forwardRef(()=>LayReportingModule),
        forwardRef(()=>CutReportingModule),
        forwardRef(()=>CutGenerationModule),
    ],
    controllers: [CutDispatchController],
    providers: [
        CutDisptachHeaderRepository, CutDispatchLineRepository, CutDispatchProgressRepository, CutDispatchVehicleRepository, CutDispatchAttrRepository, CutDispatchSubLineRepository,
        CutDispatchService, CutDispatchInfoService, CutDispatchHelperService,
        VendorService, POService, EmbTrackingService, EmbRequestHandlingService,
        CutOrderService
    ],
    exports: [ CutDispatchService, CutDispatchInfoService, CutDispatchHelperService ]
})
export class CutDispatchModule { }