import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FGLocationAllocationService, FgInspectionCreationService, GatexService, InspectionPreferenceService, PackListService, PkDispatchSetService } from '@xpparel/shared-services';
import { DataSource } from 'typeorm';
import { GenericTransactionManager } from '../../database/typeorm-transactions';
import { LoggerService } from '../../logger';
import { SequenceHandlingModule } from '../__common__/sequence-handling/sequence-handling.module';
import { ItemsEntity } from '../__masters__/items/entities/items.entity';
import { PackingListModule } from '../packing-list/packing-list.module';
import { FgWhReqHeaderEntity } from './entity/fg-wh-req-header.entity';
import { FgWhReqLinesEntity } from './entity/fg-wh-req-lines.entity';
import { FgWhReqSubLinesEntity } from './entity/fg-wh-req-sub-lines.entity';
import { FgWhSecurityTrackEntity } from './entity/fg-wh-security-in.entity';
import { FgWhReqLineAttrsEntity } from './entity/fg-wh_req_line_attr.entity';
import { PkmsRequestItemTruckMapEntity } from './entity/pkms-req-item-truck-map.entity';
import { PkmsRequestTruckEntity } from './entity/pkms-req-truck.entity';
import { FgWarehouseReqService } from './fg-ware-house-req-service';
import { FgWarehouseBarcodeScanningService } from './fg-wh-barcode-scanning.service';
import { FgWarehouseInfoService } from './fg-wh-info.service';
import { FgWhereHouseAdapter } from './fg-wh-req-adapter';
import { FgWarehouseReqController } from './fg-wh-req-controller';
import { FgWhReqHeaderRepo } from './repository/fg-wh-req-header.repo';
import { FgWhReqLineAttrRepo } from './repository/fg-wh-req-line-attr.repo';
import { FgWhReqLineRepo } from './repository/fg-wh-req-line.repo';
import { FgWhReqSecurityInRepo } from './repository/fg-wh-req-security-in.repo';
import { FgWhReqSubLineRepo } from './repository/fg-wh-req-sub-line.repo';
import { PkmsReqItemTruckMapRepo } from './repository/pkms-req-item-truck-map.repo';
import { PkmsRequestTruckRepo } from './repository/pkms-req-truck.repo';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FgWhSecurityTrackEntity,
      FgWhReqLinesEntity,
      FgWhReqSubLinesEntity,
      FgWhReqHeaderEntity,
      FgWhReqLineAttrsEntity,
      ItemsEntity,
      PkmsRequestItemTruckMapEntity,
      PkmsRequestTruckEntity,
      PkmsRequestItemTruckMapEntity,
      PkmsRequestTruckEntity
    ]),
    SequenceHandlingModule,
    PackingListModule,
  ],
  controllers: [FgWarehouseReqController],
  providers: [
    FgWarehouseReqService,
    FgWhereHouseAdapter,
    FgWarehouseInfoService,
    FgWarehouseBarcodeScanningService,
    PackListService,
    InspectionPreferenceService,
    GatexService,
    FgInspectionCreationService,
    PkDispatchSetService,
    FGLocationAllocationService,
    {
      provide: 'FgWhReqHeaderRepoInterface',
      useClass: FgWhReqHeaderRepo
    },
    {
      provide: 'FgWhReqLineAttrRepoInterface',
      useClass: FgWhReqLineAttrRepo
    },
    {
      provide: 'FgWhReqLineRepoInterface',
      useClass: FgWhReqLineRepo
    },
    {
      provide: 'FgWhReqSecurityInRepoInterface',
      useClass: FgWhReqSecurityInRepo
    },
    {
      provide: 'FgWhReqSubLineRepoInterface',
      useClass: FgWhReqSubLineRepo
    },
    {
      provide: 'PkmsRequestItemTruckMapRepoInterface',
      useClass: PkmsReqItemTruckMapRepo
    },

    {
      provide: 'PkmsRequestTruckRepoInterface',
      useClass: PkmsRequestTruckRepo
    },

    {
      provide: 'TransactionManager',
      useFactory: (dataSource: DataSource) => new GenericTransactionManager(dataSource),
      inject: [DataSource],
    },
    {
      provide: 'LoggerService',
      useClass: LoggerService,
    }
  ],
  exports: [
    FgWarehouseReqService,
    FgWarehouseInfoService,
    FgWarehouseBarcodeScanningService,
    FgInspectionCreationService,
    PkDispatchSetService
  ],
})
export class FgWarehouseReqModule { }
