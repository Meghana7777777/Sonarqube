import { Module, forwardRef } from '@nestjs/common';
import { FgLocationModule } from '../__masters__/location/fg-location-module';
import { LocationAllocationModule } from '../location-allocation/location-allocation.module';
import { PackingListModule } from '../packing-list/packing-list.module';
import { FgRackDashboardController } from './rack-dashboard/rack-dashboard.controller';
import { FgRackDashboardService } from './rack-dashboard/rack-dashboard.service';
import { FgRackModule } from '../__masters__/racks/fg-rack-module';

@Module({
  imports: [
    FgLocationModule,
    FgRackModule,
    forwardRef(() => LocationAllocationModule),
    PackingListModule,
    FgLocationModule,
  ],
  controllers: [FgRackDashboardController],
  providers: [FgRackDashboardService],
  exports: [FgRackDashboardService]
})
export class FgDashboardModule { }
