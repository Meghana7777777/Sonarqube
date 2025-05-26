import { Test, TestingModule } from '@nestjs/testing';
import { BullQueueController } from './bull-queue.controller';

describe('BullQueueController', () => {
  let controller: BullQueueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BullQueueController],
    }).compile();

    controller = module.get<BullQueueController>(BullQueueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
