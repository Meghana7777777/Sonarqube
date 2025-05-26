import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FGLocationAllocationService, InsPackingHelperService, InspectionHelperService, PackListService } from '@xpparel/shared-services';
 
import { FgInspectionCreationController } from './fg-inspection-creation.controller';
import { FgInspectionCreationService } from './fg-inspection-creation.service';
import { InsRequestHistoryRepo } from '../../inspection/repositories/ins-request-history.repository';
import { InsRequestItemRepo } from '../../inspection/repositories/ins-request-items.repository';
import { InsRequestEntityRepo } from '../../inspection/repositories/ins-request.repository';


@Module({
  imports: [
    TypeOrmModule.forFeature([]),
  ],
  controllers: [FgInspectionCreationController],
  providers: [FgInspectionCreationService,InsRequestEntityRepo,InsRequestItemRepo,InsPackingHelperService,FGLocationAllocationService,InspectionHelperService,InsRequestHistoryRepo,PackListService],
  exports: [FgInspectionCreationService]
})

export class FgInspectionCreationModule {}
