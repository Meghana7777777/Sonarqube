import { Inject, MiddlewareConsumer, Module, forwardRef } from '@nestjs/common';
import { BullQueueService } from './bull-queue.service';
import { BullQueueController } from './bull-queue.controller';
import { BullModule } from '@nestjs/bull';
import { BullQueueRegister } from './bull-queue-register';
import { RedisHelperService } from '../../config/redis/redis-helper.service';
import { BullArenaUIProvider } from './bull-board/bull-arena-ui-provider';
import Arena from 'bull-arena';
import Bull from "bull";
import { EmbRequestGenerationProcessor } from './processors/emb-request-generation.processor';
import { EmbHeaderDeleteProcessor } from './processors/emb-header-delete.processor';
import { EmbLineDeleteProcessor } from './processors/emb-line-delete.processor';
import { EmbRequestModule } from '../emb-request/emb-request.module';
import { EmbTrackingModule } from '../emb-tracking/emb-tracking.module';
import { EmbOpQtyUpdateProcessor } from './processors/emb-op-qty-upate.processor';

@Module({
  imports: [
    ...BullQueueRegister,
    forwardRef(() => EmbRequestModule),
    forwardRef(() => EmbTrackingModule),
  ],
  
  providers: [
    BullQueueService, RedisHelperService, BullArenaUIProvider,
    EmbRequestGenerationProcessor, EmbHeaderDeleteProcessor, EmbLineDeleteProcessor, EmbOpQtyUpdateProcessor,
    {
      provide: 'arenaQueues',
      useFactory: async (arenaService: BullArenaUIProvider) => arenaService.createArenaQueues(),
      inject: [BullArenaUIProvider],
    },
  ],
  controllers: [BullQueueController],
  exports: [BullQueueService]
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
