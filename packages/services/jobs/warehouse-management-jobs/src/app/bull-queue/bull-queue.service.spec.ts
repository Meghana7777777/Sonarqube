import { Test, TestingModule } from '@nestjs/testing';
import { WmsBullQueueService } from '../wms-jobs/wms-bull-jobs.service';

describe('WmsBullQueueService', () => {
  let service: WmsBullQueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WmsBullQueueService],
    }).compile();

    service = module.get<WmsBullQueueService>(WmsBullQueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
