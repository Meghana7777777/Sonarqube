import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TrimInspectionCreationController } from "./trim-inspection-creation.controller";
import { TrimInspectionCreationService } from "./trim-inspection-creation.service";
import { InsRequestEntityRepo } from "../inspection/repositories/ins-request.repository";
import { InspectionHelperService} from "@xpparel/shared-services";
import { InsRequestHistoryRepo } from "../inspection/repositories/ins-request-history.repository";
import { InsRequestItemRepo } from "../inspection/repositories/ins-request-items.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
  ],
  controllers: [TrimInspectionCreationController],
  providers: [TrimInspectionCreationService,InsRequestEntityRepo,InsRequestItemRepo,InspectionHelperService,InsRequestHistoryRepo],
  exports: [TrimInspectionCreationService]
})

export class TrimInspectionCreationModule {}