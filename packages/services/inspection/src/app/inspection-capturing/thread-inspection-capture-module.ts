import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BullQueueJobService, InspectionHelperService } from "@xpparel/shared-services";
import { InsRequestEntityRepo } from "../inspection/repositories/ins-request.repository";
import { InsThreadRepo } from "../inspection/repositories/ins-thread-actual-info.repository";
import { ThreadInspectionCaptureController } from "./thread-inspection-capture.controller";
import { ThreadInspectionCaptureService } from "./thread-inspection-capture.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
  ],
  controllers: [ThreadInspectionCaptureController],
  providers: [ThreadInspectionCaptureService,InsRequestEntityRepo,InspectionHelperService,InsThreadRepo,BullQueueJobService],
  exports: []
})

export class ThreadInspectionCaptureModule {}
