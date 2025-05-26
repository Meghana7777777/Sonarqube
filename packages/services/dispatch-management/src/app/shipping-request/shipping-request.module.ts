import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingRequestInfoService } from './shipping-request-info.service';
import { ShippingRequestHelperService } from './shipping-request-helper.service';
import { ShippingRequestService } from './shipping-request.service';
import { ShippingRequestController } from './shipping-request.controller';
import { SRequestItemRepository } from './repository/s-request-item-repository';
import { SRequestItemTruckMapRepository } from './repository/s-request-item-truck-map.repository';
import { SRequestProceedingRepository } from './repository/s-request-proceeding-repository';
import { SRequestRepository } from './repository/s-request-repository';
import { SRequestTruckRepository } from './repository/s-request-truck-repository';
import { SRequestItemEntity } from './entites/s-request-item.entity';
import { SRequestItemTruckMapEntity } from './entites/s-request-item-truck-map.entity';
import { SRequestProceedingEntity } from './entites/s-request-proceeding.entity';
import { SRequestEntity } from './entites/s-request.entity';
import { SRequestTruckEntity } from './entites/s-request-truck.entity';
import { SRequestVendorRepository } from './repository/s-request-vendor.repository';
import { SRequestVendorEntity } from './entites/s-request-vendor.entity';
import { DispatchSetModule } from '../dispatch-set/dispatch-set.module';
import { DispatchReadyModule } from '../dispatch-ready/dispatch-ready.module';
import { SRequestItemAttrRepository } from './repository/s-request-item-attr.repository';
import { SRequestItemAttrEntity } from './entites/s-request-item-attr.entity';
import { VendorService } from '@xpparel/shared-services';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            SRequestItemEntity, SRequestItemTruckMapEntity, SRequestProceedingEntity, SRequestEntity, SRequestTruckEntity, SRequestVendorEntity,
            SRequestItemAttrEntity
        ]),
        forwardRef(() => DispatchSetModule),
        forwardRef(() => DispatchReadyModule)
    ],
    controllers: [ShippingRequestController],
    providers: [
        ShippingRequestInfoService, ShippingRequestHelperService, ShippingRequestService,
        SRequestItemRepository, SRequestItemTruckMapRepository,
        SRequestProceedingRepository, SRequestRepository, SRequestTruckRepository, SRequestVendorRepository, SRequestItemAttrRepository, VendorService
    ],
    exports: [ShippingRequestInfoService, ShippingRequestHelperService, ShippingRequestService]
})
export class ShippingRequestModule { }