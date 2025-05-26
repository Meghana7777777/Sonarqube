import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SequenceEntity } from './entities/sequence';
import { SequenceRepo } from './repositories/sequence.repo';
import { SequenceHandlingService } from './sequence-handling.service';

@Module({
  imports: [TypeOrmModule.forFeature([SequenceEntity])],
  controllers: [],
  providers: [SequenceHandlingService, SequenceRepo],
  exports: [SequenceHandlingService, TypeOrmModule],
})
export class SequenceHandlingModule {}
