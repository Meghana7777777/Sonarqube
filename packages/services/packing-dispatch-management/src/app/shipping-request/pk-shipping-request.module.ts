import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PkShippingRequestInfoService } from './pk-shipping-request-info.service';
import { PkShippingRequestHelperService } from './pk-shipping-request-helper.service';
import { PkShippingRequestService } from './pk-shipping-request.service';
import { PkShippingRequestController } from './pk-shipping-request.controller';
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
import { PkDispatchSetModule } from '../dispatch-set/pk-dispatch-set.module';
import { PkDispatchReadyModule } from '../dispatch-ready/pk-dispatch-ready.module';
import { SRequestItemAttrRepository } from './repository/s-request-item-attr.repository';
import { SRequestItemAttrEntity } from './entites/s-request-item-attr.entity';
import { VendorService } from '@xpparel/shared-services';
import { PkTruckItemsService } from './pk-truct-items.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            SRequestItemEntity, SRequestItemTruckMapEntity, SRequestProceedingEntity, SRequestEntity, SRequestTruckEntity, SRequestVendorEntity,
            SRequestItemAttrEntity
        ]),
        forwardRef(() => PkDispatchSetModule),
        forwardRef(() => PkDispatchReadyModule)
    ],
    controllers: [PkShippingRequestController],
    providers: [
        PkShippingRequestInfoService, PkShippingRequestHelperService, PkShippingRequestService,
        SRequestItemRepository, SRequestItemTruckMapRepository,
        SRequestProceedingRepository, SRequestRepository, SRequestTruckRepository, SRequestVendorRepository, SRequestItemAttrRepository, VendorService, PkTruckItemsService
    ],
    exports: [PkShippingRequestInfoService, PkShippingRequestHelperService, PkShippingRequestService]
})
export class PkShippingRequestModule { }