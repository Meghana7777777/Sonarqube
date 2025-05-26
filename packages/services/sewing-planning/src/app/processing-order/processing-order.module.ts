import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FgCreationService, MOConfigService, OrderCreationService, OrderManagementService } from '@xpparel/shared-services';
import { DataSource } from 'typeorm';
import { GenericTransactionManager } from '../../database/typeorm-transactions';

import { ProcessingOrderInfoService } from './processing-order-info.service';
import { ProcessingOrderController } from './processing-order.controller';
import { ProcessingOrderService } from './processing-order.service';
import { PoLineEntity } from '../entities/po-line-entity';
import { PoProductEntity } from '../entities/po-product-entity';
import { PoSerialsEntity } from '../entities/po-serials-entity';
import { PoSubLineEntity } from '../entities/po-sub-line-entity';
import { ProcessingOrderEntity } from '../entities/processing-order-entity';
import { ProductSubLineFeaturesEntity } from '../entities/product-sub-line-features-entity';
import { PoLineRepository } from '../entities/repository/po-line.repo';
import { PoProductRepository } from '../entities/repository/po-product.repo';
import { PoSerialsRepository } from '../entities/repository/po-serials.repo';
import { PoSubLineRepository } from '../entities/repository/po-sub-line.repo';
import { ProcessingOrderRepository } from '../entities/repository/processing-order.repo';
import { PoSubLineBundleEntity } from '../entities/po-sub-line-bundle.entity';
import { PoRoutingGroupEntity } from '../entities/po-routing-group-entity';
import { PoRoutingGroupRepository } from '../entities/repository/po-routing-group-repo';
import { PoSubLineBundleService } from './po-sub-line.bundle.service';
import { PoSubLineBundleRepository } from '../entities/repository/po-sub-line-bundle.repo';
import { ProductSubLineFeaturesRepository } from '../entities/repository/product-sub-line-features.repo';
import { SJobBundleRepository } from '../entities/repository/s-job-bundle.repository';
import { SJobLineRepo } from '../entities/repository/s-job-line.repository';
import { ProcessingOrderHelperService } from './processing-order-helper.service';
import { PoWhJobMaterialRepository } from '../entities/repository/po-wh-job-material-repo';
import { PoWhJobMaterialEntity } from '../entities/po-wh-job-material-entity';
import { PoWhRequestLineRepository } from '../entities/repository/po-wh-request-line.repo';
import { PoWhRequestMaterialItemRepository } from '../entities/repository/po-wh-request-item.repo';
import { PoWhRequestMaterialItemEntity } from '../entities/po-wh-request-material-item-entity';
import { PoWhRequestLineEntity } from '../entities/po-wh-request-line-entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    ProcessingOrderEntity, PoLineEntity, PoProductEntity, PoSubLineEntity, ProductSubLineFeaturesEntity, PoSerialsEntity, PoSubLineBundleEntity, PoRoutingGroupEntity, PoWhJobMaterialEntity, PoWhRequestLineEntity, PoWhRequestMaterialItemEntity
  ]),],
  providers: [
    ProcessingOrderService, OrderManagementService, ProcessingOrderRepository, PoLineRepository, PoSubLineRepository,
    PoProductRepository, PoSerialsRepository, ProcessingOrderInfoService, OrderCreationService, PoSubLineRepository, PoRoutingGroupRepository,
    PoSubLineBundleService, MOConfigService, PoSubLineBundleRepository, ProductSubLineFeaturesRepository, SJobBundleRepository,
    SJobLineRepo, ProcessingOrderHelperService, FgCreationService, PoWhJobMaterialRepository, PoWhRequestLineRepository, PoWhRequestMaterialItemRepository
  ],
  controllers: [ProcessingOrderController]
})
export class ProcessingOrderModule { }
