import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvCreationController } from './inv-creation.controller';
import { PslCreationService } from './psl-creation.service';
import { SPSInvCreationService } from './sps-inv-creation.service';
import { KnitInvCreationService } from './knit-inv-creation.service';
import { InvInHelperService } from './inv-in-helper.service';
import { InvInRequestRepository } from '../entity/repository/inv-in-request.repository';
import { InvInRequestItemRepository } from '../entity/repository/inv-in-request-item.repository';
import { InvInRequestBundleRepository } from '../entity/repository/inv-in-request-bundle.repository';
import { InvInRequestEntity } from '../entity/inv.in.request.entity';
import { InvInRequestItemEntity } from '../entity/inv.in.request.item.entity';
import { InvInRequestBundleEntity } from '../entity/inv.in.request.bundle.entity';
import { PslInfoRepository } from '../entity/repository/psl-info.repository';
import { PslInfoEntity } from '../entity/psl-info.entity';
import { CutBundlingService, KnittingReportingService, OrderCreationService, SpsInventoryService } from '@xpparel/shared-services';
import { CutInvCreationService } from './cut-inv-creation.service';
import { InvInfoService } from './inv-info.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InvInRequestEntity, InvInRequestItemEntity, InvInRequestBundleEntity,
      PslInfoEntity
    ]),
  ],
  providers: [
    InvInRequestRepository, InvInRequestItemRepository, InvInRequestBundleRepository,
    PslInfoRepository,
    PslCreationService, SPSInvCreationService, KnitInvCreationService, InvInHelperService,
    KnittingReportingService, OrderCreationService, CutInvCreationService, CutBundlingService, InvInfoService, SpsInventoryService
  ],
  controllers: [InvCreationController],
  exports: [PslCreationService, SPSInvCreationService, KnitInvCreationService]
})
export class InvCreationModule {}
