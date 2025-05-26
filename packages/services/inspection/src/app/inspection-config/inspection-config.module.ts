import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InspectionConfigController } from './inspection-config.controller';
import { InsTypesRepo } from '../masters/repositories/ins-types.repository';
import { InspectionConfigService } from './inspection-config.service';
import { InsConfigItemsEntity } from '../entities/ins-header-config-items';
import { InsConfigHeaderEntity } from '../entities/ins-header-config.entity';
import { InsHeaderConfigRepo } from './repositories/ins-header.config.repository';
import { InsConfigItemRepo } from './repositories/ins-config-item.repository';
import { InsTypesAdapter } from '../masters/masters-services/ins-types/ins-type.adapter';



@Module({
  imports: [
    TypeOrmModule.forFeature([InsConfigHeaderEntity, InsConfigItemsEntity]),
  ],
  controllers: [InspectionConfigController],
  providers: [InsTypesRepo, InsHeaderConfigRepo, InsConfigItemRepo, InsTypesAdapter, InspectionConfigService],
  exports: [InspectionConfigService]
})

export class ConfigInspectionModule { }
