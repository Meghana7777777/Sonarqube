import { Module } from '@nestjs/common';
import { BullArenaUIProvider } from './bull-arena-ui-provider';
import { BullQueueModule } from '../bull-queue.module';

@Module({
    imports: [BullQueueModule],
    exports: [],
    providers: [BullArenaUIProvider],
})
export class QueueUIModule { }