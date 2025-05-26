import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { InvCreationService, OpReportingService } from '@xpparel/shared-services';
import { InventoryConfirmationEntity } from '../entities/inventory-confirmation.entity';
import { InventoryBundleEntity } from '../entities/inventory-bundle.entity';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { InventoryHelperService } from './invnentory-helper.service';
import { InventoryInfoService } from './inventory-info.service';
import { InventoryConfirmationRepository } from '../entities/repository/inventory-confirmation.repo';
import { InventoryBundleRepository } from '../entities/repository/inventory-bundle.repo';
import { SJobBundleRepository } from '../entities/repository/s-job-bundle.repository';
import { PoSubLineRepository } from '../entities/repository/po-sub-line.repo';
import { PoSubLineBundleRepository } from '../entities/repository/po-sub-line-bundle.repo';
import { SJobPslRepository } from '../entities/repository/s-job-psl.repository';
import { ProductSubLineFeaturesRepository } from '../entities/repository/product-sub-line-features.repo';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([
      InventoryConfirmationEntity, InventoryBundleEntity, SJobBundleRepository, PoSubLineRepository
    ])
  ],
  controllers: [InventoryController],
  providers: [
    InventoryService, InventoryHelperService, InventoryInfoService, 
    InventoryConfirmationRepository, InventoryBundleRepository,
    SJobBundleRepository, PoSubLineRepository, PoSubLineBundleRepository,
    InvCreationService, OpReportingService, SJobPslRepository, ProductSubLineFeaturesRepository
  ],
  exports: [InventoryService, InventoryInfoService],
})
export class InventoryModule {}
