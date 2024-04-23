import { Test, TestingModule } from '@nestjs/testing';
import { MulterConfigController } from './multer-config.controller';

describe('MulterConfigController', () => {
  let controller: MulterConfigController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MulterConfigController],
    }).compile();

    controller = module.get<MulterConfigController>(MulterConfigController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
