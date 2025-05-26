import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QualityCheckListEntity } from './entites/quality-check-list.entity';
import { QualityChecklistController } from './quality-check-list.controller';
import { QualityCheckListRepository } from './quality-check-list.repo';
import { QualityCheckListService } from './quality-check-list.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([QualityCheckListEntity])],
  providers: [QualityCheckListRepository, QualityCheckListService],
  controllers: [QualityChecklistController]
})
export class QualityCheckListModule { }
