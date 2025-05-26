import { forwardRef, Module } from '@nestjs/common';
import { KnittingJobsService } from './knitting-jobs.service';
import { KnittingJobsController } from './knitting-jobs.controller';
import { PoJobPslMapRepository } from '../common/repository/po-job-psl-map.repo';
import { PoKnitJobLineRepository } from '../common/repository/po-knit-job-line.repo';
import { PoKnitJobPlanRepository } from '../common/repository/po-knit-job-plan.repo';
import { PoKnitJobQtyRepository } from '../common/repository/po-knit-job-quantity.repo';
import { PoKnitJobRatioLineRepository } from '../common/repository/po-knit-job-ratio-line.repo';
import { PoKnitJobRatioSubLineRepository } from '../common/repository/po-knit-job-ratio-sub-line.repo';
import { PoKnitJobRatioRepository } from '../common/repository/po-knit-job-ratio.repo';
import { PoKnitJobSubLineRepository } from '../common/repository/po-knit-job-sub-line.repo';
import { PoKnitJobRepository } from '../common/repository/po-knit-job.repo';
import { PoLineRepository } from '../common/repository/po-line.repo';
import { PoProductRepository } from '../common/repository/po-product.repo';
import { PoSubLineRepository } from '../common/repository/po-sub-line.repo';
import { ProcessingOrderRepository } from '../common/repository/processing-order.repo';
import { ProductSubLineFeaturesRepository } from '../common/repository/product-sub-line-features.repo';
import { ItemSharedService, MOConfigService, MoOpRoutingService } from '@xpparel/shared-services';
import { KnittingConfigurationModule } from '../knitting-configuration/knitting-configuration.module';
import { PoWhKnitJobMaterialRepository } from '../common/repository/po-wh-knit-job-material.repo';
import { PoWhRequestLineRepository } from '../common/repository/po-wh-request-line.repo';
import { PoWhRequestRepository } from '../common/repository/po-wh-request.repo';
import { PoWhRequestMaterialItemRepository } from '../common/repository/po-wh-request-material-item.repo';
@Module({
  imports: [
    forwardRef(() => KnittingConfigurationModule),
  ],
  providers: [KnittingJobsService, PoKnitJobRatioRepository, PoKnitJobRatioLineRepository, PoKnitJobRatioSubLineRepository, ProcessingOrderRepository, PoLineRepository, PoSubLineRepository, PoProductRepository, PoKnitJobRepository, PoKnitJobLineRepository, PoKnitJobSubLineRepository, PoKnitJobQtyRepository, ProductSubLineFeaturesRepository, PoJobPslMapRepository, PoKnitJobPlanRepository, MOConfigService, MoOpRoutingService,ItemSharedService, PoWhKnitJobMaterialRepository, PoWhRequestLineRepository,PoWhRequestRepository,PoWhRequestMaterialItemRepository],
  controllers: [KnittingJobsController],
  exports : [KnittingJobsService]
})
export class KnittingJobsModule { }
