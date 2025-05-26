import { Processor, Process, OnQueueEvent, BullQueueEvents } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('audio')
export class AudioConsumer {
  @Process('audio')
  async transcode(job: Job<unknown>) {
    console.log(job);
    console.log('I am coming to processor')
    console.log(job.data);
    return true;
  }

  @OnQueueEvent(BullQueueEvents.ERROR)
  onError(job: Job, err: Error) {
  }

  @OnQueueEvent(BullQueueEvents.FAILED)
  onFailed(job: Job, err: Error) {
  }

  @OnQueueEvent(BullQueueEvents.COMPLETED)
  onCompleted(job: Job) {
    job.progress(100);
  }
}