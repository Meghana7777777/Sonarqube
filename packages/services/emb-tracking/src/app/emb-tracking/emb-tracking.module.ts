import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmbTrackingController } from './emb-tracking.controller';
import { EmbTrackingService } from './emb-tracking.service';
import { EmbTrackingHelperService } from './emb-tracking-helper.service';
import { EmbTrackingInfoService } from './emb-tracking-info.service';
import { EmbOpHeaderEntity } from './entity/emb-op-header.entity';
import { EmbOpLineEntity } from './entity/emb-op-line.entity';
import { EmbTransactionLogEntity } from './entity/emb-transaction-log.entity';
import { EmbOpHeaderRepository } from './repository/emb-op-header.repository';
import { EmbOpLineRepository } from './repository/emb-op-line.repository';
import { EmbTransactionLogRepository } from './repository/emb-transaction-log.repository';
import { EmbRequestModule } from '../emb-request/emb-request.module';
import { LayReportingService, OpVersionService } from '@xpparel/shared-services';
import { EmbRejectionModule } from '../emb-rejection/emb-rejection.module';
import { BullQueueModule } from '../bull-queue/bull-queue.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            EmbOpHeaderEntity, EmbOpLineEntity, EmbTransactionLogEntity
        ]),
        forwardRef(()=> EmbRequestModule),
        forwardRef(()=> EmbRejectionModule),
        forwardRef(()=> BullQueueModule),
    ],
    controllers: [EmbTrackingController],
    providers: [
        EmbTrackingService, EmbTrackingHelperService, EmbTrackingInfoService,
        EmbOpHeaderRepository, EmbOpLineRepository, EmbTransactionLogRepository,
        OpVersionService, LayReportingService
    ],
    exports: [EmbTrackingService, EmbTrackingHelperService, EmbTrackingInfoService]
})
export class EmbTrackingModule { }