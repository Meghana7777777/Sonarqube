import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PkDispatchSetHelperService } from './pk-dispatch-set-helper.service';
import { PkDispatchSetService } from './pk-dispatch-set.service';
import { PkDispatchSetController } from './pk-dispatch-set.controller';
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
import { CutGenerationServices, PackListService, POService } from '@xpparel/shared-services';
import { PkDispatchReadyModule } from '../dispatch-ready/pk-dispatch-ready.module';
import { DSetSubItemContainerMapRepository } from '../dispatch-ready/repository/d-set-sub-item-container-map.repository';
import { DSetContainerRepository } from '../dispatch-ready/repository/d-set-container-repository';
import { PkShippingRequestModule } from '../shipping-request/pk-shipping-request.module';
import { PkDispatchSetInfoService } from './pk-dispatch-set-info.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            DSetItemAttrEntity, DSetItemEntity, DSetProceedingEntity, DSetEntity, DSetSubItemAttrEntity,
            DSetSubItemEntity
        ]),
        forwardRef(()=>PkDispatchReadyModule),
        forwardRef(()=>PkShippingRequestModule)
    ],
    controllers: [PkDispatchSetController],
    providers: [
        PkDispatchSetInfoService, PkDispatchSetHelperService, PkDispatchSetService, CutGenerationServices, POService,
        DSetItemAttrRepository, DSetItemRepository, DSetProceedingRepository, DSetRepository, DSetSubItemAttrRepository, DSetSubItemRepository,
        DSetContainerRepository, DSetSubItemContainerMapRepository, PackListService
    ],
    exports: [PkDispatchSetInfoService, PkDispatchSetHelperService, PkDispatchSetService]
})
export class PkDispatchSetModule { }