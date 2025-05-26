import { Test, TestingModule } from '@nestjs/testing';
import { KnittingJobsMaterialAllocationService } from './knitting-jobs-material-allocation.service';

describe('KnittingJobsMaterialAllocationService', () => {
  let service: KnittingJobsMaterialAllocationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KnittingJobsMaterialAllocationService],
    }).compile();

    service = module.get<KnittingJobsMaterialAllocationService>(KnittingJobsMaterialAllocationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
