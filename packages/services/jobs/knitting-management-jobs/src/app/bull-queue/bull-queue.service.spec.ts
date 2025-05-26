import { Test, TestingModule } from '@nestjs/testing';
import { KmsBullQueueService } from '../kms-jobs/kms-bull-jobs.service';

describe('KmsBullQueueService', () => {
  let service: KmsBullQueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KmsBullQueueService],
    }).compile();

    service = module.get<KmsBullQueueService>(KmsBullQueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
