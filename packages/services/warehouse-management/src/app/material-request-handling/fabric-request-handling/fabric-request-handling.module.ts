import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GrnModule } from '../../grn/grn.module';
import { MasterDataModule } from '../../master-data/master-data.module';
import { FabricRequestHandlingController } from './fabric-request-handling.controller';
import { FabricRequestHandlingService } from './fabric-request-handling.service';
import { FabricRequestHandlingInfoService } from './fabric-request-handling-info.service';
import { FabricRequestHandlingHelperService } from './fabric-request-handling-helper.service';
import { WhMatRequestHeaderEntity } from '../entities/wh-mat-request-header.entity';
import { WhMatRequestLineEntity } from '../entities/wh-mat-request-line.entity';
import { WhMatRequestLineItemEntity } from '../entities/wh-mat-request-line-item.entity';
import { WhRequestHeaderRepo } from '../repositories/wh-request-header.repository';
import { WhRequestLineRepo } from '../repositories/wh-request-line.repository';
import { WhRequestLineItemRepo } from '../repositories/wh-request-line-item.repository';
import { PackingListModule } from '../../packing-list/packing-list.module';
import { DocketMaterialServices, LayReportingService } from '@xpparel/shared-services';
import { FabricRequestCreationModule } from '../fabric-request-creation/fabric-request-creation.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      WhMatRequestHeaderEntity, WhMatRequestLineEntity, WhMatRequestLineItemEntity
    ]),
    MasterDataModule,
    forwardRef(()=> PackingListModule),
    forwardRef(()=> GrnModule),
    FabricRequestCreationModule
  ],
  controllers: [FabricRequestHandlingController],
  providers: [
    FabricRequestHandlingService, FabricRequestHandlingInfoService, FabricRequestHandlingHelperService,
    WhRequestHeaderRepo, WhRequestLineRepo, WhRequestLineItemRepo, DocketMaterialServices,
    LayReportingService
  ],
  exports: [
    FabricRequestHandlingService, FabricRequestHandlingInfoService, FabricRequestHandlingHelperService
  ]
})
export class FabricRequestHandlingModule { }
