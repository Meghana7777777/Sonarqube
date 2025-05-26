import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InspectionHelperService } from "@xpparel/shared-services";
import { InsRequestHistoryRepo } from "../inspection/repositories/ins-request-history.repository";
import { InsRequestItemRepo } from "../inspection/repositories/ins-request-items.repository";
import { InsRequestEntityRepo } from "../inspection/repositories/ins-request.repository";
import { YarnInspectionCreationController } from "./yarn-inspection-creation.controller";
import { YarnInspectionCreationService } from "./yarn-inspection-creation.service";




@Module({
  imports: [
    TypeOrmModule.forFeature([]),
  ],
  controllers: [YarnInspectionCreationController],
  providers: [YarnInspectionCreationService,InsRequestEntityRepo,InsRequestItemRepo,InspectionHelperService,InsRequestHistoryRepo],
  exports: [YarnInspectionCreationService]
})

export class YarnInspectionCreationModule {}
