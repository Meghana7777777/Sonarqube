import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MOConfigService, MoOpRoutingService, OrderCreationService } from '@xpparel/shared-services';
import { DataSource } from 'typeorm';
import { GenericTransactionManager } from '../../database/typeorm-transactions';
import { LoggerService } from '../../logger';
import { PoComponentsEntity } from '../common/entities/po-components-entity';
import { PoFabricEntity } from '../common/entities/po-fabric-entity';
import { PoKgComponentFabricEntity } from '../common/entities/po-kg-component-faric-entity';
import { PoKnitGroupEntity } from '../common/entities/po-knit-group-entity';
import { PoKnitJobEntity } from '../common/entities/po-knit-job-entity';
import { PoKnitJobLineEntity } from '../common/entities/po-knit-job-line-entity';
import { PoKnitJobRatioEntity } from '../common/entities/po-knit-job-ratio-entity';
import { PoKnitJobRatioLineEntity } from '../common/entities/po-knit-job-ratio-line-entity';
import { PoKnitJobRatioSubLineEntity } from '../common/entities/po-knit-job-ratio-sub-line-entity';
import { PoKnitJobSubLineEntity } from '../common/entities/po-knit-job-sub-line-entity';
import { PoLineEntity } from '../common/entities/po-line-entity';
import { PoProductEntity } from '../common/entities/po-product-entity';
import { PoSerialsEntity } from '../common/entities/po-serials-entity';
import { PoSubLineEntity } from '../common/entities/po-sub-line-entity';
import { ProcessingOrderEntity } from '../common/entities/processing-order-entity';
import { ProductSubLineFeaturesEntity } from '../common/entities/product-sub-line-features-entity';
import { PoLineRepository } from '../common/repository/po-line.repo';
import { PoProductRepository } from '../common/repository/po-product.repo';
import { PoRoutingGroupRepository } from '../common/repository/po-routing-group-repo';
import { PoSerialsRepository } from '../common/repository/po-serials.repo';
import { PoSubLineRepository } from '../common/repository/po-sub-line.repo';
import { ProcessingOrderRepository } from '../common/repository/processing-order.repo';
import { PoSubLineBundleService } from './po-sub-line.bundle.service';
import { ProcessingOrderInfoService } from './processing-order-info.service';
import { ProcessingOrderController } from './processing-order.controller';
import { ProcessingOrderService } from './processing-order.service';
import { PoJobPslMapEntity } from '../common/entities/po-job-psl-map-entity';
import { PoJobPslMapHistoryEntity } from '../common/entities/po-job-psl-map-history-entity';
import { PoKnitJobPlanEntity } from '../common/entities/po-knit-job-plan-entity';
import { PoKnitJobPlanHistoryEntity } from '../common/entities/po-knit-job-plan-history-entity';
import { PoKnitJobPslEntity } from '../common/entities/po-knit-job-psl-entity';
import { PoRoutingGroupEntity } from '../common/entities/po-routing-group-entity';
import { PoSubLineBundleEntity } from '../common/entities/po-sub-line-bundle.entity';
import { PoWhKnitJobMaterialEntity } from '../common/entities/po-wh-job-material-entity';
import { PoKnitJobQtyEntity } from '../common/entities/po-knit-job-quantity-entity';
import { ProductSubLineFeaturesRepository } from '../common/repository/product-sub-line-features.repo';
import { PoKnitJobRatioRepository } from '../common/repository/po-knit-job-ratio.repo';

@Module({
  imports: [TypeOrmModule.forFeature([
    ProcessingOrderEntity, PoLineEntity, PoComponentsEntity, PoFabricEntity, PoProductEntity, PoKgComponentFabricEntity, PoKnitGroupEntity, PoKnitJobRatioEntity, PoKnitGroupEntity, PoKnitJobRatioLineEntity, PoKnitJobSubLineEntity, PoKnitJobEntity, PoKnitJobLineEntity, PoKnitJobRatioSubLineEntity, PoSubLineEntity, ProductSubLineFeaturesEntity, PoSerialsEntity, PoJobPslMapEntity, PoJobPslMapHistoryEntity, PoKnitJobPlanEntity, PoKnitJobPlanHistoryEntity, PoKnitJobPslEntity, PoRoutingGroupEntity, PoSubLineBundleEntity, PoWhKnitJobMaterialEntity, PoKnitJobQtyEntity
  ]),],
  providers: [ProcessingOrderService, ProcessingOrderRepository, PoLineRepository, PoSubLineRepository, PoProductRepository, PoSerialsRepository, ProcessingOrderInfoService, PoSubLineBundleService, MOConfigService, PoRoutingGroupRepository, OrderCreationService, ProductSubLineFeaturesRepository, MoOpRoutingService, PoKnitJobRatioRepository,
    {
      provide: 'TransactionManager',
      useFactory: (dataSource: DataSource) => new GenericTransactionManager(dataSource),
      inject: [DataSource],
    },
    {
      provide: 'LoggerService',
      useClass: LoggerService,
    }],
  controllers: [ProcessingOrderController],
  exports: [ProcessingOrderInfoService]
})
export class ProcessingOrderModule { }
