import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { SewingJobPlanningController } from './sewing-job-planning.controller';
import { SewingJobPlanningService } from './sewing-job-planning.service';
import { SJobLinePlanRepo } from '../entities/repository/s-job-line-plan.repository';
import { SJobLinePlanEntity } from '../entities/s-job-line-plan';
import { SJobLineOperationsRepo } from '../entities/repository/s-job-line-operations';
import { SJobHeaderEntity } from '../entities/s-job-header.entity';
import { SJobLineEntity } from '../entities/s-job-line.entity';
//import { SJobLinePlanLogEntity } from '../entities/s-job-line-plan-log.entity';
//import { SJobLinePlanLogRepo } from '../entities/repository/s-job-line-plan-log.repository';
import { InputPlanningDashboardService } from './input-planning-dashboard.service';
import { ModuleRepository } from '../master/module/repo/module-repo';
import { WsDownTimeRepo } from '../entities/repository/ws-downtime.repository';
import { ModuleEntity } from '../master/module/module.entity';
import { WsDowntimeEntity } from '../entities/ws-downtime';
import { SectionRepository } from '../master/section/section.repository';
import { SectionEntity } from '../master/section/section.entity';
import { SJobBundleEntity } from '../entities/s-job-bundle.entity';
import { SewingJobGenActualService } from '@xpparel/shared-services';
import { WorkstationRepository } from '../master/workstation/workstation.repository';
import { WorkstationEntity } from '../master/workstation/workstation.entity';
import { SewingJobGenerationModule } from '../sewing-job-generation/sewing-job-generation.module';
import { SewingJobGenerationServiceForMO } from '../sewing-job-generation/sewing-job-generation-for-mo.service';
import { BarcodeQualityResultsRepo } from '../entities/repository/barcode-quality-details.repo';
import { BarcodeQualityResultsEntity } from '../entities/barcode-quality-results.entity';
import { SJobSubLineRepo } from '../entities/repository/s-job-sub-line.repository';
import { SJobLinePlanHistoryEntity } from '../entities/s-job-line-plan-history';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([SJobLinePlanEntity, SJobHeaderEntity, SJobLineEntity, ModuleEntity, WsDowntimeEntity, SectionEntity, SJobBundleEntity, WorkstationEntity, BarcodeQualityResultsEntity]),
    forwardRef(() => SewingJobGenerationModule),
  ],
  controllers: [SewingJobPlanningController],
  providers: [SewingJobPlanningService,InputPlanningDashboardService, SJobLinePlanRepo, SJobLineOperationsRepo, ModuleRepository, WsDownTimeRepo, SectionRepository, SewingJobGenActualService, WorkstationRepository, BarcodeQualityResultsRepo, SJobSubLineRepo],
  exports: [SewingJobPlanningService, InputPlanningDashboardService],
})
export class SewingJobPlanningModule {}
