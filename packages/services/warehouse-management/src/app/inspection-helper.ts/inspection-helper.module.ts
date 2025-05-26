import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';


import { FabricInspectionInfoService, GatexService, WhatsAppNotificationService } from '@xpparel/shared-services';
import { InspectionHelperController } from '../inspection-helper.ts/inspection-helper.controller';
import { InspectionHelperService } from '../inspection-helper.ts/inspection-helper.service';
import { PackingListRepo } from '../packing-list/repository/packing-list.repository';
import { InspectionReportsRepo } from '../packing-list/repository/packlist.repository';
import { PhItemLinesActualRepo } from '../packing-list/repository/ph-item-lines-actual.repository';
import { PhItemLinesRepo } from '../packing-list/repository/ph-item-lines.repository';
import { PhLinesRepo } from '../packing-list/repository/ph-lines-repository';
import { InsConfigItemsEntity } from '../wms-inspection-config/entities/ins-header-config-items';
import { InsConfigItemRepo } from '../wms-inspection-config/repositories/ins-config-item.repository';
import { InsHeaderConfigRepo } from '../wms-inspection-config/repositories/ins-header.config.repository';
import { PhItemsRepo } from '../packing-list/repository/ph-items.repository';


@Module({
    imports: [TypeOrmModule.forFeature([]),
    ],

    controllers: [InspectionHelperController],
    providers: [PackingListRepo, PhItemLinesActualRepo, PhItemLinesRepo, PhLinesRepo, WhatsAppNotificationService, InspectionHelperService, GatexService, InspectionReportsRepo, InsConfigItemRepo,FabricInspectionInfoService,InsHeaderConfigRepo,PhItemsRepo],
    exports: [InspectionHelperService, GatexService,]
})
export class InspectionHelperModule { }
