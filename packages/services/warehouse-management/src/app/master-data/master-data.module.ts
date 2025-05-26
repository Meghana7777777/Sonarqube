import { Module, forwardRef } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationAllocationModule } from '../location-allocation/location-allocation.module';
import { TrayTrolleyModule } from '../tray-trolly/tray-trolley.module';
import { BinsAdapter } from './dtos/bins-create.adapter';
import { MoversAdapter } from './dtos/mover-create.adapter';
import { PalletsAadapter } from './dtos/pallets-create.adapter';
import { RacksAdapter } from './dtos/racks-create.adpter';
import { RollAttributesAdapter } from './dtos/rolls-attributes.adapter';
import { supplierAdapter } from './dtos/supplier.adpter';
import { UsersGroupAdapter } from './dtos/usersgroup-create-adapter';
import { ApprovalHierarchyEntity } from './entities/approval_hierarchy.entity';
import { LBinEntity } from './entities/l-bin.entity';
import { LPalletEntity } from './entities/l-pallet.entity';
import { LRackEntity } from './entities/l-rack.entity';
import { LTrayEntity } from './entities/l-tray.entity';
import { LTrolleyEntity } from './entities/l-trolly.entity';
import { MoverEntity } from './entities/mover.entity';
import { RollAttributesEntity } from './entities/roll-attributes.entity';
import { SupplierEntity } from './entities/supplier.entity';
import { UserGroupEntity } from './entities/user-group.entity';
import { BinsDataController } from './master-services/bins/bins.controller';
import { BinsDataService } from './master-services/bins/bins.services';
import { MoversDataController } from './master-services/movers/movers.controller';
import { MoversDataService } from './master-services/movers/movers.service';
import { PalletsDataController } from './master-services/pallets/pallets.controller';
import { PalletsDataService } from './master-services/pallets/pallets.service';
import { RacksDataController } from './master-services/racks/racks.controller';
import { RacksDataService } from './master-services/racks/racks.service';
import { RollAttributesDataController } from './master-services/roll-attributes/roll-attributes.controller';
import { RollAttributesDataService } from './master-services/roll-attributes/roll-attributes.service';
import { SupplierDataController } from './master-services/supplier/supplier-controller';
import { SupplierDataService } from './master-services/supplier/supplier-service';
import { TraysController } from './master-services/trays/trays.controller';
import { TraysService } from './master-services/trays/trays.service';
import { TrolleyController } from './master-services/trollys/trolley.controller';
import { TrolleyService } from './master-services/trollys/trolley.service';
import { UsersGroupDataController } from './master-services/usersgroup/usersgroup.controller';
import { UsersGroupDataService } from './master-services/usersgroup/usersgroup.service';
import { PhGrnApprovalHierarchyRepo } from './repositories/approval_hierarchy.repository';
import { LBinRepo } from './repositories/l-bin.repository';
import { LPalletRepo } from './repositories/l-pallet.repository';
import { LRackRepo } from './repositories/l-rack.repository';
import { LTrayRepo } from './repositories/l-tray.repository';
import { LTrollyRepo } from './repositories/l-trolly.repository';
import { MoverRepo } from './repositories/mover.repository';
import { RollAttributesRepo } from './repositories/roll-attributes.repositry';
import { SupplierRepo } from './repositories/supplier-repository';
import { UserGroupEntityRepo } from './repositories/user-group.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ApprovalHierarchyEntity,LBinEntity,LPalletEntity,LRackEntity,LTrayEntity,LTrolleyEntity,MoverEntity,RollAttributesEntity,UserGroupEntity, SupplierEntity]),
    forwardRef(()=>LocationAllocationModule),
    forwardRef(()=>TrayTrolleyModule)
  ],
  controllers: [RacksDataController,BinsDataController,PalletsDataController,MoversDataController,TraysController,TrolleyController,UsersGroupDataController,RollAttributesDataController,SupplierDataController ],
  providers: [RacksDataService,BinsDataService,PalletsDataService,MoversDataService,TraysService,TrolleyService,UsersGroupDataService,RollAttributesDataService,PhGrnApprovalHierarchyRepo,LBinRepo,LPalletRepo,LRackRepo,LTrayRepo,LTrollyRepo,MoverRepo,RollAttributesRepo,UserGroupEntityRepo,SupplierRepo ,RacksAdapter,BinsAdapter,MoversAdapter,PalletsAadapter,UsersGroupAdapter, supplierAdapter, RollAttributesAdapter,SupplierDataService,],
  exports: [RacksDataService,BinsDataService,PalletsDataService,MoversDataService,TraysService,TrolleyService,UsersGroupDataService,RollAttributesDataService,SupplierDataService]
})

export class MasterDataModule {}
