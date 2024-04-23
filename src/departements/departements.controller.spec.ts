import { Test, TestingModule } from '@nestjs/testing';
import { DepartementsController } from './departements.controller';

describe('DepartementsController', () => {
  let controller: DepartementsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepartementsController],
    }).compile();

    controller = module.get<DepartementsController>(DepartementsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
