import { Module } from '@nestjs/common';
import { ModuleService } from './module.service';
import { ModuleController } from './module.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleEntity } from './module.entity';
import { ModuleRepository } from './repo/module-repo';
import { SJobLinePlanEntity } from '../../entities/s-job-line-plan';

@Module({
  imports: [TypeOrmModule.forFeature([ModuleEntity, SJobLinePlanEntity])],
  providers: [ModuleService,ModuleRepository],
  controllers: [ModuleController],
  exports: [ModuleService]
})
export class ModuleModule {}
