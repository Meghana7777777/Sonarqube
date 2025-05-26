import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { YarnInspectionController } from './yarn-inspection.controller';
import { YarnInspectionService } from './yarn-inspection.service';
import { InsRequestEntityRepo } from '../inspection/repositories/ins-request.repository';
import { BullQueueJobService, InspectionHelperService } from '@xpparel/shared-services';


@Module({
  imports: [
    TypeOrmModule.forFeature([]),
  ],
  controllers: [YarnInspectionController,],
  providers: [YarnInspectionService,InsRequestEntityRepo,InspectionHelperService,BullQueueJobService],
  exports: []
})

export class YarnInspectionCaptureModule {}
