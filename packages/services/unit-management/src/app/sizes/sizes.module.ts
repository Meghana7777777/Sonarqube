import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SizesEntity } from './entity/sizes.entity';
import { SizesController } from './sizes.controller';
import { SizesService } from './sizes.service';
import { SizesRepository } from './repository/sizes.repository';
import { SizeHelperService } from './sizes.helper.service';
import { OrderManipulationServices } from '@xpparel/shared-services';


@Module({
    imports: [
        TypeOrmModule.forFeature([
            SizesEntity
        ]),
    ],
    controllers: [SizesController],
    providers: [SizesService,SizesRepository,SizeHelperService,OrderManipulationServices],
    exports: [SizesService,SizeHelperService]
})
export class SizesModule { }