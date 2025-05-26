import { Test, TestingModule } from '@nestjs/testing';
import { SewingJobGenerationService } from './sewing-job-generation.service';

describe('SewingJobGenerationService', () => {
  let service: SewingJobGenerationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SewingJobGenerationService],
    }).compile();

    service = module.get<SewingJobGenerationService>(SewingJobGenerationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
