import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '../database';
import { ConfigModule } from '@nestjs/config';
import { ProcessingOrderModule } from './processing-order/processing-order.module';
import { KnittingJobsModule } from './knitting-jobs/knitting-jobs.module';
import { KnittingJobsPlanningController } from './knitting-jobs-planning/knitting-jobs-planning.controller';
import { KnittingJobsPlanningModule } from './knitting-jobs-planning/knitting-jobs-planning.module';
import { KnittingJobsMaterialAllocationModule } from './knitting-jobs-material-allocation/knitting-jobs-material-allocation.module';
import { KnittingJobsReportingModule } from './knitting-jobs-reporting/knitting-jobs-reporting.module';
import configuration from '../config/configuration';
import { KnittingConfigurationModule } from './knitting-configuration/knitting-configuration.module';
import { KnittingJobsService } from './knitting-jobs/knitting-jobs.service';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
      load: [configuration],
    }),
    DatabaseModule,
    ProcessingOrderModule,
    KnittingJobsModule,
    KnittingJobsPlanningModule,
    KnittingJobsMaterialAllocationModule,
    KnittingJobsReportingModule,
    KnittingConfigurationModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    
  ],
})
export class AppModule {}
