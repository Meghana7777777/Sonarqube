import { forwardRef, Inject, MiddlewareConsumer, Module } from '@nestjs/common';
import { BullQueueService } from './bull-queue.service';
import { BullQueueController } from './bull-queue.controller';
import { BullModule } from '@nestjs/bull';
import { BullQueueRegister } from './bull-queue-register';
import { AudioConsumer } from './processors/add-audio-queue.processor';
import { RedisHelperService } from '../../config/redis/redis-helper.service';
import { BullArenaUIProvider } from './bull-board/bull-arena-ui-provider';
import Arena from 'bull-arena';
import Bull from "bull";
import { WMSInsProcessor } from './processors/update-showIn-inventory.processor';
import { FabricInspectionInfoService } from '@xpparel/shared-services';
import { InspectionHelperService } from '../inspection-helper.ts/inspection-helper.service';
import { InspectionHelperModule } from '../inspection-helper.ts/inspection-helper.module';
import { WMSupdateShadeProcessor } from './processors/update-shade-details.processor';

@Module({
  imports: [
    ...BullQueueRegister,
    forwardRef(() => InspectionHelperModule),
  ],
  
  providers: [BullQueueService, AudioConsumer, RedisHelperService, BullArenaUIProvider,WMSInsProcessor,FabricInspectionInfoService,WMSupdateShadeProcessor,
    {
      provide: 'arenaQueues',
      useFactory: async (arenaService: BullArenaUIProvider) => arenaService.createArenaQueues(),
      inject: [BullArenaUIProvider],
    },],
  controllers: [BullQueueController],
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
