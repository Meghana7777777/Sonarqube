import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackingListModule } from '../packing-list/packing-list.module';
import { MasterDataModule } from '../master-data/master-data.module';
import { TrayTrolleyMappingService } from './tray-trolley-mapping.service';
import { TrayRollMappingService } from './tray-roll-mapping.service';
import { TrayRollMapHistoryRepo } from './repositories/tray-troll-map-history.repository';
import { TrayRollMapRepo } from './repositories/tray-roll-map.repository';
import { TrayTrolleyMapRepo } from './repositories/tray-trolley-map.repository';
import { TrayTrolleyMapHistoryRepo } from './repositories/tray-trolley-map-history.repository';
import { TrayTrolleyMapEntity } from './entities/tray-trolley-map.entity';
import { TrayTrolleyMapHistoryEntity } from './entities/tray-trolley-map-history.entity';
import { TrayRollMapEntity } from './entities/tray-roll-map.entity';
import { TrayRollMapHistoryEntity } from './entities/tray-roll-map-history.entity';
import { TrayTrolleyController } from './tray-trolley.controller';
import { TrayRollInfoService } from './tray-roll-info.service';
import { TrayTrolleyInfoService } from './tray-trolley-info.service';
import { TrolleyBinMapRepo } from './repositories/trolley-bin-map.repository';
import { TrolleyBinMapEntity } from './entities/trolley-bin-map.entity';
import { TrolleyBinMapHistoryEntity } from './entities/trolley-bin-map-history.entity';
import { LocationAllocationModule } from '../location-allocation/location-allocation.module';
import { TrolleyBinMappingService } from './trolley-bin-mapping.service';
import { TrolleyBinInfoService } from './trolley-bin-info.service';
import { TrolleyBinMapHistoryRepo } from './repositories/trolley-bin-map-history.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TrayTrolleyMapEntity,
      TrayTrolleyMapHistoryEntity,
      TrayRollMapEntity,
      TrayRollMapHistoryEntity,
      TrolleyBinMapEntity,
      TrolleyBinMapHistoryEntity
    ]),
    forwardRef(() => PackingListModule),
    forwardRef(() => MasterDataModule),
    forwardRef(() => LocationAllocationModule),
  
  ],
  controllers: [TrayTrolleyController],
  providers: [TrayTrolleyMappingService, TrayRollMappingService, TrayRollInfoService, TrayTrolleyInfoService,  TrolleyBinMappingService, TrolleyBinInfoService, TrayRollMapRepo, TrayRollMapHistoryRepo,  TrayTrolleyMapRepo, TrayTrolleyMapHistoryRepo, TrolleyBinMapRepo, TrolleyBinMapHistoryRepo],
  exports: [TrayTrolleyMappingService, TrayRollMappingService, TrayRollInfoService, TrayTrolleyInfoService, TrolleyBinMappingService, TrolleyBinInfoService,],

})
export class TrayTrolleyModule { }
