import { Test, TestingModule } from '@nestjs/testing';
import { KnittingJobsReportingController } from './knitting-jobs-reporting.controller';

describe('KnittingJobsReportingController', () => {
  let controller: KnittingJobsReportingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KnittingJobsReportingController],
    }).compile();

    controller = module.get<KnittingJobsReportingController>(KnittingJobsReportingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
