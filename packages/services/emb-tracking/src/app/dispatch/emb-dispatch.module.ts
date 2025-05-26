import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmbDispatchController } from './emb-dispatch.controller';
import { EmbDispatchService } from './emb-dispatch.service';
import { EmbDispatchHelperService } from './emb-dispatch-helper.service';
import { EmbDispatchInfoService } from './emb-dispatch-info.service';
import { EmbDispatchHeaderEntity } from './entity/emb-dispatch-header.entity';
import { EmbDispatchLineEntity } from './entity/emb-dispatch-line.entity';
import { EmbDispatchProgressEntity } from './entity/emb-dispatch-progress.entity';
import { EmbDisptachHeaderRepository } from './repository/emb-dispatch-header.repository';
import { EmbDispatchLineRepository } from './repository/emb-dispatch-line.repository';
import { EmbDispatchProgressRepository } from './repository/emb-dispatch-progress.repository';
import { EmbRequestModule } from '../emb-request/emb-request.module';
import { CutGenerationServices } from '@xpparel/shared-services';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            EmbDispatchHeaderEntity, EmbDispatchLineEntity, EmbDispatchProgressEntity
        ]),
        forwardRef(()=>EmbRequestModule)
    ],
    controllers: [EmbDispatchController],
    providers: [
        EmbDispatchService, EmbDispatchHelperService, EmbDispatchInfoService, 
        EmbDisptachHeaderRepository, EmbDispatchLineRepository, EmbDispatchProgressRepository,
        CutGenerationServices
    ],
    exports: [EmbDispatchService, EmbDispatchHelperService, EmbDispatchInfoService]
})
export class EmbDispatchModule { }