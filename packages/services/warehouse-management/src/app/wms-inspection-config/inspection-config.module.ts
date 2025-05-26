import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsConfigItemsEntity } from './entities/ins-header-config-items';
import { InsConfigHeaderEntity } from './entities/ins-header-config.entity';
import { InspectionConfigController } from './inspection-config.controller';
import { WMSInspectionConfigService } from './inspection-config.service';
import { InsConfigItemRepo } from './repositories/ins-config-item.repository';
import { InsHeaderConfigRepo } from './repositories/ins-header.config.repository';
import { InsBullQueueService, InspectionConfigService } from '@xpparel/shared-services';
import { PhItemsRepo } from '../packing-list/repository/ph-items.repository';



@Module({
  imports: [
    TypeOrmModule.forFeature([InsConfigHeaderEntity, InsConfigItemsEntity]),
  ],
  controllers: [InspectionConfigController],
  providers: [InsHeaderConfigRepo, InsConfigItemRepo, WMSInspectionConfigService, InspectionConfigService, InsBullQueueService,PhItemsRepo],
  exports: [WMSInspectionConfigService]
})

export class ConfigInspectionModule { }
