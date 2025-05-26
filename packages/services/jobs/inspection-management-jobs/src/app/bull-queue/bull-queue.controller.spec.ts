import { Test, TestingModule } from '@nestjs/testing';
import { InsBullQueueController } from '../ins-jobs/ins-bull-jobs.controller';

describe('InsBullQueueController', () => {
  let controller: InsBullQueueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InsBullQueueController],
    }).compile();

    controller = module.get<InsBullQueueController>(InsBullQueueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
