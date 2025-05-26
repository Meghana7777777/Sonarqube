import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '../database';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';
import { ShiftModule } from './shift/shift.module';
import { EmbRequestModule } from './emb-request/emb-request.module';
import { EmbTrackingModule } from './emb-tracking/emb-tracking.module';
import { EmbRejectionModule } from './emb-rejection/emb-rejection.module';
import { BullQueueModule } from './bull-queue/bull-queue.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
      load: [configuration],
    }),
    BullQueueModule,
    DatabaseModule,
    ShiftModule,
    EmbRequestModule,
    EmbTrackingModule,
    EmbRejectionModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
