import { Test, TestingModule } from '@nestjs/testing';
import { ProcessingJobsController } from './processing-jobs.controller';

describe('ProcessingJobsController', () => {
  let controller: ProcessingJobsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProcessingJobsController],
    }).compile();

    controller = module.get<ProcessingJobsController>(ProcessingJobsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
