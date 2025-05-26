import { forwardRef, Module } from '@nestjs/common';
import { KnittingJobsMaterialAllocationService } from './knitting-jobs-material-allocation.service';
import { KnittingJobsMaterialAllocationController } from './knitting-jobs-material-allocation.controller';
import { KnittingJobMaterialAllocationService } from 'packages/libs/shared-services/src/kms';
import { PoWhRequestRepository } from '../common/repository/po-wh-request.repo';
import { PoWhRequestLineRepository } from '../common/repository/po-wh-request-line.repo';
import { PoWhRequestMaterialItemRepository } from '../common/repository/po-wh-request-material-item.repo';
import { PoKnitJobRepository } from '../common/repository/po-knit-job.repo';
import { KnittingJobsModule } from '../knitting-jobs/knitting-jobs.module';
import { KnittingConfigurationModule } from '../knitting-configuration/knitting-configuration.module';
import { PoKnitJobLineRepository } from '../common/repository/po-knit-job-line.repo';
import { PoKnitJobSubLineRepository } from '../common/repository/po-knit-job-sub-line.repo';
import { PoProductRepository } from '../common/repository/po-product.repo';
import { PoJobPslMapRepository } from '../common/repository/po-job-psl-map.repo';
import { PoWhRequestLineHistoryEntity } from '../common/entities/po-wh-request-line-history.entity';
import { PoWhRequestHistoryEntity } from '../common/entities/po-wh-request-history.entity';
import { PoWhRequestHistoryRepository } from '../common/repository/po-wh-request-history.repo';
import { PoWhKnitJobMaterialIssuanceRepository } from '../common/repository/po-wh-job-material-issuance.repo';
import { PoWhKnitJobMaterialRepository } from '../common/repository/po-wh-knit-job-material.repo';
import { ProductSubLineFeaturesRepository } from '../common/repository/product-sub-line-features.repo';
import { ItemSharedService, PackingListService, WmsKnitItemRequestService } from '@xpparel/shared-services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PoWhRequestLineEntity } from '../common/entities/po-wh-request-line-entity';
import { PoWhRequestEntity } from '../common/entities/po-wh-request-entity';
import { PoWhKnitJobMaterialEntity } from '../common/entities/po-wh-job-material-entity';
import { PoWhKnitJobMaterialIssuanceEntity } from '../common/entities/po-wh-job-material-issuance-entity';
import { PoWhRequestMaterialItemEntity } from '../common/entities/po-wh-request-material-item-entity';
import { PoKnitJobPlanRepository } from '../common/repository/po-knit-job-plan.repo';

@Module({
  imports: [
    forwardRef(() => KnittingConfigurationModule),
    TypeOrmModule.forFeature([
      PoWhRequestLineEntity, PoWhRequestEntity, PoWhKnitJobMaterialEntity, PoWhKnitJobMaterialIssuanceEntity, PoWhRequestMaterialItemEntity
    ]),
  ],

  providers: [KnittingJobsMaterialAllocationService, KnittingJobMaterialAllocationService, PoWhRequestRepository, PoWhRequestLineRepository, PoWhRequestMaterialItemRepository, PoKnitJobRepository,
    PoKnitJobLineRepository, PoKnitJobSubLineRepository, PoProductRepository, PoJobPslMapRepository, PoWhRequestLineRepository, PoWhRequestHistoryRepository, ProductSubLineFeaturesRepository, PoWhKnitJobMaterialRepository, PoWhKnitJobMaterialIssuanceRepository, PackingListService, ItemSharedService, PoKnitJobPlanRepository, WmsKnitItemRequestService],
  controllers: [KnittingJobsMaterialAllocationController]
})
export class KnittingJobsMaterialAllocationModule { }
