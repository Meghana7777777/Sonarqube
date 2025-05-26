import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderManipulationController } from './order-manipulation.controller';
import { OrderManipulationHelperService } from './order-manipulation-helper.service';
import { OrderManipulationService } from './order-manipulation.service';
import { OrderEntity } from '../common/entity/order.entity';
import { OrderLineEntity } from '../common/entity/order-line.entity';
import { OrderSubLineEntity } from '../common/entity/order-sub-line.entity';
import { OrderLineOpEntity } from '../common/entity/order-line-op.entity';
import { OrderLineRmEntity } from '../common/entity/order-line-rm.entity';
import { OrderSubLineRmEntity } from '../common/entity/order-sub-line-rm.entity';
import { OrderLineOpRmEntity } from '../common/entity/order-line-op-rm.entity';
import { OrderLineRepository } from '../common/repository/order-line.repository';
import { OrderRepository } from '../common/repository/order.repository';
import { OrderSubLineRepository } from '../common/repository/order-sub-line.repository';
import { OrderLineRmRepository } from '../common/repository/order-line-rm.repository';
import { OrderLineOpRepository } from '../common/repository/order-line-op.repository';
import { OrderLineOpRmRepository } from '../common/repository/order-line-op-rm.repository';
import { OrderSubLineRmRepository } from '../common/repository/order-sub-line-rm.repository';
import { OrderSizesEntity } from '../common/entity/order-sizes.entity';
import { OrderInfoService } from './order-info.service';
import { OrderSizesRepository } from '../common/repository/order-sizes.repository';
import { OrderPackMethodEntity } from '../common/entity/order-pack-method.entity';
import { OrderListEntity } from '../common/entity/order-list.entity';
import { OrderPackMethodRepository } from '../common/repository/order-pack-method.repository';
import { ProductPrototypeModule } from '../product-prototype/product-prototype.module';
import { POService, PreIntegrationService, PreIntegrationServicePKMS, SewingOrderCreationService } from '@xpparel/shared-services';
import { LogRevisedOrderLineEntity } from '../common/entity/log-revised-qty-order-lines.entity';
import { SoInfoRepository } from '../common/repository/mo-info.repository';
import { SoLineRepository } from '../common/repository/mo-line.repository';
import { SoLineProductRepository } from '../common/repository/mo-line-product.repository';
import { SoProductSubLineRepository } from '../common/repository/mo-product-sub-line.repository';
import { PslOperationRepository } from '../common/repository/psl-operation.repository';
import { PslOpRawMaterialRepository } from '../common/repository/psl-opearation-rm.repository';
import { RawMaterialInfoRepository } from '../common/repository/rm-info.repository';
import { SaleOrderInfoService } from './sale-order-Info.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            OrderEntity, OrderLineEntity, OrderSubLineEntity, OrderLineOpEntity, OrderLineRmEntity, OrderLineOpRmEntity, OrderSubLineRmEntity, OrderSizesEntity, OrderPackMethodEntity, OrderListEntity, LogRevisedOrderLineEntity
        ]),
        forwardRef(() => ProductPrototypeModule)
    ],
    controllers: [OrderManipulationController],
    providers: [OrderManipulationHelperService, OrderManipulationService, OrderInfoService, OrderLineRepository, OrderRepository,
        OrderSubLineRepository, OrderLineRmRepository, OrderLineOpRepository, OrderLineOpRmRepository, OrderSubLineRmRepository,
        OrderSizesRepository, OrderPackMethodRepository,
        POService, PreIntegrationService, SewingOrderCreationService, PreIntegrationServicePKMS,
        SoInfoRepository,SoLineRepository,SoLineProductRepository,SoProductSubLineRepository,PslOperationRepository,PslOpRawMaterialRepository,RawMaterialInfoRepository,SaleOrderInfoService
    
    ],
    exports: [OrderManipulationHelperService, OrderManipulationService, OrderInfoService]
})
export class OrderManipulationModule { }