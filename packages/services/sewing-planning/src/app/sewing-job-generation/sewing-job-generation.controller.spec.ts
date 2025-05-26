import { Test, TestingModule } from '@nestjs/testing';
import { SewingJobGenerationController } from './sewing-job-generation.controller';

describe('SewingJobGenerationController', () => {
  let controller: SewingJobGenerationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SewingJobGenerationController],
    }).compile();

    controller = module.get<SewingJobGenerationController>(SewingJobGenerationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
