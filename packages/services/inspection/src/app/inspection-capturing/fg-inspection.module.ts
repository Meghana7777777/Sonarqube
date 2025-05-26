import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FgInspectionService } from './fg-inspection.service';
import { FgInspectionController } from './fg-inspection.controller';
import { FabricInspectionService } from './fabric-inspection.service';
import { FabricInspectionController } from './fabric-inspection.controller';
import { InsRequestEntityRepo } from '../inspection/repositories/ins-request.repository';
import { InspectionHelperService } from '@xpparel/shared-services';
import { InsCartonActualInfoRepo } from '../inspection/repositories/ins-carton-actual-info.repository';
import { FileUploadRepo } from '../inspection/repositories/ins-file-upload.repository';


@Module({
  imports: [
    TypeOrmModule.forFeature([]),
  ],
  controllers: [FgInspectionController],
  providers: [FgInspectionService,InsRequestEntityRepo,InspectionHelperService,InsCartonActualInfoRepo,FileUploadRepo],
  exports: []
})

export class FgInspectionCaptureModule {}
