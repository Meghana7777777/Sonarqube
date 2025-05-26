import { Test, TestingModule } from '@nestjs/testing';
import { OmsBullQueueService } from '../oms-jobs/oms-bull-jobs.service';

describe('OmsBullQueueService', () => {
  let service: OmsBullQueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OmsBullQueueService],
    }).compile();

    service = module.get<OmsBullQueueService>(OmsBullQueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
