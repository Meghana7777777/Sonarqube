import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ThreadInspectionCreationController } from "./thread-inspection-creation.controller";
import { ThreadInspectionCreationService } from "./thread-inspection-creation.service";
import { InspectionHelperService } from "@xpparel/shared-services";
import { InsRequestHistoryRepo } from "../inspection/repositories/ins-request-history.repository";
import { InsRequestItemRepo } from "../inspection/repositories/ins-request-items.repository";
import { InsRequestEntityRepo } from "../inspection/repositories/ins-request.repository";




@Module({
  imports: [
    TypeOrmModule.forFeature([]),
  ],
  controllers: [ThreadInspectionCreationController],
  providers: [ThreadInspectionCreationService,InsRequestEntityRepo,InsRequestItemRepo,InspectionHelperService,InsRequestHistoryRepo],
  exports: [ThreadInspectionCreationService]
})

export class ThreadInspectionCreationModule {}
