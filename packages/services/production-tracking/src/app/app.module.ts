import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';
import { AppController } from '../app/app.controller';
import { AppService } from '../app/app.service';
import { DatabaseModule } from '../database';
import { FgCreationModule } from './fg-creation/fg-creation.module';
import { InvReceivingModule } from './inv-receiving/inv-receiving.module';
import { OpReportingModule } from './op-reporting/op-reporting.module';
import { ScheduleModule } from '@nestjs/schedule';


@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
      load: [configuration],
    }),
   DatabaseModule,
   FgCreationModule,
   InvReceivingModule,
   OpReportingModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
