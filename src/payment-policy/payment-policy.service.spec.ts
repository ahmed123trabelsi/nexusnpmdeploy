import { Test, TestingModule } from '@nestjs/testing';
import { PaymentPolicyService } from './payment-policy.service';

describe('PaymentPolicyService', () => {
  let service: PaymentPolicyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentPolicyService],
    }).compile();

    service = module.get<PaymentPolicyService>(PaymentPolicyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
