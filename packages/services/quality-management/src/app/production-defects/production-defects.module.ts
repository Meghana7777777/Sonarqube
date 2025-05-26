import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductionDefectEntity } from './entites/production-defects.entity';
import { SweingPlanningEntity } from './entites/sweing-planning.entity';
import { ProductionDefectController } from './production-defects.controller';
import { ProductionDefectService } from './production-defects.service';
import { PoCreationRepository } from './repo/po-creation-repo';
import { SewingDefectRepo } from './repo/production-defects-repo';
import { SweingPlanningRepo } from './repo/sweing-planning.repo';
import { PoCreationEntity } from '../po-creation/entites/po-creation.entity';
import { EsclationsLogRepository } from '../quality-checks/repository/esclations-log.repo';
import { EsclationsLogEntity } from '../quality-checks/entities/esclations-log.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([PoCreationEntity, ProductionDefectEntity, SweingPlanningEntity,EsclationsLogEntity])],
    providers: [ProductionDefectService, SweingPlanningRepo, PoCreationRepository, SewingDefectRepo,EsclationsLogRepository],
    controllers: [ProductionDefectController]
})
export class ProductionDefectsModule { }
