import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorController } from './vendor.controller';
import { VendorService } from './vendor.service';
import { VendorHelperService } from './vendor-helper.service';
import { VendorInfoService } from './vendor-info.service';
import { VendorEntity } from './entity/vendor.entity';
import { VendorRepository } from './repository/vendor.repository';
import { VendorCategoryEntity } from './entity/vendor-category.entity';
import { VendorCategoryRepository } from './repository/vendor-category.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            VendorEntity,
            VendorCategoryEntity
        ]),
    ],
    controllers: [VendorController],
    providers: [VendorService, VendorHelperService, VendorInfoService, VendorRepository, VendorCategoryRepository],
    exports: [VendorService, VendorHelperService, VendorInfoService]
})
export class VendorModule { }