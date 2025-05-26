import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DispatchSetInfoService } from './dispatch-set-info.service';
import { DispatchSetHelperService } from './dispatch-set-helper.service';
import { DispatchSetService } from './dispatch-set.service';
import { DispatchSetController } from './dispatch-set.controller';
import { DSetItemAttrRepository } from './repository/d-set-item-attr.repository';
import { DSetItemRepository } from './repository/d-set-item-repository';
import { DSetProceedingRepository } from './repository/d-set-proceeding-repository';
import { DSetRepository } from './repository/d-set-repository';
import { DSetSubItemAttrRepository } from './repository/d-set-sub-item-attr.repository';
import { DSetSubItemRepository } from './repository/d-set-sub-item-repository';
import { DSetItemAttrEntity } from './entity/d-set-item-attr.entity';
import { DSetItemEntity } from './entity/d-set-item.entity';
import { DSetProceedingEntity } from './entity/d-set-proceeding.entity';
import { DSetEntity } from './entity/d-set.entity';
import { DSetSubItemAttrEntity } from './entity/d-set-sub-item-attr.entity';
import { DSetSubItemEntity } from './entity/d-set-sub-item.entity';
import { CutGenerationServices, POService } from '@xpparel/shared-services';
import { DispatchReadyModule } from '../dispatch-ready/dispatch-ready.module';
import { DSetSubItemContainerMapRepository } from '../dispatch-ready/repository/d-set-sub-item-container-map.repository';
import { DSetContainerRepository } from '../dispatch-ready/repository/d-set-container-repository';
import { ShippingRequestModule } from '../shipping-request/shipping-request.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            DSetItemAttrEntity, DSetItemEntity, DSetProceedingEntity, DSetEntity, DSetSubItemAttrEntity,
            DSetSubItemEntity
        ]),
        forwardRef(()=>DispatchReadyModule),
        forwardRef(()=>ShippingRequestModule)
    ],
    controllers: [DispatchSetController],
    providers: [
        DispatchSetInfoService, DispatchSetHelperService, DispatchSetService, CutGenerationServices, POService,
        DSetItemAttrRepository, DSetItemRepository, DSetProceedingRepository, DSetRepository, DSetSubItemAttrRepository, DSetSubItemRepository,
        DSetContainerRepository, DSetSubItemContainerMapRepository
    ],
    exports: [DispatchSetInfoService, DispatchSetHelperService, DispatchSetService]
})
export class DispatchSetModule { }