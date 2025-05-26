import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PreIntegrationServiceOms } from './pre-integration.service';
import { PreIntegrationService } from '@xpparel/shared-services';
import { OrderListEntity } from '../common/entity/order-list.entity';
import { OrderListRepository } from '../common/repository/order-list.repository';
import { OrderRepository } from '../common/repository/order.repository';
import { ScheduleModule } from '@nestjs/schedule';
import { OrderCreationLogEntity } from '../common/entity/order-creation-log.entity';
import { OrderCreationLogRepository } from '../common/repository/order-creation-log.repository';
import { SoInfoRepository } from '../common/repository/mo-info.repository';
import { SoLineRepository } from '../common/repository/mo-line.repository';
import { SoLineProductRepository } from '../common/repository/mo-line-product.repository';
import { SoProductSubLineRepository } from '../common/repository/mo-product-sub-line.repository';
import { OrderManagementController } from './order-management.controller';
import { OrderManagementHelperService } from './order-management-helper.service';
import { OrderManagementService } from './order-management-service';
import { PslOperationRepository } from '../common/repository/psl-operation.repository';
import { PslOpRawMaterialRepository } from '../common/repository/psl-opearation-rm.repository';
import { RawMaterialInfoRepository } from '../common/repository/rm-info.repository';
import { SoInfoEntity } from '../common/entity/mo-info.entity';
import { SoLineEntity } from '../common/entity/mo-line.entity';
import { SoLineProductEntity } from '../common/entity/mo-line-product.entity';
import { SoProductSubLineEntity } from '../common/entity/mo-product-sub-line.entity';
import { PslOperationEntity } from '../common/entity/psl-operation.entity';
import { PslOperationRmEntity } from '../common/entity/psl-operation-rm.entity';
import { RmInfoEntity } from '../common/entity/rm-info.entity';

@Module({
    imports: [
        ScheduleModule.forRoot(),
        TypeOrmModule.forFeature([
            OrderListEntity, OrderCreationLogEntity,SoInfoEntity,SoLineEntity,SoLineProductEntity,SoProductSubLineEntity,PslOperationEntity,PslOperationRmEntity,RmInfoEntity
        ])
    ],
    controllers: [OrderManagementController],
    providers: [PreIntegrationServiceOms, OrderManagementHelperService, PreIntegrationService,OrderListRepository, 
        OrderRepository, OrderCreationLogRepository,SoInfoRepository,SoLineRepository,SoLineProductRepository,SoProductSubLineRepository,PslOperationRepository,PslOpRawMaterialRepository,RawMaterialInfoRepository,OrderManagementService
    ],
    exports: [PreIntegrationServiceOms, OrderManagementHelperService]
})
export class OrderManagementModule { }