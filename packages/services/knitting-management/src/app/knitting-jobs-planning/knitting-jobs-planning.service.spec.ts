import { Test, TestingModule } from '@nestjs/testing';
import { KnittingJobsPlanningService } from './knitting-jobs-planning.service';

describe('KnittingJobsPlanningService', () => {
  let service: KnittingJobsPlanningService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KnittingJobsPlanningService],
    }).compile();

    service = module.get<KnittingJobsPlanningService>(KnittingJobsPlanningService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
