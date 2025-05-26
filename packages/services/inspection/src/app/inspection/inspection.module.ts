import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsApprovalHierarchyEntity } from '../entities/ins-approval-hierarchy.entity';
import { InsRequestAttributeEntity } from '../entities/ins-request-attributes.entity';
import { InsRequestHistoryEntity } from '../entities/ins-request-history.entity';
import { InsRequestItemEntity } from '../entities/ins-request-items.entity';
import { InsRequestRevisionEntity } from '../entities/ins-request-revision.entity';
import { InsRequestEntity } from '../entities/ins-request.entity';
import { InspectionService } from './inspection.service';
import { InsApprovalHierarchyRepo } from './repositories/ins-approval-hierarchy.repository';
import { InsRequestAttributeRepo } from './repositories/ins-request-attributes.repository';
import { InsRequestHistoryRepo } from './repositories/ins-request-history.repository';
import { InsRequestItemRepo } from './repositories/ins-request-items.repository';
import { InsRequestRevisionRepo } from './repositories/ins-request-revision.repository';
import { InsRequestEntityRepo } from './repositories/ins-request.repository';
// import { PackingListModule } from '../packing-list/packing-list.module';
import { InspectionConfirmationService } from './inspection-confirmation.service';
// import { GrnModule } from '../grn/grn.module';
import { InsFpDefectEntity } from '../entities/ins-fp-defect.entity';
import { InsGsmEntity } from '../entities/ins-gsm.entity';
import { InsShadeEntity } from '../entities/ins-shade.entity';
import { InsShrinkageEntity } from '../entities/ins-shrinkage.entity';
import { InsThreadDefects } from '../entities/ins-thread-defects.entity';
import { InsThreadEntity } from '../entities/ins-thread.entity';
import { InsTrimDefects } from '../entities/ins-trim-defects.entity';
import { InsTrimEntity } from '../entities/ins-trim.entity';
import { InsYarnDefects } from '../entities/ins-yarn-defects.entity';
import { InsYarnEntity } from '../entities/ins-yarn.entity';
import { InsCartonActualInfoEntity } from '../entities/ins_cartons_actual_info.entity';
import { InsRelaxationEntity } from '../entities/ins_relaxation.entity';
import { InsRequestLinesEntity } from '../entities/ins_request_lines.entity';
import { InspectionAnalysisDashboardService } from './inspection-analysis-dashboard.service';
// import { PhItemLinesRepo } from '../packing-list/repository/ph-item-lines.repository';

@Module({
  imports: [TypeOrmModule.forFeature([InsApprovalHierarchyEntity,InsRequestAttributeEntity,InsRequestHistoryEntity,InsRequestItemEntity,InsRequestRevisionEntity,InsRequestEntity,InsCartonActualInfoEntity,InsYarnEntity,InsThreadEntity,InsYarnDefects,InsThreadDefects,InsTrimDefects,InsTrimEntity]),
  // forwardRef(() =>PackingListModule), forwardRef(() =>GrnModule)
],
  controllers: [],
  providers: [InspectionService,InsApprovalHierarchyRepo,InsRequestAttributeRepo,InsRequestHistoryRepo,InsRequestItemRepo,InsRequestRevisionRepo,InsRequestEntityRepo, InspectionConfirmationService, InspectionAnalysisDashboardService,InsRequestLinesEntity,InsRelaxationEntity, InsFpDefectEntity, InsGsmEntity, InsShadeEntity, InsShrinkageEntity,],
  exports: [InspectionService, InspectionConfirmationService,]
})
export class InspectionModule { }
