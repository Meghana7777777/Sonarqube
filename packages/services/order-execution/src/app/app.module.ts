import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '../database';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';
import { PoMaterialModule } from './po-material/po-material.module';
import { PoRatioModule } from './po-ratio/po-ratio.module';
import { SequenceHandlingModule } from './master/sequence-handling/sequence-handling.module';
import { MarkerTypeModule } from './master/marker-type/marker-type.module';
import { PoMarkerModule } from './po-marker/po-marker.module';
import { OpVersionModule } from './op-seq/op-version.module';
import { ProcessingOrderModule } from './processing-order/processing-order.module';

@Module({
  
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
      load: [configuration],
    }),
    DatabaseModule,
    SequenceHandlingModule,
    PoMaterialModule,
    PoRatioModule,
    MarkerTypeModule,
    PoMarkerModule,
    OpVersionModule,
    ProcessingOrderModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
