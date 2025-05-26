import { Test, TestingModule } from '@nestjs/testing';
import { KnittingJobsPlanningController } from './knitting-jobs-planning.controller';

describe('KnittingJobsPlanningController', () => {
  let controller: KnittingJobsPlanningController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KnittingJobsPlanningController],
    }).compile();

    controller = module.get<KnittingJobsPlanningController>(KnittingJobsPlanningController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
