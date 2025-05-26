import { Test, TestingModule } from '@nestjs/testing';
import { KmsBullQueueController } from '../kms-jobs/kms-bull-jobs.controller';

describe('KmsBullQueueController', () => {
  let controller: KmsBullQueueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KmsBullQueueController],
    }).compile();

    controller = module.get<KmsBullQueueController>(KmsBullQueueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
