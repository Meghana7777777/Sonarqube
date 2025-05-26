import { Test, TestingModule } from '@nestjs/testing';
import { SpsBullQueueController } from '../sps-jobs/sps-bull-jobs.controller';

describe('SpsBullQueueController', () => {
  let controller: SpsBullQueueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpsBullQueueController],
    }).compile();

    controller = module.get<SpsBullQueueController>(SpsBullQueueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
