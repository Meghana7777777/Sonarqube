import { Module } from "@nestjs/common";
import { TrimInspectionInfoController } from "./trim-inspection-info.controller";
import { TrimInspectionInfoService } from "./trim-inspection-info.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GrnServices, InspectionHelperService, InsPackingHelperService, PackingListService } from "@xpparel/shared-services";
import { InsCartonActualInfoRepo } from "../inspection/repositories/ins-carton-actual-info.repository";
import { InsFpDefectCapturingRepo } from "../inspection/repositories/ins-fp-defect-capturing.repository";
import { InsGsmRepo } from "../inspection/repositories/ins-gsm.repository";
import { InsRelaxationRepo } from "../inspection/repositories/ins-relaxation.repository";
import { InsRequestAttributeRepo } from "../inspection/repositories/ins-request-attributes.repository";
import { InsRequestItemRepo } from "../inspection/repositories/ins-request-items.repository";
import { InsRequestLinesRepository } from "../inspection/repositories/ins-request-lines.repository";
import { InsRequestEntityRepo } from "../inspection/repositories/ins-request.repository";
import { InsRollActualRepo } from "../inspection/repositories/ins-roll-actual.repo";
import { InsShadeRepo } from "../inspection/repositories/ins-shade.repository";
import { InsShrinkageRepo } from "../inspection/repositories/ins-shrinkage.repository";
import { IReasonRepo } from "../masters/repositories/i-reason.repository";
import { InsTrimsRepo } from "../inspection/repositories/ins-trims.repository";
import { InsTrimsDefectsRepo } from "../inspection/repositories/ins-trims-defects.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
  ],
  controllers: [TrimInspectionInfoController],
  providers: [TrimInspectionInfoService,InsRequestEntityRepo,InsRequestItemRepo,InsRequestAttributeRepo,InsRequestLinesRepository,GrnServices,InspectionHelperService,InsFpDefectCapturingRepo,InsGsmRepo,InsRelaxationRepo,InsShadeRepo,InsShrinkageRepo,InsCartonActualInfoRepo, InsRollActualRepo, InsPackingHelperService, IReasonRepo,PackingListService,InsTrimsRepo,InsTrimsDefectsRepo],
  exports: []
})

export class TrimInspectionInfoModule {}