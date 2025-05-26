import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '../database';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';
import { ShippingRequestModule } from './shipping-request/shipping-request.module';
import { DispatchSetModule } from './dispatch-set/dispatch-set.module';
import { DispatchReadyModule } from './dispatch-ready/dispatch-ready.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
      load: [configuration],
    }),
    DatabaseModule,
    DispatchReadyModule,
    ShippingRequestModule,
    DispatchSetModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
