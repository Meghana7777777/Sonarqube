import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EscallationEntity } from './entites/escallation.entity';
import { EscallationAdapter } from './adapter/escallation.adapter';
import { EscallationRepo } from './escallation.repo';
import { EscallationService } from './escallation.service';
import { EscallationController } from './escallation.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([EscallationEntity])],
  providers: [EscallationAdapter,EscallationRepo,EscallationService],
  controllers: [EscallationController]
})
export class EscallationModule {}
