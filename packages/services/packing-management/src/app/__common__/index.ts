import { Module } from '@nestjs/common';
import { SequenceHandlingModule } from './sequence-handling/sequence-handling.module';

@Module({
  imports: [SequenceHandlingModule],
})
export class CommonModule { }
