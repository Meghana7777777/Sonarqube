import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '../database';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';
import { ProductPrototypeModule } from './product-prototype/product-prototype.module';
import { OrderManipulationModule } from './order-manipulation/order-manipulation.module';
import { ComponentModule } from './master/component/component.module';
import { ProductTypeModule } from './master/product-type/product-type.module';
import { SewVersionModule } from './operation-mapping/sew-mapping.module';
import { OrderManagementModule } from './order-management/order-management.module';
const axios = require('axios');
const https = require('https');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
      load: [configuration],
    }),
    DatabaseModule,
    OrderManagementModule,
    ProductPrototypeModule,
    OrderManipulationModule,
    ComponentModule,
    ProductTypeModule,
    SewVersionModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {
  
  constructor() {
    setInterval(async () => {
      const agent = new https.Agent({
        rejectUnauthorized: false // WARNING: Only use this in development!
      });
      // const url = 'https://sfcs-gateway-cloud-v2.live.brandixlk.org/production-tracking-service/fg-reporting/triggerSfcFgsAutoReporting';
      // console.log(`Task executed at ${new Date().toISOString()}`);
      // await axios.post(url, {plantCode: "H01"},  { httpsAgent: agent });
    }, 3000); 
  }

}
