import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComponentController } from './component.controller';
import { ComponentService } from './component.service';
import { ComponentEntity } from './entity/component.entity';
import { ComponentRepository } from './repository/component.repository';
import { ProductTypeComponentRepository } from '../product-type/repository/product-type-component.repository';

@Module({
    imports: [TypeOrmModule.forFeature([
        ComponentEntity
    ])],
    controllers: [ComponentController],
    providers: [ComponentService,ComponentRepository,ProductTypeComponentRepository],
    exports: [ComponentService]
})
export class ComponentModule { }