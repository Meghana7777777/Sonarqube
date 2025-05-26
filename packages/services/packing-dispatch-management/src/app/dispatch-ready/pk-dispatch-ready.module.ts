import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PkDispatchReadyService } from './pk-dispatch-ready.service';
import { PkDispatchReadyController } from './pk-dispatch-ready.controller';
import { DSetContainerRepository } from './repository/d-set-container-repository';
import { DSetSubItemContainerMapRepository } from './repository/d-set-sub-item-container-map.repository';
import { DSetContainerEntity } from './entity/d-set-container.entity';
import { DSetSubItemContainerMapEntity } from './entity/d-set-sub-item-container-map.entity';
import { PkDispatchReadyInfoService } from './pk-dispatch-ready-info.service';
import { PkDispatchReadyHelperService } from './pk-dispatch-ready-helper.service';
import { PkDispatchSetModule } from '../dispatch-set/pk-dispatch-set.module';
import { DSetItemAttrRepository } from '../dispatch-set/repository/d-set-item-attr.repository';
import { DSetItemRepository } from '../dispatch-set/repository/d-set-item-repository';
import { DSetProceedingRepository } from '../dispatch-set/repository/d-set-proceeding-repository';
import { DSetRepository } from '../dispatch-set/repository/d-set-repository';
import { DSetSubItemAttrRepository } from '../dispatch-set/repository/d-set-sub-item-attr.repository';
import { DSetSubItemRepository } from '../dispatch-set/repository/d-set-sub-item-repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([DSetContainerEntity, DSetSubItemContainerMapEntity]),
        forwardRef(()=>PkDispatchSetModule)
    ],
    controllers: [PkDispatchReadyController],
    providers: [
        PkDispatchReadyInfoService, PkDispatchReadyHelperService, PkDispatchReadyService, 
        DSetContainerRepository, DSetSubItemContainerMapRepository,
        DSetItemAttrRepository, DSetItemRepository, DSetProceedingRepository, DSetRepository, DSetSubItemAttrRepository, DSetSubItemRepository
    ],
    exports: [PkDispatchReadyInfoService, PkDispatchReadyHelperService, PkDispatchReadyService]
})
export class PkDispatchReadyModule { }
