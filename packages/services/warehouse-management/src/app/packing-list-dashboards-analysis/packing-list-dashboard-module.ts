import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackingListEntity } from '../packing-list/entities/packing-list.entity';
import { PackingListDashboardController } from './packing-list-dashboard-controller';
import { PackingListDashboardService } from './packing-list-dashboard-service';
import { PackingListRepo } from '../packing-list/repository/packing-list.repository';
import { PhItemLinesRepo } from '../packing-list/repository/ph-item-lines.repository';
import { PalletRollMapRepo } from '../location-allocation/repositories/pallet-roll-map.repository';
import { PalletBinMapRepo } from '../location-allocation/repositories/pallet-bin-map.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PackingListEntity])
    
  ],
  controllers: [PackingListDashboardController],
  providers: [PackingListDashboardService,PackingListRepo,PhItemLinesRepo,PalletRollMapRepo,PalletBinMapRepo],
  exports: [PackingListDashboardService]
})
export class PackingListDashboardModule { }
