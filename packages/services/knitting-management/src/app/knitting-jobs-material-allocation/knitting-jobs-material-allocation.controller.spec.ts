import { Test, TestingModule } from '@nestjs/testing';
import { KnittingJobsMaterialAllocationController } from './knitting-jobs-material-allocation.controller';

describe('KnittingJobsMaterialAllocationController', () => {
  let controller: KnittingJobsMaterialAllocationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KnittingJobsMaterialAllocationController],
    }).compile();

    controller = module.get<KnittingJobsMaterialAllocationController>(KnittingJobsMaterialAllocationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
