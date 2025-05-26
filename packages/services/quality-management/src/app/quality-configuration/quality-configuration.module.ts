import { Module } from '@nestjs/common';
import { QualityConfigurationController } from './quality-configuration.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QualityConfigurationEntity } from './entities/quality-configuration.entity';
import { QualityCheckListConfigEntity } from './entities/quality-checklist-config.entity';
import { QualityEsclationsConfigEntity } from './entities/quality-esclations-config.entity';
// import { EsclationsLogEntity } from '../production-defects/entites/esclations-log.entity';
import { QualityConfigurationRepository } from './repositories/quality-configuration.repo';
import { QualityChecklistConfigRepository } from './repositories/quality-checklist-config.repo';
import { QualityEsclationsConfigRepository } from './repositories/quality-esclations-config.repo';
import { EsclationsLogRepository } from '../quality-checks/repository/esclations-log.repo';
import { EsclationsLogEntity } from '../quality-checks/entities/esclations-log.entity';
import { QualityConfigurationService } from './quality-configuration.service';
import { BundleTrackingService } from '@xpparel/shared-services';
// import { EsclationsLogRepository } from '../production-defects/repo/esclations-log.repo';

@Module({
  imports: [
    TypeOrmModule.forFeature([QualityConfigurationEntity,QualityCheckListConfigEntity,QualityEsclationsConfigEntity])],
  controllers: [QualityConfigurationController],
  providers: [QualityConfigurationService,QualityConfigurationRepository,QualityChecklistConfigRepository,QualityEsclationsConfigRepository,BundleTrackingService],
})
export class QualityConfigurationModule { }
