import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QualityTypeRepository } from './quality-type-repo';
import { QualityTypeController } from './quality-type-controller';
import { QualityTypeService } from './quality-type-service';
import { QualityTypeEntity } from './entites/quality-type-entity';
import { QualityTypeAdapter } from './adapter/quality-type-adapter';
@Module({
  imports: [
    TypeOrmModule.forFeature([QualityTypeEntity])],
  providers: [QualityTypeAdapter,QualityTypeRepository,QualityTypeService],
  controllers: [QualityTypeController]
})
export class QualityTypeModule {}
