import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import path from 'path';
import configuration from '../config/configuration';
import { DatabaseModule } from '../database';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApproverModule } from './approver/approver-module';
import { EscallationModule } from './escallation/escallation.module';
import { QualityCheckListModule } from './quality-check-list/quality-check-list.module';
import { QualityTypeModule } from './quality-type/quality-type-module';
import { ProductionDefectsModule } from './production-defects/production-defects.module';
import { PoCreationModule } from './po-creation/po-creation.module';
import { QualityConfigurationModule } from './quality-configuration/quality-configuration.module';
import { QualityChecksModule } from './quality-checks/quality-checks.module';
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
    QualityTypeModule,
    EscallationModule,
    ApproverModule,
    QualityCheckListModule,
    ProductionDefectsModule,
    PoCreationModule,
    QualityConfigurationModule,
    QualityChecksModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
