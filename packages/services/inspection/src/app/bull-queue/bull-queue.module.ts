import { Inject, MiddlewareConsumer, Module } from '@nestjs/common';
import { PKMSInspectionConfigService, WMSInspectionConfigService } from '@xpparel/shared-services';
import Bull from "bull";
import Arena from 'bull-arena';
import { RedisHelperService } from '../../config/redis/redis-helper.service';
import { FabricInspectionCreationModule } from '../inspection-creation/fabric-inspection-creation.module';
import { ThreadInspectionCreationModule } from '../inspection-creation/thread-inspection.module';
import { YarnInspectionCreationModule } from '../inspection-creation/yarn-inspection.module';
import { BullArenaUIProvider } from './bull-board/bull-arena-ui-provider';
import { BullQueueRegister } from './bull-queue-register';
import { BullQueueController } from './bull-queue.controller';
import { BullQueueService } from './bull-queue.service';
import { FGInsProcessor } from './processors/fg-ins-gen.processor';
import { RMInsProcessor } from './processors/rm-ins-gen.processor';
import { TrimInspectionCreationModule } from '../inspection-creation/trim-inspection-creation.module';
import { FgInspectionCreationModule } from '../inspection-creation/fg-inspection/fg-inspection-creation.module';

@Module({
  imports: [
    ...BullQueueRegister,
    FabricInspectionCreationModule,
    FgInspectionCreationModule,
    YarnInspectionCreationModule,
    ThreadInspectionCreationModule,
    TrimInspectionCreationModule,
  ],

  providers: [BullQueueService, FGInsProcessor, RMInsProcessor, RedisHelperService, WMSInspectionConfigService, BullArenaUIProvider, PKMSInspectionConfigService,
    {
      provide: 'arenaQueues',
      useFactory: async (arenaService: BullArenaUIProvider) => arenaService.createArenaQueues(),
      inject: [BullArenaUIProvider],
    },],
  controllers: [BullQueueController],
  exports: [FGInsProcessor, RMInsProcessor]
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
