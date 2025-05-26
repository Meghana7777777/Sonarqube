import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GrnServices, InspectionHelperService, LocationAllocationService, PackingListService } from '@xpparel/shared-services';
import { InsFpDefectEntity } from '../entities/ins-fp-defect.entity';
import { InsGsmEntity } from '../entities/ins-gsm.entity';
import { InsShadeEntity } from '../entities/ins-shade.entity';
import { InsShrinkageEntity } from '../entities/ins-shrinkage.entity';
import { InsRelaxationEntity } from '../entities/ins_relaxation.entity';
import { InsRequestLinesEntity } from '../entities/ins_request_lines.entity';
import { InspectionAnalysisDashboardService } from '../inspection/inspection-analysis-dashboard.service';
import { InspectionConfirmationService } from '../inspection/inspection-confirmation.service';
import { InsApprovalHierarchyRepo } from '../inspection/repositories/ins-approval-hierarchy.repository';
import { InsFpDefectCapturingRepo } from '../inspection/repositories/ins-fp-defect-capturing.repository';
import { InsGsmRepo } from '../inspection/repositories/ins-gsm.repository';
import { InsRelaxationRepo } from '../inspection/repositories/ins-relaxation.repository';
import { InsRequestAttributeRepo } from '../inspection/repositories/ins-request-attributes.repository';
import { InsRequestHistoryRepo } from '../inspection/repositories/ins-request-history.repository';
import { InsRequestItemRepo } from '../inspection/repositories/ins-request-items.repository';
import { InsRequestLinesRepository } from '../inspection/repositories/ins-request-lines.repository';
import { InsRequestRevisionRepo } from '../inspection/repositories/ins-request-revision.repository';
import { InsRequestEntityRepo } from '../inspection/repositories/ins-request.repository';
import { InsShadeRepo } from '../inspection/repositories/ins-shade.repository';
import { InsShrinkageRepo } from '../inspection/repositories/ins-shrinkage.repository';
import { FabricInspectionInfoController } from './fabric-inspection-info.controller';
import { FabricInspectionInfoService } from './fabric-inspection-info.service';
import { InsRollActualRepo } from '../inspection/repositories/ins-roll-actual.repo';


@Module({
  imports: [
    TypeOrmModule.forFeature([]),
  

  ],
  controllers: [FabricInspectionInfoController],
  providers: [FabricInspectionInfoService,InsApprovalHierarchyRepo,InsRequestAttributeRepo,InsRequestHistoryRepo,InsRequestItemRepo,InsRequestRevisionRepo,InsRequestEntityRepo, InsRequestEntityRepo, InsRequestAttributeRepo, InsRequestItemRepo, InsRequestLinesRepository,InspectionConfirmationService, InspectionAnalysisDashboardService,InsRequestLinesEntity,InsRelaxationEntity, InsFpDefectEntity, InsGsmEntity, InsShadeEntity, InsShrinkageEntity,GrnServices,InspectionHelperService,InsFpDefectCapturingRepo,InsGsmRepo,InsShadeRepo,InsShrinkageRepo,InsRelaxationRepo, PackingListService, InsRollActualRepo,LocationAllocationService],  
  exports: [FabricInspectionInfoService]
})

export class FabricInspectionInfoModule {}
