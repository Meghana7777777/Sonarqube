import { Test, TestingModule } from '@nestjs/testing';
import { KnittingJobsReportingService } from './knitting-jobs-reporting.service';

describe('KnittingJobsReportingService', () => {
  let service: KnittingJobsReportingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KnittingJobsReportingService],
    }).compile();

    service = module.get<KnittingJobsReportingService>(KnittingJobsReportingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
