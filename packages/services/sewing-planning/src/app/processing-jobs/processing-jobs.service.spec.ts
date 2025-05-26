import { Test, TestingModule } from '@nestjs/testing';
import { ProcessingJobsService } from './processing-jobs.service';

describe('ProcessingJobsService', () => {
  let service: ProcessingJobsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProcessingJobsService],
    }).compile();

    service = module.get<ProcessingJobsService>(ProcessingJobsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
