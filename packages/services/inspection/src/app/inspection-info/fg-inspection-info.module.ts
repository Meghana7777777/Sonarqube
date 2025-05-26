import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GrnServices, InsPackingHelperService, InspectionHelperService } from '@xpparel/shared-services';
import { FabricInspectionController } from '../inspection-capturing/fabric-inspection.controller';
import { FabricInspectionService } from '../inspection-capturing/fabric-inspection.service';
import { InsCartonActualInfoRepo } from '../inspection/repositories/ins-carton-actual-info.repository';
import { InsFpDefectCapturingRepo } from '../inspection/repositories/ins-fp-defect-capturing.repository';
import { InsGsmRepo } from '../inspection/repositories/ins-gsm.repository';
import { InsRelaxationRepo } from '../inspection/repositories/ins-relaxation.repository';
import { InsRequestAttributeRepo } from '../inspection/repositories/ins-request-attributes.repository';
import { InsRequestItemRepo } from '../inspection/repositories/ins-request-items.repository';
import { InsRequestLinesRepository } from '../inspection/repositories/ins-request-lines.repository';
import { InsRequestEntityRepo } from '../inspection/repositories/ins-request.repository';
import { InsRollActualRepo } from '../inspection/repositories/ins-roll-actual.repo';
import { InsShadeRepo } from '../inspection/repositories/ins-shade.repository';
import { InsShrinkageRepo } from '../inspection/repositories/ins-shrinkage.repository';
import { IReasonRepo } from '../masters/repositories/i-reason.repository';
import { FgInspectionInfoController } from './fg-inspection-info.controller';
import { FgInspectionInfoService } from './fg-inspection-info.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([]),
  ],
  controllers: [FgInspectionInfoController],
  providers: [FgInspectionInfoService,InsRequestEntityRepo,InsRequestItemRepo,InsRequestAttributeRepo,InsRequestLinesRepository,GrnServices,InspectionHelperService,InsFpDefectCapturingRepo,InsGsmRepo,InsRelaxationRepo,InsShadeRepo,InsShrinkageRepo,InsCartonActualInfoRepo, InsRollActualRepo, InsPackingHelperService, IReasonRepo,],
  exports: []
})

export class FgInspectionInfoModule {}
