import { Test, TestingModule } from '@nestjs/testing';
import { WmsBullQueueController } from '../wms-jobs/wms-bull-jobs.controller';

describe('WmsBullQueueController', () => {
  let controller: WmsBullQueueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WmsBullQueueController],
    }).compile();

    controller = module.get<WmsBullQueueController>(WmsBullQueueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
