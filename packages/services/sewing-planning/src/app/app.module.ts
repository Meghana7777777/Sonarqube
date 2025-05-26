import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';
import { DatabaseModule } from '../database';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WorkstationModule } from './master/workstation/workstation.module';
import { SewingJobGenerationModule } from './sewing-job-generation/sewing-job-generation.module';
import { ModuleModule } from './master/module/module.module';
import { SectionModule } from './master/section/section.module';
import { SewingJobPlanningModule } from './sewing-job-planning/sewing-job-planning.module';
import { ForecastPlanningModule } from './forecast-planning/forecast-planning.module';
import { WorkstationOperationModule } from './master/WorkStation-operations/workstation-operation-module';
// import { SewVersionModule } from './operation-mapping/sew-mapping.module';
import { DowntimeModule } from './downtime/downtime.module';
import { BullQueueModule } from '../bull-queue/bull-queue.module';
import { ProcessingOrderModule } from './processing-order/processing-order.module';
import { ProcessingJobsModule } from './processing-jobs/processing-jobs.module';
import { InventoryModule } from './inventory/inventory.module';

console.log(configuration)
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
      load: [configuration],
    }),
    DatabaseModule,
    // WorkstationModule,
    // SewingJobGenerationModule,
    // ModuleModule,
    // SectionModule,
    // WorkstationOperationModule,
    // SewVersionModule,
    SewingJobPlanningModule,
    ForecastPlanningModule,
    // DowntimeModule,
    // ModuleModule,
    // SectionModule,
    // TrimsTrackingModule,
    // BullQueueModule,
    ProcessingOrderModule,
    ProcessingJobsModule,
    SewingJobPlanningModule,
    InventoryModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
