import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '../database';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';
import { PkShippingRequestModule } from './shipping-request/pk-shipping-request.module';
import { PkDispatchSetModule } from './dispatch-set/pk-dispatch-set.module';
import { PkDispatchReadyModule } from './dispatch-ready/pk-dispatch-ready.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
      load: [configuration],
    }),
    DatabaseModule,
    PkDispatchReadyModule,
    PkShippingRequestModule,
    PkDispatchSetModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
