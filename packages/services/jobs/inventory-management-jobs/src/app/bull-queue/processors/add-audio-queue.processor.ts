import { Processor, Process, OnQueueEvent, BullQueueEvents } from '@nestjs/bull';
import { InvsBullJobNames } from '@xpparel/shared-models';
import { Job } from 'bull';

@Processor(InvsBullJobNames.AUDIO)
export class AudioConsumer {
  @Process(InvsBullJobNames.AUDIO)
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