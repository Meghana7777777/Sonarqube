import { Test, TestingModule } from '@nestjs/testing';
import { InsBullQueueService } from '../ins-jobs/ins-bull-jobs.service';

describe('InsBullQueueService', () => {
  let service: InsBullQueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InsBullQueueService],
    }).compile();

    service = module.get<InsBullQueueService>(InsBullQueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
