import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { YarnInspectionInfoController } from "./yarn-inspection-info.controller";
import { YarnInspectionInfoService } from "./yarn-inspection-info.service";
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

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
  ],
  controllers: [YarnInspectionInfoController],
  providers: [YarnInspectionInfoService,InsRequestEntityRepo,InsRequestItemRepo,InsRequestAttributeRepo,InsRequestLinesRepository,GrnServices,InspectionHelperService,InsFpDefectCapturingRepo,InsGsmRepo,InsRelaxationRepo,InsShadeRepo,InsShrinkageRepo,InsCartonActualInfoRepo, InsRollActualRepo, InsPackingHelperService, IReasonRepo,PackingListService],
  exports: []
})

export class YarnInspectionInfoModule {}
