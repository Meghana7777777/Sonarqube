import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CutGenerationService } from './cut-generation.service';
import { CutGenerationInfoService } from './cut-generation-info.service';
import { CutGenerationHelperService } from './cut-generation-helper.service';
import { BullQueueModule } from '../bull-queue/bull-queue.module';
import { DocketMaterialModule } from '../docket-material/docket-material.module';
import { PoCutDocketEntity } from './entity/po-cut-docket.entity';
import { PoCutEntity } from './entity/po-cut.entity';
import { CutGenerationController } from './cut-generation.controller';
import { PoCutRepository } from './repository/po-cut.repository';
import { PoCutDocketRepository } from './repository/po-cut-docket.repository';
import { DocketGenerationModule } from '../docket-generation/docket-generation.module';
import { LayReportingModule } from '../lay-reporting/lay-reporting.module';
import { CutDispatchModule } from '../cut-dispatch/cut-dispatch.module';
@Module({
    imports: [
        TypeOrmModule.forFeature([
            PoCutEntity, PoCutDocketEntity
        ]),
        forwardRef(() => BullQueueModule),
        forwardRef(() => DocketMaterialModule),
        forwardRef(() => DocketGenerationModule),
        forwardRef(() => LayReportingModule),
        forwardRef(() => CutDispatchModule),
    ],
    controllers: [CutGenerationController],
    providers: [CutGenerationService, CutGenerationInfoService, CutGenerationHelperService, PoCutRepository, PoCutDocketRepository],
    exports: [CutGenerationService, CutGenerationInfoService, CutGenerationHelperService]
})
export class CutGenerationModule { }