import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderCreationController } from './order-creation.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { OrderCreationService } from './order-creation.service';
import { MoInfoEntity } from '../entity/mo-info.entity';
import { OrderCreationInfoService } from './order-creation-info.service';
import { MoInfoRepository } from '../repository/mo-info.repository';
import { MoProductSubLineRepository } from '../repository/mo-product-sub-line.repository';
import { MoProductSubLineEntity } from '../entity/mo-product-sub-line.entity';
import { MoLineProductEntity } from '../entity/mo-line-product.entity';
import { MoLineProductRepository } from '../repository/mo-line-product.repository';
import { RmInfoEntity } from '../entity/rm-info.entity';
import { RawMaterialInfoRepository } from '../repository/rm-info.repository';
import { MoLineRepository } from '../repository/mo-line.repository';
import { MoLineEntity } from '../entity/mo-line.entity';
import { PslOperationEntity } from '../entity/psl-operation.entity';
import { PslOperationRmEntity } from '../entity/psl-operation-rm.entity';
import { PslOperationRepository } from '../repository/psl-operation.repository';
import { PslOpRawMaterialRepository } from '../repository/psl-opearation-rm.repository';
import { CustomerSharedService, ItemSharedService, ProductSharedService, ProductTypeServices, StyleProductOpService, StyleSharedService } from '@xpparel/shared-services';
import { MOProductFgColorRepository } from '../order-config/repository/mo-product-fg-color.repository';
import { MoOpVersionRepository } from '../order-config/repository/mo-op-version.repository';
import { SoInfoRepository } from '../repository/so-info-repository';
import { MoProductFgColorService } from '../order-config/mo-product-fg-colo.service';
import { MoPoBundleRepository } from '../repository/mo-po-bundle.repository';
import { MoPoBundleEntity } from '../entity/mo-po-bundle.entity';
import { SaleOrderCreationModule } from '../sale-order-creation/sale-order-creation.module';

@Module({
    imports: [
        ScheduleModule.forRoot(),
        TypeOrmModule.forFeature([
            MoInfoEntity, MoLineEntity, MoLineProductEntity, MoProductSubLineEntity, PslOperationEntity, PslOperationRmEntity, RmInfoEntity, MoPoBundleEntity
        ]),
        SaleOrderCreationModule
    ],
    controllers: [OrderCreationController],
    providers: [OrderCreationService, OrderCreationInfoService, MoInfoRepository, MoLineRepository, MoLineProductRepository, MoProductSubLineRepository, PslOperationRepository, PslOpRawMaterialRepository, RawMaterialInfoRepository, CustomerSharedService, StyleSharedService, ProductSharedService, ProductTypeServices, MOProductFgColorRepository, MoOpVersionRepository, SoInfoRepository, StyleProductOpService, MoProductFgColorService, MoPoBundleRepository, ItemSharedService],
    exports: [OrderCreationService, OrderCreationInfoService]
})
export class OrderCreationModule { }