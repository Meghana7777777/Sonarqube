import { Module } from '@nestjs/common';
import { WorkstationService } from './workstation.service';
import { WorkstationController } from './workstation.controller';
import { WorkstationEntity } from './workstation.entity';
import { WorkstationRepository } from './workstation.repository';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';

@Module({
  imports: [TypeOrmModule.forFeature([WorkstationEntity])],
  providers: [WorkstationService,WorkstationRepository],
  controllers: [WorkstationController],
  exports: [WorkstationService]
})
export class WorkstationModule {}
