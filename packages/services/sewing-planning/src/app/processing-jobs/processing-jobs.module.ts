import { Module } from '@nestjs/common';
import { FgCreationService, InvIssuanceService, MoOpRoutingService, OpReportingService, PackingListService, WmsKnitItemRequestService, WmsSpsTrimRequestService } from '@xpparel/shared-services';
import { PoLineRepository } from '../entities/repository/po-line.repo';
import { PoProductRepository } from '../entities/repository/po-product.repo';
import { PoRoutingGroupRepository } from '../entities/repository/po-routing-group-repo';
import { PoSubLineBundleRepository } from '../entities/repository/po-sub-line-bundle.repo';
import { PoSubLineRepository } from '../entities/repository/po-sub-line.repo';
import { PoWhJobMaterialRepository } from '../entities/repository/po-wh-job-material-repo';
import { PoWhRequestLineRepository } from '../entities/repository/po-wh-request-line.repo';
import { PoWhRequestRepository } from '../entities/repository/po-wh-request.repo';
import { ProcessingOrderRepository } from '../entities/repository/processing-order.repo';
import { ProductSubLineFeaturesRepository } from '../entities/repository/product-sub-line-features.repo';
import { SJobHeaderRepo } from '../entities/repository/s-job-header.repository';
import { SJobLineOperationsRepo } from '../entities/repository/s-job-line-operations';
import { SJobLinePlanRepo } from '../entities/repository/s-job-line-plan.repository';
import { SJobLineRepo } from '../entities/repository/s-job-line.repository';
import { SJobPreferencesRepo } from '../entities/repository/s-job-preference.repository';
import { SJobSubLineRepo } from '../entities/repository/s-job-sub-line.repository';
import { PJMaterialAllocationService } from './processing-jobs-material.allocation.service';
import { ProcessingJobsPlanningService } from './processing-jobs-planning.service';
import { ProcessingJobsController } from './processing-jobs.controller';
import { ProcessingJobsService } from './processing-jobs.service';
import { PoWhRequestMaterialItemRepository } from '../entities/repository/po-wh-request-item.repo';
import { PoWhJobMaterialIssuanceHistoryRepository } from '../entities/repository/po-wh-job-material-issuance-history-repo';
import { PoWhJobMaterialHistoryEntity } from '../entities/po-wh-job-material-history-entity';
import { PoWhRequestLineHistoryRepository } from '../entities/repository/po-wh-request-line-history-repo';
import { PoWhRequestMaterialItemHistoryEntity } from '../entities/po-wh-request-material-item-history-entity';
import { PoWhJobMaterialHistoryRepository } from '../entities/repository/po-wh-job-material-history-repo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PoWhJobMaterialEntity } from '../entities/po-wh-job-material-entity';
import { PoWhJobMaterialIssuanceEntity } from '../entities/po-wh-job-material-issuance-entity';
import { PoWhJobMaterialIssuanceHistoryEntity } from '../entities/po-wh-job-material-issuance-history-entity';
import { PoWhRequestEntity } from '../entities/po-wh-request-entity';
import { PoWhRequestHistoryEntity } from '../entities/po-wh-request-history.entity';
import { PoWhRequestLineEntity } from '../entities/po-wh-request-line-entity';
import { PoWhRequestLineHistoryEntity } from '../entities/po-wh-request-line-history-entity';
import { PoWhRequestMaterialItemEntity } from '../entities/po-wh-request-material-item-entity';
import { SJobBundleEntity } from '../entities/s-job-bundle.entity';
import { SJobHeaderEntity } from '../entities/s-job-header.entity';
import { SJobLineOperationsEntity } from '../entities/s-job-line-operations';
import { SJobLinePlanEntity } from '../entities/s-job-line-plan';
import { SJobLinePlanHistoryEntity } from '../entities/s-job-line-plan-history';
import { SJobPreferences } from '../entities/s-job-preferences.entity';
import { SJobPreviewLog } from '../entities/s-job-preview-log.entity';
import { SJobTransferHistoryEntity } from '../entities/s-job-transfer-history';
import { SJobLineEntity } from '../entities/s-job-line.entity';
import { PoWhRequestIssuanceRepository } from '../entities/repository/po-wh-issuance-repo';
import { PoWhIssuanceEntity } from '../entities/po-wh-issuance-entity';
import { SJobTranLogRefRepository } from '../entities/repository/s-job-tran-log-ref.repository';
import { SJobTranLogRefEntity } from '../entities/s-job-tran-log-ref.entity';
import { ProcessingJobRepService } from './processing-job-rep.service';
import { ProcessingJobHelperService } from './processing-job-helper.service';
import { SJobBundleRepository } from '../entities/repository/s-job-bundle.repository';
import { SJobLineOperationsHistoryRepo } from '../entities/repository/s-job-line-operations-history.repo';
import { SJobLineOperationsHistoryEntity } from '../entities/s-job-line-operations-history';
import { SJobPslRepository } from '../entities/repository/s-job-psl.repository';
import { SJobPslEntity } from '../entities/s-job-psl-entity';


@Module({
   imports: [
    TypeOrmModule.forFeature([
      PoWhJobMaterialEntity, PoWhJobMaterialHistoryEntity, PoWhJobMaterialIssuanceEntity, PoWhJobMaterialIssuanceHistoryEntity,
      PoWhRequestEntity, PoWhRequestHistoryEntity, PoWhRequestLineEntity, PoWhRequestLineHistoryEntity, 
      PoWhRequestMaterialItemEntity, PoWhRequestMaterialItemHistoryEntity, SJobBundleEntity, SJobHeaderEntity,
      SJobLineOperationsEntity, SJobLinePlanHistoryEntity, SJobLinePlanEntity,SJobPreferences, SJobPreviewLog,
      SJobTransferHistoryEntity, SJobLineEntity, PoWhIssuanceEntity,
      SJobTranLogRefEntity, SJobBundleEntity, SJobLineOperationsHistoryEntity, SJobPslEntity
    ]),
  ],
  providers: [
    ProcessingJobsPlanningService, ProcessingJobsService, PJMaterialAllocationService, ProcessingOrderRepository, PoLineRepository, PoSubLineRepository, PoProductRepository, ProductSubLineFeaturesRepository, PoRoutingGroupRepository, PoSubLineBundleRepository, MoOpRoutingService, SJobHeaderRepo, SJobPreferencesRepo, SJobLineOperationsRepo, SJobLinePlanRepo, SJobSubLineRepo, SJobLineRepo, PoWhJobMaterialRepository, PoWhRequestLineRepository, PoWhRequestRepository, PackingListService, PoWhRequestMaterialItemRepository,PoWhJobMaterialIssuanceHistoryRepository, PoWhJobMaterialHistoryRepository,PoWhRequestLineHistoryRepository, WmsKnitItemRequestService, InvIssuanceService, PoWhRequestIssuanceRepository, 
    SJobTranLogRefRepository, ProcessingJobRepService, ProcessingJobHelperService,OpReportingService, FgCreationService, SJobBundleRepository,WmsSpsTrimRequestService, SJobLineOperationsHistoryRepo, SJobPslRepository
  ],
  controllers: [ProcessingJobsController],
  exports: [ProcessingJobsPlanningService, ProcessingJobsService, PJMaterialAllocationService]
})
export class ProcessingJobsModule { }
