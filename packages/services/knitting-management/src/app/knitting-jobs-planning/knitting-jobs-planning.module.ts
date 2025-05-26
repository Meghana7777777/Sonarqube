import { forwardRef, Module } from '@nestjs/common';
import { KnittingJobsPlanningService } from './knitting-jobs-planning.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KnittingJobsPlanningController } from './knitting-jobs-planning.controller';
import { PoKnitJobPlanRepository } from '../common/repository/po-knit-job-plan.repo';
import { PoKnitJobPlanHistoryRepository } from '../common/repository/po-knit-job-plan-history.repo';
import { PoKnitJobPlanEntity } from '../common/entities/po-knit-job-plan-entity';
import { PoKnitJobPlanHistoryEntity } from '../common/entities/po-knit-job-plan-history-entity';
import { PoProductRepository } from '../common/repository/po-product.repo';
import { PoKnitJobRepository } from '../common/repository/po-knit-job.repo';
import { PoKnitJobLineRepository } from '../common/repository/po-knit-job-line.repo';
import { PoKnitJobSubLineRepository } from '../common/repository/po-knit-job-sub-line.repo';
import { KnittingJobsModule } from '../knitting-jobs/knitting-jobs.module';
import { PoKnitJobQtyRepository } from '../common/repository/po-knit-job-quantity.repo';

@Module({
  imports: [
    forwardRef(() => KnittingJobsModule),
      TypeOrmModule.forFeature([
        PoKnitJobPlanEntity,PoKnitJobPlanHistoryEntity
    ]),
  ],
  providers: [KnittingJobsPlanningService,PoKnitJobPlanRepository,PoKnitJobPlanHistoryRepository,PoProductRepository,PoKnitJobRepository,PoKnitJobLineRepository,PoKnitJobSubLineRepository, PoKnitJobQtyRepository],
  controllers: [KnittingJobsPlanningController]
})
export class KnittingJobsPlanningModule {}
