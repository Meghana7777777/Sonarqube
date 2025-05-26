import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TrimInspectionController } from "./trim-inspection-capture.controller";
import { TrimInspectionService } from "./trim-inspection-capture.service";
import { BullQueueJobService, InspectionHelperService } from "@xpparel/shared-services";
import { InsRequestEntityRepo } from "../inspection/repositories/ins-request.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
  ],
  controllers: [TrimInspectionController,],
  providers: [TrimInspectionService,InsRequestEntityRepo,InspectionHelperService,BullQueueJobService],
  exports: []
})

export class TrimInspectionCaptureModule {}