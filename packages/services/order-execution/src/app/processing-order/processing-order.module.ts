import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CpsPslService, CutBundlingService, DocketGenerationServices, MOConfigService, MOInfoService, MoOpRoutingService, OperationService, OrderCreationService } from '@xpparel/shared-services';
import { DataSource } from 'typeorm';
import { GenericTransactionManager } from '../../database/typeorm-transactions';
import { PoLineEntity } from '../common/entities/po-line-entity';
import { PoProductEntity } from '../common/entities/po-product-entity';
import { PoRoutingGroupEntity } from '../common/entities/po-routing-group-entity';
import { PoSerialsEntity } from '../common/entities/po-serials-entity';
import { PoSubLineBundleEntity } from '../common/entities/po-sub-line-bundle.entity';
import { PoSubLineEntity } from '../common/entities/po-sub-line-entity';

import { ProductSubLineFeaturesEntity } from '../common/entities/product-sub-line-features-entity';
import { PoLineRepository } from '../common/repository/po-line.repo';
import { PoProductRepository } from '../common/repository/po-product.repo';
import { PoRoutingGroupRepository } from '../common/repository/po-routing-group-repo';
import { PoSerialsRepository } from '../common/repository/po-serials.repo';
import { PoSubLineRepository } from '../common/repository/po-sub-line.repo';
import { ProcessingOrderRepository } from '../common/repository/processing-order.repo';
import { ProductSubLineFeaturesRepository } from '../common/repository/product-sub-line-features.repo';
import { PoSubLineBundleService } from './po-sub-line.bundle.service';
import { ProcessingOrderInfoService } from './processing-order-info.service';
import { ProcessingOrderController } from './processing-order.controller';
import { ProcessingOrderService } from './processing-order.service';
import { ProcessingOrderEntity } from '../common/entities/processing-order-entity';
import { PoMaterialModule } from '../po-material/po-material.module';
import { PoInfoService } from './po-info.service';
import { PoHelperService } from './po-helper.service';
import { PoRatioModule } from '../po-ratio/po-ratio.module';
import { OpVersionModule } from '../op-seq/op-version.module';
import { SequenceHandlingModule } from '../master/sequence-handling/sequence-handling.module';
import { PoSubLineBundleRepository } from '../common/repository/po-sub-line-bundle.repo';

@Module({
  imports: [TypeOrmModule.forFeature([
    ProcessingOrderEntity, PoLineEntity, PoProductEntity, PoSubLineEntity, ProductSubLineFeaturesEntity, PoSerialsEntity, PoRoutingGroupEntity, PoSubLineBundleEntity,
  ]),
  forwardRef(() => PoMaterialModule),
  forwardRef(() => PoRatioModule),
  forwardRef(() => OpVersionModule),
  forwardRef(() => SequenceHandlingModule),
  
  ],
  providers: [
    ProcessingOrderService, ProcessingOrderRepository, PoLineRepository, PoSubLineRepository, PoProductRepository, PoSerialsRepository, ProcessingOrderInfoService, PoSubLineBundleService, MOConfigService, PoRoutingGroupRepository, OrderCreationService, ProductSubLineFeaturesRepository, MoOpRoutingService, PoInfoService, PoHelperService, MOInfoService,OperationService,DocketGenerationServices,
    PoSubLineBundleRepository, CutBundlingService, CpsPslService,
    {
      provide: 'TransactionManager',
      useFactory: (dataSource: DataSource) => new GenericTransactionManager(dataSource),
      inject: [DataSource],
    },
  ],
  controllers: [ProcessingOrderController],
  exports: [ProcessingOrderInfoService, PoInfoService, PoHelperService]
})
export class ProcessingOrderModule { }
