import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import path from 'path';
import configuration from '../config/configuration';
import { DatabaseModule } from '../database';
import { CommonModule } from './__common__';
import { MastersModule } from './__masters__';
import { InspectionPreferenceModule } from './__masters__/inspection-preference/inspection-preference-module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullQueueModule } from './bull-queue/bull-queue.module';
import { PackJobModule } from './pack-job-planning/pack-job-planning.module';
import { PackingListModule } from './packing-list/packing-list.module';
import { PackingMaterialReqModule } from './packing-material-request/packing-material-req.module';
import { PreIntegrationModule } from './pre-integrations/pre-integration.module';
import { LocationAllocationModule } from './location-allocation/location-allocation.module';
import { FgDashboardModule } from './dashboard/dahboard.module';
import { FgWarehouseReqModule } from './fg-warehouse/fg-wh-req.module';
import { InsPackingHelperModule } from './inspection-helper/ins-packing-helper.module';
import { FileUploadModule } from './__common__/file-upload/file-upload-module';
import { PkmsReportingConfigurationModule } from './__masters__/pkms-reporting-configuration/pkms-reporting-configuration-module';
import { PKMSConfigInspectionModule } from './pkms-inspection-config/pkms-inspection-config.module';
const fileDestination = path.join(__dirname, '../../../../packages/services/packing-management/upload_files')

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
      load: [configuration],
    }),
    ServeStaticModule.forRootAsync({
      useFactory: () => {
        return [
          {
            rootPath: fileDestination,
            serveStaticOptions: {
              redirect: false,
              index: false,
            }
          }
        ]
      }
    }),
    DatabaseModule,
    MastersModule,
    CommonModule,
    PreIntegrationModule,
    PackingListModule,
    PackJobModule,
    PackingMaterialReqModule,
    InspectionPreferenceModule,
    LocationAllocationModule,
    FgDashboardModule,
    FgWarehouseReqModule,
    BullQueueModule,
    FileUploadModule,
    PkmsReportingConfigurationModule,
    InsPackingHelperModule,
    PKMSConfigInspectionModule
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
