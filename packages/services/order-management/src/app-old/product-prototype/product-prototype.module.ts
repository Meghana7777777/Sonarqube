import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductPrototypeController } from './product-prototype.controller';
import { ProductPrototypeService } from './product-prototype.service';
import { ProductPrototypeHelperService } from './product-prototype-helper.service';
import { ProductEntity } from './entity/product.entity';
import { SubProductEntity } from './entity/sub-product.entity';
import { SubProductFabricEntity } from './entity/sub-product-fabric.entity';
import { ProductRepository } from './repository/product.repository';
import { SubProductRepository } from './repository/sub-product.repository';
import { SubProductFabricRepository } from './repository/sub-product-fabric.repository';
import { ProductPrototypeInfoService } from './product-prototype-info.service';
import { OrderManipulationModule } from '../order-manipulation/order-manipulation.module';
import { POService } from '@xpparel/shared-services';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ProductEntity, SubProductEntity, SubProductFabricEntity
        ]),
        forwardRef(()=>OrderManipulationModule)
    ],
    controllers: [ProductPrototypeController],
    providers: [ProductPrototypeService, ProductPrototypeHelperService, ProductPrototypeInfoService, ProductRepository, SubProductRepository, SubProductFabricRepository, POService],
    exports: [ProductPrototypeService, ProductPrototypeHelperService, ProductPrototypeInfoService]
})
export class ProductPrototypeModule { }