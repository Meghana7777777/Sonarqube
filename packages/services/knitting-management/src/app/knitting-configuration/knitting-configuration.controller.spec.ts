import { Test, TestingModule } from '@nestjs/testing';
import { KnittingConfigurationController } from './knitting-configuration.controller';

describe('KnittingConfigurationController', () => {
  let controller: KnittingConfigurationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KnittingConfigurationController],
    }).compile();

    controller = module.get<KnittingConfigurationController>(KnittingConfigurationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
