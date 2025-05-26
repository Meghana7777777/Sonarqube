import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductTypeController } from './product-type.controller';
import { ProductTypeService } from './product-type.service';
import { ProductTypeHelperService } from './product-type-helper.service';
import { ProductTypeEntity } from './entity/product-type.entity';
import { ProductTypeComponentEntity } from './entity/product-type-component.entity';
import { ProductTypeRepository } from './repository/product-type.repository';
import { ProductTypeComponentRepository } from './repository/product-type-component.repository';
import { ComponentRepository } from '../component/repository/component.repository';
import { OrderManipulationServices } from '@xpparel/shared-services';

@Module({
    imports: [TypeOrmModule.forFeature([
        ProductTypeEntity, ProductTypeComponentEntity
    ])],
    controllers: [ProductTypeController],
    providers: [ProductTypeService, ProductTypeHelperService,ProductTypeRepository,ComponentRepository,ProductTypeComponentRepository,OrderManipulationServices],
    exports: [ProductTypeService, ProductTypeHelperService]
})
export class ProductTypeModule { }