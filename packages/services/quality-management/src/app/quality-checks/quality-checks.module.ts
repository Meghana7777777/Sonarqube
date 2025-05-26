import { forwardRef, Module } from '@nestjs/common';
import { QualityChecksController } from './quality-checks.controller';
import { QualityChecksService } from './quality-checks.service';
import { QualityChecksRepository } from './repository/quality-checks.repository';
import { QualityChecksEntity } from './entities/quality-checks.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EsclationsLogRepository } from './repository/esclations-log.repo';
import { EsclationsLogEntity } from './entities/esclations-log.entity';
import { BundleTrackingService, OpReportingService } from '@xpparel/shared-services';
import { QualityConfigurationService } from '../quality-configuration/quality-configuration.service';
import { QualityConfigurationModule } from '../quality-configuration/quality-configuration.module';
import { QualityConfigurationRepository } from '../quality-configuration/repositories/quality-configuration.repo';
import { QualityChecklistConfigRepository } from '../quality-configuration/repositories/quality-checklist-config.repo';
import { QualityEsclationsConfigRepository } from '../quality-configuration/repositories/quality-esclations-config.repo';
import { QualityTypeRepository } from '../quality-type/quality-type-repo';

@Module({
  imports: [
    forwardRef(() => QualityConfigurationModule),
    TypeOrmModule.forFeature([QualityChecksEntity, EsclationsLogEntity])],
  controllers: [QualityChecksController],
  providers: [QualityChecksService, QualityChecksRepository, EsclationsLogRepository, BundleTrackingService, QualityConfigurationService,QualityConfigurationRepository,QualityEsclationsConfigRepository,OpReportingService,QualityTypeRepository]
})
export class QualityChecksModule { }
