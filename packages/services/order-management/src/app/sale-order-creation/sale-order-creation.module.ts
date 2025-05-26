import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerSharedService, ProductSharedService, ProductTypeServices, StyleProductOpService, StyleSharedService } from '@xpparel/shared-services';
import { SoInfoEntity } from '../entity/so-info-entity';
import { SoLineProductEntity } from '../entity/so-line-product.entity';
import { SoLineEntity } from '../entity/so-line.entity';
import { SoInfoRepository } from '../repository/so-info-repository';
import { SoLineProductRepository } from '../repository/so-line-product.repository';
import { SoLineRepository } from '../repository/so-line.repository';
import { SoProductSubLineRepository } from '../repository/so-product-sub-line.repository';
import { SaleOrderCreationInfoService } from './sale-order-creation-info.service';
import { SaleOrderCreationController } from './sale-order-creation.controller';
import { SaleOrderCreationService } from './sale-order-creation.service';
import { SoProductSubLineEntity } from '../entity/so-product-sub-line.entity';


@Module({
    imports: [
        ScheduleModule.forRoot(),
        TypeOrmModule.forFeature([
            SoInfoEntity,SoLineEntity,SoLineProductEntity,SoProductSubLineEntity
        ])
    ],
    controllers: [SaleOrderCreationController],
    providers: [SaleOrderCreationService,SaleOrderCreationInfoService,SoInfoRepository,SoLineRepository,SoLineProductRepository,SoProductSubLineRepository,CustomerSharedService,StyleSharedService,ProductSharedService,ProductTypeServices,StyleProductOpService],
    exports: [SaleOrderCreationService,SaleOrderCreationInfoService]
})
export class SaleOrderCreationModule { } 