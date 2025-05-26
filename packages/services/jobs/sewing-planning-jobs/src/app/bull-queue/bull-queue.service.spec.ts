import { Test, TestingModule } from '@nestjs/testing';
import { SpsBullQueueService } from '../sps-jobs/sps-bull-jobs.service';

describe('SpsBullQueueService', () => {
  let service: SpsBullQueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpsBullQueueService],
    }).compile();

    service = module.get<SpsBullQueueService>(SpsBullQueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
