import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';
import { DatabaseModule } from '../database';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullQueueModule } from './bull-queue/bull-queue.module';
import { FabricInspectionCapturingModule } from './inspection-capturing/fabric-inspection.module';
import { FgInspectionCaptureModule } from './inspection-capturing/fg-inspection.module';
import { ConfigInspectionModule } from './inspection-config/inspection-config.module';
import { FabricInspectionCreationModule } from './inspection-creation/fabric-inspection-creation.module';
import { FabricInspectionInfoModule } from './inspection-info/fabric-inspection-info.module';
import { FgInspectionInfoModule } from './inspection-info/fg-inspection-info.module';
import { InspectionModule } from './inspection/inspection.module';
import { InsMasterDataModule } from './masters/ins-master.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ThreadInspectionCreationModule } from './inspection-creation/thread-inspection.module';
import { ThreadInspectionCaptureModule } from './inspection-capturing/thread-inspection-capture-module';
import { YarnInspectionCreationModule } from './inspection-creation/yarn-inspection.module';
import { YarnInspectionInfoModule } from './inspection-info/yarn-inspection-info.module';
import { YarnInspectionCaptureModule } from './inspection-capturing/yarn-inspection.module';
import path from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThreadInspectionInfoModule } from './inspection-info/thread-inspection-info.module';
import { TrimInspectionCaptureModule } from './inspection-capturing/trim.module';
import { TrimInspectionCreationModule } from './inspection-creation/trim-inspection-creation.module';
import { TrimInspectionInfoModule } from './inspection-info/trim-inspection-info.module';
import { FgInspectionCreationModule } from './inspection-creation/fg-inspection/fg-inspection-creation.module';

const fileDestination = path.join(__dirname, '../../../../packages/services/inspection/upload_files')


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
    InspectionModule,
    NotificationsModule,
    BullQueueModule,
    InsMasterDataModule,
    FgInspectionInfoModule,
    FabricInspectionInfoModule,
    FgInspectionCreationModule,
    FabricInspectionCreationModule,
    FabricInspectionCapturingModule,
    ConfigInspectionModule,
    FgInspectionCaptureModule,
    ThreadInspectionCreationModule,
    ThreadInspectionCaptureModule,
    YarnInspectionCreationModule,
    YarnInspectionInfoModule,
    YarnInspectionCaptureModule,
    ThreadInspectionInfoModule,
    TrimInspectionCaptureModule,
    TrimInspectionInfoModule,
    TrimInspectionCreationModule,

    


  ],
  controllers: [AppController],
  providers: [AppService,],
})
export class AppModule { }
