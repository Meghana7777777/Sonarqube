import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmbRequestController } from './emb-request.controller';
import { EmbRequestService } from './emb-request.service';
import { EmbRequestHelperService } from './emb-request-helper.service';
import { EmbRequestInfoService } from './emb-request-info.service';
import { EmbHeaderRepository } from './repository/emb-header.repository';
import { EmbLineItemRepository } from './repository/emb-line-item.repository';
import { EmbHeaderEntity } from './entity/emb-header.entity';
import { EmbLineEntity } from './entity/emb-line.entity';
import { EmbLineItemEntity } from './entity/emb-line-item.entity';
import { EmbLineRepository } from './repository/emb-line.repository';
import { EmbTagsPrintRepository } from './repository/emb-tags-print.repository';
import { EmbTagsPrintEntity } from './entity/emb-tags-print.entity';
import { CutGenerationServices, CutReportingService, DocketGenerationServices, LayReportingService, OpVersionService, OrderManipulationServices, POService } from '@xpparel/shared-services';
import { EmbAttributeEntity } from './entity/emb-attribute.entity';
import { EmbAttributeRepository } from './repository/emb-attribute.repository';
import { EmbTrackingModule } from '../emb-tracking/emb-tracking.module';
import { EmbDispatchModule } from '../dispatch/emb-dispatch.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            EmbHeaderEntity, EmbLineEntity, EmbLineItemEntity, EmbTagsPrintEntity, EmbAttributeEntity
        ]),
        forwardRef(()=> EmbTrackingModule),
        forwardRef(()=> EmbDispatchModule),
    ],
    controllers: [EmbRequestController],
    providers: [
        EmbRequestService, EmbRequestHelperService, EmbRequestInfoService,
        EmbHeaderRepository, EmbLineRepository, EmbLineItemRepository, EmbTagsPrintRepository, EmbAttributeRepository,
        LayReportingService, OpVersionService, POService, DocketGenerationServices, CutReportingService, CutGenerationServices, OrderManipulationServices
    ],
    exports: [EmbRequestService, EmbRequestHelperService, EmbRequestInfoService]
})
export class EmbRequestModule { }