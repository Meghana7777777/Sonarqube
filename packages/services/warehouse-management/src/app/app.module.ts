import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';
import { DatabaseModule } from '../database';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullQueueModule } from './bull-queue/bull-queue.module';
import { GrnModule } from './grn/grn.module';
import { LocationAllocationModule } from './location-allocation/location-allocation.module';
import { MasterDataModule } from './master-data/master-data.module';
import { UOMConversionModule } from './master-data/master-services/uom-master/uom.conversion.module';
import { FabricRequestCreationModule } from './material-request-handling/fabric-request-creation/fabric-request-creation.module';
import { FabricRequestHandlingModule } from './material-request-handling/fabric-request-handling/fabric-request-handling.module';
import { WmsKnitItemRequestModule } from './material-request-handling/knit-item-request-handling/wms-knit-item-request.module';
import { WmsSpsTrimRequestModule } from './material-request-handling/sps-trim-request-handling/wms-sps-trim.module';
import { MOToPOMappingModule } from './mo-po-mapping/mo-to-po-module';
import { NotificationsModule } from './notifications/notifications.module';
import { PackingListDashboardModule } from './packing-list-dashboards-analysis/packing-list-dashboard-module';
import { PackingListModule } from './packing-list/packing-list.module';
import { TrayTrolleyModule } from './tray-trolly/tray-trolley.module';
import { ConfigInspectionModule } from './wms-inspection-config/inspection-config.module';
import { InspectionHelperModule } from './inspection-helper.ts/inspection-helper.module';
import { WmsPKMSTrimRequestModule } from './material-request-handling/pkms-trim-request-handling/wms-pkms-trim.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
      load: [configuration],
    }),
    DatabaseModule,
    UOMConversionModule,
    GrnModule,
    MasterDataModule,
    NotificationsModule,
    PackingListModule,
    LocationAllocationModule,
    FabricRequestCreationModule,
    FabricRequestHandlingModule,
    BullQueueModule,
    TrayTrolleyModule,
    PackingListDashboardModule,
    MOToPOMappingModule,
    ConfigInspectionModule,
    WmsSpsTrimRequestModule,
    WmsKnitItemRequestModule,
    WmsPKMSTrimRequestModule,
    InspectionHelperModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
