import { Module, forwardRef } from '@nestjs/common';
import { GrnService } from './grn.service';
import { GrnController } from './grn.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhGrnEntity } from './entities/ph-grn.entity';
import { PhGrnRepo } from './repositories/ph-grn.repository';
import { GrnNotificationEntity } from './entities/grn-notification.entity';
import { GrnApprovalHeirarchyEntity } from './entities/grn-approval-heirarchy.entity';
import { GrnNotificationRepo } from './repositories/grn-notication.repository';
import { GrnApprovalHierarchyRepo } from './repositories/grn-approval-herirarchy.repository';
import { PackingListModule } from '../packing-list/packing-list.module';
import { LocationAllocationModule } from '../location-allocation/location-allocation.module';
import { PhVehicleEntity } from './entities/ph-vehicle.entity';
import { VehicleUnloadingHistory } from './entities/vehicle-unloading-history.entity';
import { PhVehicleRepo } from './repositories/ph-vehicle.repository';
import { VehicleUnloadingHisRepo } from './repositories/vehical-unload-history.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([PhGrnEntity, PhVehicleEntity, GrnNotificationEntity, GrnApprovalHeirarchyEntity, VehicleUnloadingHistory]),
    forwardRef(() => PackingListModule),
    LocationAllocationModule
  ],
  controllers: [GrnController],
  providers: [GrnService, PhGrnRepo, PhVehicleRepo, GrnNotificationRepo, GrnApprovalHierarchyRepo, VehicleUnloadingHisRepo],
  exports: [GrnService]
})
export class GrnModule { }
