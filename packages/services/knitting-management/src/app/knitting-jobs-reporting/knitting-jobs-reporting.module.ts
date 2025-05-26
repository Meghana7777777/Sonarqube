import { forwardRef, Module } from '@nestjs/common';
import { KnittingJobsReportingService } from './knitting-jobs-reporting.service';
import { KnittingJobsReportingController } from './knitting-jobs-reporting.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KnittingOrderBundlingService } from './knitting-order-bundling.service';
import { KnittingOrderBundlingInfoService } from './knitting-order-bundling-info.service';
import { KnittingJobsReportingHelperService } from './knitting-job-rep-helper.service';
import { PoJobPslMapRepository } from '../common/repository/po-job-psl-map.repo';
import { PoKnitGroupRepository } from '../common/repository/po-knit-group.repo';
import { PoKnitJobLineRepository } from '../common/repository/po-knit-job-line.repo';
import { PoKnitJobPlanRepository } from '../common/repository/po-knit-job-plan.repo';
import { PoKnitJobPslRepository } from '../common/repository/po-knit-job-psl.repo';
import { PoKnitJobRepLogRepository } from '../common/repository/po-knit-job-rep-log.repo';
import { PoKnitJobRepository } from '../common/repository/po-knit-job.repo';
import { PoProductRepository } from '../common/repository/po-product.repo';
import { PoSubLineBundleRepository } from '../common/repository/po-sub-line-bundle.repo';
import { PoSubLineRepository } from '../common/repository/po-sub-line.repo';
import { PoBundlingRepository } from '../common/repository/po-bundling.repo';
import { KnittingConfigurationModule } from '../knitting-configuration/knitting-configuration.module';
import { PoBundlingEntity } from '../common/entities/po-bundling.entity';
import { PoJobPslMapEntity } from '../common/entities/po-job-psl-map-entity';
import { PoKnitGroupEntity } from '../common/entities/po-knit-group-entity';
import { PoKnitJobEntity } from '../common/entities/po-knit-job-entity';
import { PoKnitJobLineEntity } from '../common/entities/po-knit-job-line-entity';
import { PoKnitJobPlanEntity } from '../common/entities/po-knit-job-plan-entity';
import { PoKnitJobPslEntity } from '../common/entities/po-knit-job-psl-entity';
import { PoKnitJobRepLogEntity } from '../common/entities/po-knit-job-rep-log.entity';
import { PoProductEntity } from '../common/entities/po-product-entity';
import { PoSubLineBundleEntity } from '../common/entities/po-sub-line-bundle.entity';
import { PoSubLineEntity } from '../common/entities/po-sub-line-entity';
import { PoKnitJobSubLineEntity } from '../common/entities/po-knit-job-sub-line-entity';
import { PoKnitJobSubLineRepository } from '../common/repository/po-knit-job-sub-line.repo';
import { PoKnitJobRatioEntity } from '../common/entities/po-knit-job-ratio-entity';
import { PoKnitJobRatioRepository } from '../common/repository/po-knit-job-ratio.repo';
import { PoKnitJobRatioLineEntity } from '../common/entities/po-knit-job-ratio-line-entity';
import { PoKnitJobRatioLineRepository } from '../common/repository/po-knit-job-ratio-line.repo';
import { InvCreationService } from '@xpparel/shared-services';
import { PoKnitJobQtyRepository } from '../common/repository/po-knit-job-quantity.repo';
import { PoKnitJobQtyEntity } from '../common/entities/po-knit-job-quantity-entity';
import { PoBundlingDepMapRepository } from '../common/repository/po-bundling-dep-map.repository';
import { PoBundlingDepMap } from '../common/entities/po-bundling-dep-map.entity';

@Module({
  imports: [
    forwardRef(() => KnittingConfigurationModule),
    TypeOrmModule.forFeature([
      PoKnitJobPslEntity, PoKnitJobRepLogEntity, PoJobPslMapEntity, PoSubLineBundleEntity, 
      PoKnitGroupEntity, PoSubLineEntity, PoProductEntity, PoKnitJobPlanEntity, PoKnitJobEntity, PoKnitJobLineEntity, PoKnitJobSubLineEntity,
      PoBundlingEntity, PoKnitJobQtyEntity,
      PoKnitJobRatioEntity, PoKnitJobRatioLineEntity,PoBundlingDepMap
    ]),
  ],
  providers: [
    PoKnitJobPslRepository, PoKnitJobRepLogRepository, PoJobPslMapRepository, PoSubLineBundleRepository, 
    PoKnitGroupRepository, PoSubLineRepository, PoProductRepository, PoKnitJobPlanRepository, PoKnitJobRepository, PoKnitJobLineRepository,
    PoBundlingRepository, PoKnitJobSubLineRepository,
    PoKnitJobRatioRepository, PoKnitJobRatioLineRepository, PoKnitJobQtyRepository,
    KnittingJobsReportingService, KnittingOrderBundlingService, KnittingOrderBundlingInfoService, KnittingJobsReportingHelperService,
    InvCreationService,PoBundlingDepMapRepository,
  ],
  controllers: [KnittingJobsReportingController]
})
export class KnittingJobsReportingModule {}
