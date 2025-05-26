import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GrnModule } from '../../grn/grn.module';
import { MasterDataModule } from '../../master-data/master-data.module';
import { FabricRequestCreationController } from './fabric-request-creation.controller';
import { FabricRequestCreationService } from './fabric-request-creation.service';
import { FabricRequestCreationInfoService } from './fabric-request-creation-info.service';
import { FabricRequestCreationHelperService } from './fabric-request-creation-helper.service';
import { WhMatRequestHeaderEntity } from '../entities/wh-mat-request-header.entity';
import { WhMatRequestLineEntity } from '../entities/wh-mat-request-line.entity';
import { WhMatRequestLineItemEntity } from '../entities/wh-mat-request-line-item.entity';
import { WhRequestHeaderRepo } from '../repositories/wh-request-header.repository';
import { WhRequestLineRepo } from '../repositories/wh-request-line.repository';
import { WhRequestLineItemRepo } from '../repositories/wh-request-line-item.repository';
import { PackingListModule } from '../../packing-list/packing-list.module';
import { DocketMaterialServices } from '@xpparel/shared-services';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      WhMatRequestHeaderEntity, WhMatRequestLineEntity, WhMatRequestLineItemEntity
    ]),
    MasterDataModule,
    forwardRef(()=> PackingListModule),
    forwardRef(()=> GrnModule)
  ],
  controllers: [FabricRequestCreationController],
  providers: [
    FabricRequestCreationService, FabricRequestCreationInfoService, FabricRequestCreationHelperService,
    WhRequestHeaderRepo, WhRequestLineRepo, WhRequestLineItemRepo, DocketMaterialServices
  ],
  exports: [
    FabricRequestCreationService, FabricRequestCreationInfoService, FabricRequestCreationHelperService
  ]
})
export class FabricRequestCreationModule { }
