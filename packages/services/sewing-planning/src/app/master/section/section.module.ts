import { Module } from '@nestjs/common';
import { SectionService } from './section.service';
import { SectionController } from './section.controller';
import { SectionEntity } from './section.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SectionRepository } from './section.repository';
import { ModuleRepository } from '../module/repo/module-repo';
import { ModuleEntity } from '../module/module.entity';
import { WorkstationRepository } from '../workstation/workstation.repository';
import { WorkstationEntity } from '../workstation/workstation.entity';
import { SJobLinePlanRepo } from '../../entities/repository/s-job-line-plan.repository';
import { SJobLinePlanEntity } from '../../entities/s-job-line-plan';
import { SJobLineOperationsRepo } from '../../entities/repository/s-job-line-operations';
import { SJobLineOperationsEntity } from '../../entities/s-job-line-operations';
import { ForecastPlanningRepo } from '../../forecast-planning/forecast-planning.repository';
import { ForecastPlanEntity } from '../../forecast-planning/forecast-planning.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SectionEntity, ModuleEntity, WorkstationEntity, SJobLinePlanEntity, SJobLineOperationsEntity, ForecastPlanEntity])],
  providers: [SectionService,SectionRepository, ModuleRepository, WorkstationRepository, SJobLinePlanRepo, SJobLineOperationsRepo, ForecastPlanningRepo],
  controllers: [SectionController],
  exports: [SectionService]

})
export class SectionModule {}
