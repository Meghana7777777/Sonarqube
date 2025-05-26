import { Test, TestingModule } from '@nestjs/testing';
import { DowntimeController } from './downtime.controller';

describe('DowntimeController', () => {
  let controller: DowntimeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DowntimeController],
    }).compile();

    controller = module.get<DowntimeController>(DowntimeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
