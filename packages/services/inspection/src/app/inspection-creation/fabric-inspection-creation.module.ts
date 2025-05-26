import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FabricInspectionCreationService } from './fabric-inspection-creation.service';
import { FabricInspectionCreationController } from './fabric-inspection-creation.controller';
import { InsRequestEntityRepo } from '../inspection/repositories/ins-request.repository';
import { InsRequestAttributeRepo } from '../inspection/repositories/ins-request-attributes.repository';
import { InsRequestItemRepo } from '../inspection/repositories/ins-request-items.repository';
import { InsRequestLinesRepository } from '../inspection/repositories/ins-request-lines.repository';
import { InspectionHelperService } from '@xpparel/shared-services';
import { InsRequestEntity } from '../entities/ins-request.entity';
import { InsRequestLinesEntity } from '../entities/ins_request_lines.entity';
import { InsRequestAttributeEntity } from '../entities/ins-request-attributes.entity';
import { InsRequestItemEntity } from '../entities/ins-request-items.entity';
import { InsRequestHistoryRepo } from '../inspection/repositories/ins-request-history.repository';


@Module({
  imports: [
    TypeOrmModule.forFeature([InsRequestEntity, InsRequestLinesEntity, InsRequestAttributeEntity, InsRequestItemEntity]),
  ],
  controllers: [FabricInspectionCreationController],
  providers: [FabricInspectionCreationService, InsRequestEntityRepo, InsRequestAttributeRepo, InsRequestItemRepo, InsRequestLinesRepository,InspectionHelperService,InsRequestHistoryRepo],
  exports: [FabricInspectionCreationService]
})

export class FabricInspectionCreationModule {}
