import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DispatchReadyService } from './dispatch-ready.service';
import { DispatchReadyController } from './dispatch-ready.controller';
import { DSetContainerRepository } from './repository/d-set-container-repository';
import { DSetSubItemContainerMapRepository } from './repository/d-set-sub-item-container-map.repository';
import { DSetContainerEntity } from './entity/d-set-container.entity';
import { DSetSubItemContainerMapEntity } from './entity/d-set-sub-item-container-map.entity';
import { DispatchReadyInfoService } from './dispatch-ready-info.service';
import { DispatchReadyHelperService } from './dispatch-ready-helper.service';
import { DispatchSetModule } from '../dispatch-set/dispatch-set.module';
import { DSetItemAttrRepository } from '../dispatch-set/repository/d-set-item-attr.repository';
import { DSetItemRepository } from '../dispatch-set/repository/d-set-item-repository';
import { DSetProceedingRepository } from '../dispatch-set/repository/d-set-proceeding-repository';
import { DSetRepository } from '../dispatch-set/repository/d-set-repository';
import { DSetSubItemAttrRepository } from '../dispatch-set/repository/d-set-sub-item-attr.repository';
import { DSetSubItemRepository } from '../dispatch-set/repository/d-set-sub-item-repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([DSetContainerEntity, DSetSubItemContainerMapEntity]),
        forwardRef(()=>DispatchSetModule)
    ],
    controllers: [DispatchReadyController],
    providers: [
        DispatchReadyInfoService, DispatchReadyHelperService, DispatchReadyService, 
        DSetContainerRepository, DSetSubItemContainerMapRepository,
        DSetItemAttrRepository, DSetItemRepository, DSetProceedingRepository, DSetRepository, DSetSubItemAttrRepository, DSetSubItemRepository
    ],
    exports: [DispatchReadyInfoService, DispatchReadyHelperService, DispatchReadyService]
})
export class DispatchReadyModule { }
