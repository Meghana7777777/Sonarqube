import { Test, TestingModule } from '@nestjs/testing';
import { WorkstationController } from './workstation.controller';

describe('WorkstationController', () => {
  let controller: WorkstationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkstationController],
    }).compile();

    controller = module.get<WorkstationController>(WorkstationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
