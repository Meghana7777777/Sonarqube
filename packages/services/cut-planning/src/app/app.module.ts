import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';
import { DatabaseModule } from '../database';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullQueueModule } from './bull-queue/bull-queue.module';
import { DocketGenerationModule } from './docket-generation/docket-generation.module';
import { DocketMaterialModule } from './docket-material/docket-material.module';
import { DocketPlanningModule } from './docket-planning/docket-planning.module';
import { CutTableModule } from './master/cut-table/cut-table.module';
import { LayReportingModule } from './lay-reporting/lay-reporting.module';
import { CutReportingModule } from './cut-reporting/cut-reporting.module';
import { CutGenerationModule } from './cut-generation/cut-generation.module';
import { MrnModule } from './mrn/mrn.module';
import { CutDispatchModule } from './cut-dispatch/cut-dispatch.module';
import { PslModule } from './psl/psl.module';
import { BundlingModule } from './bundling/bundling.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
      load: [configuration],
    }),
    DatabaseModule,
    DocketGenerationModule,
    DocketMaterialModule,
    DocketPlanningModule,
    BullQueueModule,
    CutTableModule,
    LayReportingModule,
    CutReportingModule,
    CutGenerationModule,
    MrnModule,
    CutDispatchModule,
    PslModule,
    BundlingModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
