import { Inject, MiddlewareConsumer, Module } from '@nestjs/common';
import Bull from "bull";
import Arena from 'bull-arena';
import { RedisHelperService } from '../../config/redis/redis-helper.service';
import { BullArenaUIProvider } from './bull-board/bull-arena-ui-provider';
import { BullQueueRegister } from './bull-queue-register';
import { AudioConsumer } from './processors/add-audio-queue.processor';
import { OmsBullJobsModule } from '../oms-jobs/oms-bull-jobs.module';

@Module({
  imports: [
    ...BullQueueRegister,
    OmsBullJobsModule,
  ],
  
  providers: [AudioConsumer, RedisHelperService, BullArenaUIProvider,
    {
      provide: 'arenaQueues',
      useFactory: async (arenaService: BullArenaUIProvider) => arenaService.createArenaQueues(),
      inject: [BullArenaUIProvider],
    },],
  controllers: [],
  exports: [AudioConsumer]
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
