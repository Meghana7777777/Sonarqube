import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SequenceHandlingService } from "./sequence-handling.service";
import { SequenceRepo } from './repository/sequence.repo'
import { Sequence } from "./entity/sequence";


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Sequence
    ]),
  ],
  controllers: [],
  providers: [SequenceHandlingService, SequenceRepo],
  exports: [SequenceHandlingService]
})
export class SequenceHandlingModule { }