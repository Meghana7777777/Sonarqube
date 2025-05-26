import { Inject, MiddlewareConsumer, Module, forwardRef } from '@nestjs/common';
import { BullQueueService } from './bull-queue.service';
import { BullQueueController } from './bull-queue.controller';
import { BullModule } from '@nestjs/bull';
import { BullQueueRegister } from './bull-queue-register';
import { AudioConsumer } from './processors/add-audio-queue.processor';
import { RedisHelperService } from '../../config/redis/redis-helper.service';
import { BullArenaUIProvider } from './bull-board/bull-arena-ui-provider';
import Arena from 'bull-arena';
import Bull from "bull";
import { DocketBundleGenerationProcessor } from './processors/docket-bundle-generation.processor';
import { DocketGenerationModule } from '../docket-generation/docket-generation.module';
import { PoDocketSerialGenerationProcessor } from './processors/po-docket-serial-generation.processor';
import { DocketPanelGenerationProcessor } from './processors/docket-panel-generation.processor';
import { DocketConfirmProcessor } from './processors/docket-confirm.processor';
import { DocketMaterialModule } from '../docket-material/docket-material.module';
import { DocketMaterialUnlockProcessor } from './processors/docket-material-unlock.processor';
import { PoLayCutReportingProcessor } from './processors/cut-reporting/po-lay-cut-reporting.processor';
import { PoDbCutReportingProcessor } from './processors/cut-reporting/po-db-cut-reporting.processor';
import { PoLayCutReversalProcessor } from './processors/cut-reporting/po-lay-cut-reversal.processor';
import { CutReportingModule } from '../cut-reporting/cut-reporting.module';
import { CutGenerationModule } from '../cut-generation/cut-generation.module';
import { CutNumberGenerationProcessor } from './processors/cut-number-generation.processor';
import { PendingRollsToOnfloorProcessor } from './processors/cut-reporting/pending-rolls-to-onfloor.processor';
import { UpdateConsumedStockToExtSystemProcessor } from './processors/cut-reporting/update-consumed-fab-to-ext-system.processor';
import { UpdateAllocationStockToExtSystemProcessor } from './processors/update-alloc-fab-to-ext-system.processor';
import { UpdateIssuanceStockToExtSystemProcessor } from './processors/update-issue-fab-to-ext-system.processor';

@Module({
  imports: [
    ...BullQueueRegister,
    forwardRef(() => DocketGenerationModule),
    forwardRef(() => DocketMaterialModule),
    forwardRef(() => CutReportingModule),
    forwardRef(() => CutGenerationModule),
  ],
  
  providers: [
    BullQueueService, AudioConsumer, RedisHelperService, BullArenaUIProvider, DocketBundleGenerationProcessor,PoDocketSerialGenerationProcessor, DocketPanelGenerationProcessor,DocketConfirmProcessor,DocketMaterialUnlockProcessor,
    PoLayCutReportingProcessor, PoDbCutReportingProcessor, PoLayCutReversalProcessor,
    CutNumberGenerationProcessor, PendingRollsToOnfloorProcessor, UpdateConsumedStockToExtSystemProcessor,UpdateAllocationStockToExtSystemProcessor, UpdateIssuanceStockToExtSystemProcessor,
    {
      provide: 'arenaQueues',
      useFactory: async (arenaService: BullArenaUIProvider) => arenaService.createArenaQueues(),
      inject: [BullArenaUIProvider],
    },
  ],
  controllers: [BullQueueController],
  exports: [AudioConsumer, BullQueueService]
})
export class BullQueueModule {
  constructor(@Inject('arenaQueues') private queues) { }
  configure(consumer: MiddlewareConsumer) {
    // Now, you can use the asynchronously created this.queues here
    const arena = Arena({ Bull, queues: this.queues }, { disableListen: true });
    consumer.apply(arena).forRoutes('/arena/dashboard');

    // Rapid core
    // consumer.apply(CorrelationMiddleware).exclude('/health').forRoutes('*');
  }
}
