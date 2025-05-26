import { Test, TestingModule } from '@nestjs/testing';
import { OmsBullQueueController } from '../oms-jobs/oms-bull-jobs.controller';

describe('OmsBullQueueController', () => {
  let controller: OmsBullQueueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OmsBullQueueController],
    }).compile();

    controller = module.get<OmsBullQueueController>(OmsBullQueueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
