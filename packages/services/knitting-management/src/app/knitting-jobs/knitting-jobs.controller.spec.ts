import { Test, TestingModule } from '@nestjs/testing';
import { KnittingJobsController } from './knitting-jobs.controller';

describe('KnittingJobsController', () => {
  let controller: KnittingJobsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KnittingJobsController],
    }).compile();

    controller = module.get<KnittingJobsController>(KnittingJobsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
