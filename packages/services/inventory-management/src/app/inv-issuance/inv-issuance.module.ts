import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvInRequestRepository } from '../entity/repository/inv-in-request.repository';
import { InvInRequestItemRepository } from '../entity/repository/inv-in-request-item.repository';
import { InvInRequestBundleRepository } from '../entity/repository/inv-in-request-bundle.repository';
import { InvInRequestEntity } from '../entity/inv.in.request.entity';
import { InvInRequestItemEntity } from '../entity/inv.in.request.item.entity';
import { InvInRequestBundleEntity } from '../entity/inv.in.request.bundle.entity';
import { PslInfoRepository } from '../entity/repository/psl-info.repository';
import { PslInfoEntity } from '../entity/psl-info.entity';
import { InvIssuanceController } from './inv-issuance.controller';
import { InvIssuanceService } from './inv-issuance.service';
import { InvIssuanceHelperService } from './inv-issuance-helper.service';
import { InvOutRequestService } from './inv-out-request.service';
import { InvOutRequestRepository } from '../entity/repository/inv-out-request.repository';
import { InvOutRequestItemRepository } from '../entity/repository/inv-out-request-item.repository';
import { InvOutRequestBundleRepository } from '../entity/repository/inv-out-request-barcode.repository';
import { InvOutAllocRepository } from '../entity/repository/inv-out-alloc.repository';
import { InvOutAllocBundleRepository } from '../entity/repository/inv-out-alloc-bundle.repository';
import { InvOutRequestEntity } from '../entity/inv.out.req.entity';
import { InvOutRequestItemEntity } from '../entity/inv.out.request.item.entity';
import { InvOutRequestBundleEntity } from '../entity/inv.out.request.bundle.entity';
import { InvOutAllocEntity } from '../entity/inv.out.alloc.entity';
import { InvOutAllocBundleEntity } from '../entity/inv.out.alloc.bundle.entity';
import { InvReceivingService, ProcessingJobsService } from '@xpparel/shared-services';
import { InvOutRequestActivityEntity } from '../entity/inv.out.request.activity.entity';
import { InvOutReqActivityRepository } from '../entity/repository/inv-out-req-activity.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InvInRequestEntity, InvInRequestItemEntity, InvInRequestBundleEntity,
      PslInfoEntity,
      InvOutRequestEntity, InvOutRequestItemEntity, InvOutRequestBundleEntity, InvOutAllocEntity, InvOutAllocBundleEntity,
      InvOutRequestActivityEntity
    ]),
  ],
  providers: [
    InvInRequestRepository, InvInRequestItemRepository, InvInRequestBundleRepository,
    InvOutRequestRepository, InvOutRequestItemRepository, InvOutRequestBundleRepository, InvOutAllocRepository, InvOutAllocBundleRepository,
    InvOutReqActivityRepository,
    InvIssuanceService, InvIssuanceHelperService, InvOutRequestService,
    ProcessingJobsService, InvReceivingService,PslInfoRepository
  ],
  controllers: [InvIssuanceController]
})
export class InvIssuanceModule {}
