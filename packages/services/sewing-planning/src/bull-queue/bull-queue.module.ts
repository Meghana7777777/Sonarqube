import { Inject, MiddlewareConsumer, Module, forwardRef } from '@nestjs/common';
import { BullQueueService } from './bull-queue.service';
import { BullQueueController } from './bull-queue.controller';
import { BullModule } from '@nestjs/bull';
import { BullQueueRegister } from './bull-queue-register';
import { BullArenaUIProvider } from './bull-board/bull-arena-ui-provider';
import Arena from 'bull-arena';
import Bull from "bull";
import { SewingJobGenerationModule } from '../app/sewing-job-generation/sewing-job-generation.module';
import { RedisHelperService } from '../config/redis/redis-helper.service';
import { PopulateSewFgsProcessor } from './processors/sew-fgs-population.processor';
// import { SewingOrderModule } from '../app/sewing-order-creation/sewing-order/sewing-order.module';

@Module({
  imports: [
    ...BullQueueRegister,
    // forwardRef(() => SewingOrderModule),
  ],
  
  providers: [
    BullQueueService, RedisHelperService, BullArenaUIProvider,PopulateSewFgsProcessor,
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
