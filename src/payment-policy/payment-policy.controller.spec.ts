import { Test, TestingModule } from '@nestjs/testing';
import { PaymentPolicyController } from './payment-policy.controller';

describe('PaymentPolicyController', () => {
  let controller: PaymentPolicyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentPolicyController],
    }).compile();

    controller = module.get<PaymentPolicyController>(PaymentPolicyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
