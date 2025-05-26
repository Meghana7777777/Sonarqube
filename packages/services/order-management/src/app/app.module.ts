import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '../database';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';
import { OrderConfigModule } from './order-config/order-config.module';
import { OrderCreationModule } from './order-creation/order-creation.module';
import { ProcessTypeModule } from './masters/process-type/process-type-module';
import { StyleModule } from './masters/style-master/style-module';
import { ProductsModule } from './masters/product-master/product-module';
const axios = require('axios');
const https = require('https');
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CustomerModule } from './masters/customer/customer-module';
import { StyleOpRoutingModule } from './style-management/style-op-routing.module';
import { ItemModule } from './masters/bom-item-master/bom-item-module';
import { ProductTypeModule } from './masters/product-type/product-type.module';
import { ComponentModule } from './masters/component/component.module';
import { OrderManagementModule } from './order-management/order-management.module';
import { SaleOrderCreationModule } from './sale-order-creation/sale-order-creation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
      load: [configuration],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'../../../../packages/services/order-management/upload-files/process-type-images/'),
      serveRoot: '/oms-files',
      serveStaticOptions: {
        redirect: false,
        index: false,
      }
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'../../../../packages/services/order-management/upload-files/style-images/'),
      serveRoot: '/oms-style-files',
      serveStaticOptions: {
        redirect: false,
        index: false,
      }
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'../../../../packages/services/order-management/upload-files/products-images/'),
      serveRoot: '/oms-products-files',
      serveStaticOptions: {
        redirect: false,
        index: false,
      }
    }),
    ServeStaticModule.forRoot({
      // rootPath: join(__dirname,'../../../../packages/services/order-management/upload-files/customers-images/'),
      rootPath: join(__dirname,'../../../../packages/services/order-management/upload-files/customer-images/'),
      serveRoot: '/oms-customer-files',
      serveStaticOptions: {
        redirect: false,
        index: false,
      }
    }),
    DatabaseModule,
    OrderConfigModule,
    OrderCreationModule,
    ProcessTypeModule,
    StyleModule,
    ProductsModule,
    CustomerModule,
    StyleOpRoutingModule,
    ItemModule,
    ProductTypeModule,
    ComponentModule,
    OrderManagementModule,
    SaleOrderCreationModule
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
