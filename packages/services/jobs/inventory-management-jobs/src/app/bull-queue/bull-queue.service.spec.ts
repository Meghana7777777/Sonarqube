import { Test, TestingModule } from '@nestjs/testing';
import { InvsBullQueueService } from '../invs-jobs/invs-bull-jobs.service';

describe('InvsBullQueueService', () => {
  let service: InvsBullQueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvsBullQueueService],
    }).compile();

    service = module.get<InvsBullQueueService>(InvsBullQueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
