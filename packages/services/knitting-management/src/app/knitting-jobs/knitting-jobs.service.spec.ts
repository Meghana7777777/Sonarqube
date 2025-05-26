import { Test, TestingModule } from '@nestjs/testing';
import { KnittingJobsService } from './knitting-jobs.service';

describe('KnittingJobsService', () => {
  let service: KnittingJobsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KnittingJobsService],
    }).compile();

    service = module.get<KnittingJobsService>(KnittingJobsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
