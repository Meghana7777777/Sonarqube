import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MastersModule } from '../__masters__';

import { PackingListModule } from '../packing-list/packing-list.module';
import { CartonContainerMappingService } from './carton-container-mapping.service';
import { ContainerGroupCreationService } from './container-group-creation.service';
import { FGContainerGroupInfoService } from './container-group-info.service';
import { ContainerInfoService } from './container-info.service';
import { FGContainerCartonMapHistoryEntity } from './entities/container-carton-map-history.entity';
import { FGContainerCartonMapEntity } from './entities/container-carton-map.entity';
import { FGContainerGroupItemsEntity } from './entities/container-group/container-group-items.entity';
import { FGContainerGroupEntity } from './entities/container-group/container-group.entity';
import { FGContainerSubGroupEntity } from './entities/container-group/container-sub-group.entity';
import { FGContainerLocationMapHistoryEntity } from './entities/container-location-map-history.entity';
import { FGContainerLocationMapEntity } from './entities/container-location-map.entity';
import { LocationAllocationController } from './location-allocation.controller';
import { LocationAllocationService } from './location-allocation.service';
import { LocationInfoService } from './location-info.service';
import { LocationMappingHelperService } from './location-mapping-helper.service';
import { MaterialIssuanceService } from './material-issuance.service';
import { ContainerCartonMapHistoryRepo } from './repositories/container-carton-map-history.repository';
import { ContainerCartonMapRepo } from './repositories/container-carton-map.repository';
import { ContainerGroupItemsRepo } from './repositories/container-group-items.repository';
import { ContainerGroupRepo } from './repositories/container-group.repository';
import { ContainerLocationMapHistoryRepo } from './repositories/container-location-map-history.repository';
import { ContainerLocationMapRepo } from './repositories/container-location-map.repository';
import { ContainerSubGroupRepo } from './repositories/container-sub-group.repository';
import { FgLocationModule } from '../__masters__/location/fg-location-module';
import { FGContainerModule } from '../__masters__/container/fg-container.module';
import { ContainerLocationMappingService } from './container-location-mapping.service';
import { FgWarehouseReqModule } from '../fg-warehouse/fg-wh-req.module';
import { FgRackModule } from '../__masters__/racks/fg-rack-module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FGContainerLocationMapEntity,
      FGContainerLocationMapHistoryEntity,
      FGContainerCartonMapEntity,
      FGContainerCartonMapHistoryEntity,
      FGContainerGroupEntity,
      FGContainerGroupItemsEntity,
      FGContainerSubGroupEntity
    ]),
    forwardRef(() => PackingListModule),
    forwardRef(() => FgLocationModule),
    forwardRef(() => FgRackModule),
    FGContainerModule, FgWarehouseReqModule
  ],
  controllers: [LocationAllocationController],
  providers: [LocationAllocationService, CartonContainerMappingService, LocationMappingHelperService, ContainerCartonMapRepo, ContainerCartonMapHistoryRepo, ContainerLocationMapRepo, ContainerLocationMapHistoryRepo, ContainerInfoService, CartonContainerMappingService, ContainerLocationMappingService, LocationInfoService, ContainerGroupItemsRepo, ContainerGroupRepo, ContainerSubGroupRepo, FGContainerGroupInfoService, ContainerGroupCreationService, MaterialIssuanceService],
  exports: [LocationAllocationService, ContainerInfoService, CartonContainerMappingService, LocationMappingHelperService, LocationInfoService, FGContainerGroupInfoService, MaterialIssuanceService, ContainerGroupCreationService],

})
export class LocationAllocationModule { }
