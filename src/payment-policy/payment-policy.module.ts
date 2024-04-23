import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentPolicyController } from './payment-policy.controller';
import { PaymentPolicyService } from './payment-policy.service';
import { PaymentP, PaymentPSchema } from './Schema/PaymentPolicyschema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PaymentP.name, schema: PaymentPSchema }]),
  ],
  controllers: [PaymentPolicyController],
  providers: [PaymentPolicyService],
  exports:[PaymentPolicyService]
})
export class PaymentPolicyModule {}
