import { Module, forwardRef } from '@nestjs/common';
import { LocationAllocationService } from './location-allocation.service';
import { LocationAllocationController } from './location-allocation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PalletBinMapRepo } from './repositories/pallet-bin-map.repository';
import { PalletRollMapRepo } from './repositories/pallet-roll-map.repository';
import { RollPalletMappingService } from './roll-pallet-mapping.service';
import { PackingListModule } from '../packing-list/packing-list.module';
import { PackingListInfoService } from '../packing-list/packing-list-info.service';
import { PalletInfoService } from './pallet-info.service';
import { PalletBinMapHistoryRepo } from './repositories/pallet-bin-map-history.repository';
import { PalletRollMapHistoryRepo } from './repositories/pallet-roll-map-history.repository';
import { LcoationMappingHelperService } from './location-mapping-helper.service';
import { MasterDataModule } from '../master-data/master-data.module';
import { PalletsDataService } from '../master-data/master-services/pallets/pallets.service';
import { PalletBinMapEntity } from './entities/pallet-bin-map.entity';
import { PalletBinMapHistoryEntity } from './entities/pallet-bin-map-history.entity';
import { PalletRollMapEntity } from './entities/pallet-roll-map.entity';
import { PalletRollMapHistoryEntity } from './entities/pallet-roll-map-history.entity';
import { PalletBinMappingService } from './pallet-bin-mapping.service';
import { BinInfoService } from './bin-info.service';
import { PalletGroupEntity } from './entities/pallet-group/pallet-group.entity';
import { PalletGroupItemsEntity } from './entities/pallet-group/pallet-group-items.entity';
import { PalletSubGroupEntity } from './entities/pallet-group/pallet-sub-group.entity';
import { PalletGroupItemsRepo } from './repositories/pallet-group-items.repository';
import { PalletGroupRepo } from './repositories/pallet-group.repository';
import { PalletSubGroupRepo } from './repositories/pallet-sub-group.repository';
import { PalletGroupInfoService } from './pallet-group-info.service';
import { PalletGroupCreationService } from './pallet-group-creation.service';
import { MaterialIssuanceService } from './material-issuance.service';
import { TrayTrolleyModule } from '../tray-trolly/tray-trolley.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PalletBinMapEntity,
      PalletBinMapHistoryEntity,
      PalletRollMapEntity,
      PalletRollMapHistoryEntity,
      PalletGroupEntity,
      PalletGroupItemsEntity,
      PalletSubGroupEntity
    ]),
    forwardRef(() => PackingListModule),
    forwardRef(() => TrayTrolleyModule),
    forwardRef(() => MasterDataModule),
    
  ],
  controllers: [LocationAllocationController],
  providers: [LocationAllocationService, RollPalletMappingService, LcoationMappingHelperService, PalletRollMapRepo, PalletRollMapHistoryRepo, PalletBinMapRepo, PalletBinMapHistoryRepo, PalletInfoService, RollPalletMappingService, PalletBinMappingService, BinInfoService, PalletGroupItemsRepo, PalletGroupRepo, PalletSubGroupRepo, PalletGroupInfoService, PalletGroupCreationService, MaterialIssuanceService],
  exports: [LocationAllocationService, PalletInfoService, RollPalletMappingService, LcoationMappingHelperService, BinInfoService, PalletGroupInfoService, MaterialIssuanceService],

})
export class LocationAllocationModule { }
