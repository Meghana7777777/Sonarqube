import { Module } from '@nestjs/common';
import { SewingJobGenerationService } from './sewing-job-generation.service';
import { SewingJobGenerationController } from './sewing-job-generation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SJobLinePlanEntity } from '../entities/s-job-line-plan';
import { SJobHeaderEntity } from '../entities/s-job-header.entity';
import { SJobLineEntity } from '../entities/s-job-line.entity';
import { SJobBundleEntity } from '../entities/s-job-bundle.entity';
import { SJobLineOperationsEntity } from '../entities/s-job-line-operations';
import { SJobPreferencesRepo } from '../entities/repository/s-job-preference.repository';
import { SJobHeaderRepo } from '../entities/repository/s-job-header.repository';
import { SJobSubLineRepo } from '../entities/repository/s-job-sub-line.repository';
import { SJobLinePlanRepo } from '../entities/repository/s-job-line-plan.repository';
import { SJobLineOperationsRepo } from '../entities/repository/s-job-line-operations';
import { CutReportingService, DocketGenerationServices, FgBankService, FgCreationService, FgReportingService, SewingMappingService } from '@xpparel/shared-services';
import { SJobPreferences } from '../entities/s-job-preferences.entity';
import { SewingJobGenerationForMOController } from './sewing-job-generation-for-mo.controller';
import { SewingJobGenerationServiceForMO } from './sewing-job-generation-for-mo.service';
import { SewingJobInfoServiceForMO } from './sewing-job-info.service';
import { SJobTranLogRefEntity } from '../entities/s-job-tran-log-ref.entity';
import { SJobLineOperationsHistoryRepo } from '../entities/repository/s-job-line-operations-history.repo';
import { SJobLineOperationsHistoryEntity } from '../entities/s-job-line-operations-history';
import { SJobPslRepository } from '../entities/repository/s-job-psl.repository';
import { SJobPslEntity } from '../entities/s-job-psl-entity';

@Module(
  {
    imports: [
      TypeOrmModule.forFeature([
        SJobLinePlanEntity, SJobHeaderEntity, SJobLineEntity, SJobPreferences, SJobBundleEntity, SJobLineOperationsEntity, SJobLineOperationsHistoryEntity,
        SJobTranLogRefEntity, SJobPslEntity
      ]),
    ],
    providers: [
      SewingJobGenerationService, SJobPreferencesRepo, SJobHeaderRepo, SJobSubLineRepo, SJobLinePlanRepo, SJobLineOperationsRepo, SJobLineOperationsHistoryRepo,
      CutReportingService, SewingMappingService, DocketGenerationServices, SewingJobGenerationServiceForMO,SewingJobInfoServiceForMO, FgBankService, FgReportingService, FgCreationService, SJobPslRepository
    ],
    controllers: [SewingJobGenerationController, SewingJobGenerationForMOController],
    exports: [SewingJobGenerationServiceForMO]
  })
export class SewingJobGenerationModule { }
