import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '../database';
import { ConfigModule } from '@nestjs/config';

import configuration from '../config/configuration';
import { BullQueueModule } from './bull-queue/bull-queue.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
      load: [configuration],
    }),
    DatabaseModule,
    BullQueueModule
  ],
  controllers: [AppController],
  providers: [AppService,
    
  ],
})
export class AppModule {}
