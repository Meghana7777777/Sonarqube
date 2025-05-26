import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FabricInspectionController } from './fabric-inspection.controller';
import { FabricInspectionService } from './fabric-inspection.service';
import { InsRequestEntityRepo } from '../inspection/repositories/ins-request.repository';
import { InsRequestAttributeRepo } from '../inspection/repositories/ins-request-attributes.repository';
import { InsRequestItemRepo } from '../inspection/repositories/ins-request-items.repository';
import { InsFpDefectEntity } from '../entities/ins-fp-defect.entity';
import { BullQueueJobService, InspectionHelperService } from '@xpparel/shared-services';
import { InsRelaxationEntity } from '../entities/ins_relaxation.entity';
import { InsShrinkageEntity } from '../entities/ins-shrinkage.entity';
import { InsShadeEntity } from '../entities/ins-shade.entity';
import { InsRequestRevisionEntity } from '../entities/ins-request-revision.entity';
import { InsGsmEntity } from '../entities/ins-gsm.entity';
import { InsRollsActualInfoEntity } from '../entities/ins_rolls_actual_info.entity';
import { InsGsmRepo } from '../inspection/repositories/ins-gsm.repository';
import { InsRelaxationRepo } from '../inspection/repositories/ins-relaxation.repository';
import { FileUploadEntity } from '../entities/file-upload.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([InsFpDefectEntity,InsShadeEntity, InsRelaxationEntity, InsShrinkageEntity, InsRequestRevisionEntity, InsGsmEntity, InsRollsActualInfoEntity,FileUploadEntity]),
  ],
  controllers: [FabricInspectionController],
  providers: [FabricInspectionService, InsRequestEntityRepo, InsRequestAttributeRepo, InsRequestItemRepo, InspectionHelperService, InsGsmRepo, InsRelaxationRepo,BullQueueJobService],
  exports: [FabricInspectionService]
})

export class FabricInspectionCapturingModule {}
