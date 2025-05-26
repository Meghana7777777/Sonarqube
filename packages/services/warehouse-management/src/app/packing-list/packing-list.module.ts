import { Module, forwardRef } from '@nestjs/common';
import { PackingListService } from './packing-list.service';
import { PackingListController } from './packing-list.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackingListRepo } from './repository/packing-list.repository';
import { PackingListEntity } from './entities/packing-list.entity';
import { PhApprovalHierarchyEntity } from './entities/ph-approval-hierarchy.entity';
import { PhBarcodePrintHistoryEntity } from './entities/ph-bar-code-print-history.entity';
import { PhItemLineSampleEntity } from './entities/ph-item-line-sample.entity';
import { PhItemLinesActualEntity } from './entities/ph-item-lines-actual.entity';
import { PhItemLinesEntity } from './entities/ph-item-lines.entity';
import { PhItemLinesActivityTrackEntity } from './entities/ph-items-lines-activity-track.entity';
import { PhItemsEntity } from './entities/ph-items.entity';
import { PhLinesHistoryEntity } from './entities/ph-lines-print-history.entity';
import { PhLinesEntity } from './entities/ph-lines.entity';
import { PhLogEntity } from './entities/ph-log.entity';
import { PhNotificationEntity } from './entities/ph-notification.entity';
import { PhApprovalHierarchyRepo } from './repository/ph-approval-hierarchy.repository';
import { PhBarcodePrintHistoryRepo } from './repository/ph-bar-code-print-history.repository';
import { PhItemLineSampleRepo } from './repository/ph-item-line-sample.repository';
import { PhItemLinesActualRepo } from './repository/ph-item-lines-actual.repository';
import { PhItemLinesRepo } from './repository/ph-item-lines.repository';
import { PhItemslinesActivitytrackRepo } from './repository/ph-items-lines-activity-track.repository';
import { PhItemsRepo } from './repository/ph-items.repository';
import { PhLinesPrintHistoryRepo } from './repository/ph-lines-print-history.repository';
import { PhLinesRepo } from './repository/ph-lines-repository';
import { PhLogRepo } from './repository/ph-log.reporitory';
import { PhNotificationRepo } from './repository/ph-notification.repository';
import { GrnModule } from '../grn/grn.module';
import { PackingListInfoService } from './packing-list-info.service';
import { GatexService, WhatsAppNotificationService } from '@xpparel/shared-services';
import { PackingListActualInfoService } from './packing-list-actuals-info.service';
import { MasterDataModule } from '../master-data/master-data.module';
import { LocationAllocationModule } from '../location-allocation/location-allocation.module';
import { PhItemIssuanceEntity } from './entities/ph-item-issuance.entity';
import { PhItemIssuanceRepo } from './repository/ph-item-issuance.repository';
import { StockInfoService } from './stock-info.service';
import { PhItemLinesConEntity } from './entities/ph-item-lines-con.entity';
import { PhItemLinesConRepo } from './repository/ph-item-lines-con.repository';
import { StockConsumptionService } from './stock-consumption.service';
import { PhItemLinesAIEntity } from './entities/ph-item-lines-ai.entity';
import { TrayTrolleyModule } from '../tray-trolly/tray-trolley.module';
import { PhItemLinesAiRepo } from './repository/ph-item-lines-ai.repository';
import { InspectionReportsRepo } from './repository/packlist.repository';
import { MOToPOMappingModule } from '../mo-po-mapping/mo-to-po-module';
import { InsConfigItemRepo } from '../wms-inspection-config/repositories/ins-config-item.repository';
import { InsConfigItemsEntity } from '../wms-inspection-config/entities/ins-header-config-items';


@Module({
  imports: [TypeOrmModule.forFeature([PackingListEntity, PhApprovalHierarchyEntity, PhBarcodePrintHistoryEntity, PhItemLineSampleEntity, PhItemLinesActualEntity, PhItemLinesEntity, PhItemLinesActivityTrackEntity, PhItemsEntity, PhLinesHistoryEntity, PhLinesEntity, PhLogEntity, PhNotificationEntity, PhItemIssuanceEntity, PhItemLinesConEntity, PhItemLinesAIEntity,InsConfigItemsEntity]),
  MasterDataModule,
  MOToPOMappingModule,
  forwardRef(()=> LocationAllocationModule),
  forwardRef(()=> GrnModule), 
  forwardRef(()=> GrnModule),
  forwardRef(()=> TrayTrolleyModule),
],

  controllers: [PackingListController,],
  providers: [PackingListService, StockInfoService, PackingListRepo, PhApprovalHierarchyRepo, PhBarcodePrintHistoryRepo, PhItemLineSampleRepo, PhItemLinesActualRepo, PhItemLinesRepo, PhItemslinesActivitytrackRepo, PhItemsRepo, PhLinesPrintHistoryRepo, PhLinesRepo, PhLogRepo, PhNotificationRepo, PackingListInfoService, WhatsAppNotificationService, PackingListActualInfoService, StockConsumptionService, PhItemIssuanceRepo, PhItemLinesConRepo, PhItemLinesAiRepo,GatexService ,InspectionReportsRepo,InsConfigItemRepo],
  exports: [PackingListService, PackingListInfoService, PackingListActualInfoService, StockInfoService, StockConsumptionService,GatexService,]
})
export class PackingListModule { }
