import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsConfigItemsEntity } from './entities/pkms-ins-header-config-items';
import { InsConfigHeaderEntity } from './entities/pkms-ins-header-config.entity';

import { InsConfigItemRepo } from './repositories/pkms-ins-config-item.repository';
import { InsHeaderConfigRepo } from './repositories/pkms-ins-header.config.repository';
import { InsBullQueueService, InspectionConfigService } from '@xpparel/shared-services';
import { PKMSInspectionConfigController } from './pkms-inspection-config.controller';
import { PKMSInspectionConfigService } from './pkms-inspection-config.service';
import { LocationAllocationModule } from '../location-allocation/location-allocation.module';



@Module({
  imports: [
    TypeOrmModule.forFeature([InsConfigHeaderEntity, InsConfigItemsEntity]),
    LocationAllocationModule
  ],
  controllers: [PKMSInspectionConfigController],
  providers: [InsHeaderConfigRepo, InsConfigItemRepo, PKMSInspectionConfigService, InspectionConfigService, InsBullQueueService],
  exports: [PKMSInspectionConfigService]
})

export class PKMSConfigInspectionModule { }
