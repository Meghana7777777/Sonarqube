import { Test, TestingModule } from '@nestjs/testing';
import { PtsBullQueueService } from '../pts-jobs/pts-bull-jobs.service';

describe('PtsBullQueueService', () => {
  let service: PtsBullQueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PtsBullQueueService],
    }).compile();

    service = module.get<PtsBullQueueService>(PtsBullQueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
