import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MrnHelperService } from './mrn-helper.service';
import { MrnInfoService } from './mrn-info.service';
import { MrnService } from './mrn.service';
import { MrnEntity } from './entity/mrn.entity';
import { MrnStatusHistoryEntity } from './entity/mrn-status-history.entity';
import { MrnItemRepository } from './repository/mrn-item.repository';
import { MrnRepository } from './repository/mrn.repository';
import { DocketGenerationModule } from '../docket-generation/docket-generation.module';
import { DocketMaterialModule } from '../docket-material/docket-material.module';
import { FabricRequestCreationService } from '@xpparel/shared-services';
import { MrnController } from './mrn.controller';
import { MrnItemEntity } from './entity/mrn-item.entity';
import { MrnStatusHistoryRepository } from './repository/mrn-status-history.repository';
import { LayReportingModule } from '../lay-reporting/lay-reporting.module';
import { CutGenerationModule } from '../cut-generation/cut-generation.module';
@Module({
    imports: [
        TypeOrmModule.forFeature([
           MrnEntity, MrnItemEntity, MrnStatusHistoryEntity
        ]),
        forwardRef(()=>DocketGenerationModule),
        forwardRef(()=>DocketMaterialModule),
        forwardRef(()=>LayReportingModule),
        forwardRef(()=>CutGenerationModule),
    ],
    controllers: [ MrnController ],
    providers: [
        MrnRepository, MrnItemRepository, MrnStatusHistoryRepository,
        MrnService, MrnInfoService, MrnHelperService,
        FabricRequestCreationService
    ],
    exports: [ MrnService, MrnInfoService, MrnHelperService ]
})
export class MrnModule { }