import { Test, TestingModule } from '@nestjs/testing';
import { KnittingConfigurationService } from './knitting-configuration.service';

describe('KnittingConfigurationService', () => {
  let service: KnittingConfigurationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KnittingConfigurationService],
    }).compile();

    service = module.get<KnittingConfigurationService>(KnittingConfigurationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
