import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FgEntity } from '../entity/fg.entity';
import { FgOpDepEntity } from '../entity/fg-op-dep.entity';
import { FgBundleEntity } from '../entity/fg-bundle.entity';
import { ProcOrderOslEntity } from '../entity/proc-order-osl.entity';
import { ProcOrderEntity } from '../entity/proc-order.entity';
import { OslInfoEntity } from '../entity/osl-info.entity';
import { OpSequenceOpgEntity } from '../entity/op-sequence-opg.entity';
import { FgRepository } from '../entity/repository/fg.repository';
import { FgOpDepRepository } from '../entity/repository/fg-op-dep.repository';
import { OslInfoRepository } from '../entity/repository/osl-info.repository';
import { OpSequenceOpgRepository } from '../entity/repository/op-sequence-opg.repository';
import { FgBundleRepository } from '../entity/repository/fg-bundle.repository';
import { OpSequenceOpsEntity } from '../entity/op-sequence-ops.entity';
import { OpSequenceRefEntity } from '../entity/op-sequence-ref.entity';
import { InvReceivingController } from './inv-receiving.controller';
import { InvReceivingHelperService } from './inv-receiving-helper.service';
import { InvReceivingService } from './inv-receiving.service';
import { InvReceivingRepository } from '../entity/repository/inv-receiving.repository';
import { InvReceivingEntity } from '../entity/inv-receiving.entity';
import { InvIssuanceService } from '@xpparel/shared-services';
import { InvReceivingPslEntity } from '../entity/inv-receiving-psl.entity';
import { InvReceivingPslRepository } from '../entity/repository/inv-receiving-psl.repository';
import { OpReportingModule } from '../op-reporting/op-reporting.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            FgEntity, FgOpDepEntity, FgBundleEntity, 
            ProcOrderOslEntity, ProcOrderEntity, OslInfoEntity,
            OpSequenceOpgEntity, OpSequenceOpsEntity, OpSequenceRefEntity,
            InvReceivingEntity, InvReceivingPslEntity
        ]),
        forwardRef(() => OpReportingModule)
    ],
    providers: [
        FgOpDepRepository, FgRepository, FgBundleRepository, OslInfoRepository, OpSequenceOpgRepository,
        InvReceivingRepository, InvReceivingPslRepository,
        InvReceivingHelperService, InvReceivingService,
        InvIssuanceService
    ],
    controllers: [InvReceivingController],
    exports: [InvReceivingHelperService, InvReceivingService]
})
export class InvReceivingModule {}
