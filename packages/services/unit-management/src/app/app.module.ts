import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '../database';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';
import { ShiftModule } from './shift/shift.module';
import { OperationModule } from './operation/operation.module';
import { VendorModule } from './vendor/vendor.module';
import { ReasonsModule } from './reasons/resons.module';
import { SizesModule } from './sizes/sizes.module';
import { CompanyModule } from './company/company-module';
import { UnitsModule } from './units/units-module';
import { WarehouseModule } from './warehouse/warehouse-module';
import { WarehouseUnitmappingModule } from './warehouse-unitmapping/warehouse-unitmapping.module';
import { MasterModule } from './global-config-master/master-module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
      load: [configuration],
    }),
    DatabaseModule,
    ShiftModule,
    OperationModule,
    VendorModule,
    ReasonsModule,
    SizesModule,
    CompanyModule,
    UnitsModule,
    WarehouseModule,
    WarehouseUnitmappingModule,
    MasterModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
