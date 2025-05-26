import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '../database';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';
import { InvCreationModule } from './inv-creation/inv-creation.module';
import { InvIssuanceModule } from './inv-issuance/inv-issuance.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
      load: [configuration],
    }),
    DatabaseModule,
    InvCreationModule,
    InvIssuanceModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
