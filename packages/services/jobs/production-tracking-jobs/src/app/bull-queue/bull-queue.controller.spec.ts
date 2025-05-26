import { Test, TestingModule } from '@nestjs/testing';
import { PtsBullQueueController } from '../pts-jobs/pts-bull-jobs.controller';

describe('PtsBullQueueController', () => {
  let controller: PtsBullQueueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PtsBullQueueController],
    }).compile();

    controller = module.get<PtsBullQueueController>(PtsBullQueueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
