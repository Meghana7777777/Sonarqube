import { Test, TestingModule } from '@nestjs/testing';
import { InvsBullQueueController } from '../invs-jobs/invs-bull-jobs.controller';

describe('InvsBullQueueController', () => {
  let controller: InvsBullQueueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvsBullQueueController],
    }).compile();

    controller = module.get<InvsBullQueueController>(InvsBullQueueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
