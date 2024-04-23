import { Body, Controller, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { CreatePaymentPDto } from './dto/CreatedPaymentPolicy.dto';
import { PaymentPolicyService } from './payment-policy.service';
import { PaymentP } from './Schema/PaymentPolicyschema';

@Controller('payment-policy')
export class PaymentPolicyController {
    constructor(private readonly paymentPolicyService: PaymentPolicyService) {}

    @Post()
    async create(@Body() CreatePaymentPDto: CreatePaymentPDto): Promise<PaymentP> {
      return this.paymentPolicyService.create(CreatePaymentPDto);
    }
  
    @Get()
    async findAll(): Promise<PaymentP[]> {
      return this.paymentPolicyService.findAll();
    }
    @Put('/put/:id')
  async updatePayment(@Param('id') paymentId: string, @Body() updatePaymentDto: CreatePaymentPDto): Promise<PaymentP> {
    try {
      return await this.paymentPolicyService.updatePayment(paymentId, updatePaymentDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Get('get/:id')
  async findById(@Param('id') id: string): Promise<PaymentP> {
    try {
      const paymentPolicy = await this.paymentPolicyService.findById(id);
      return paymentPolicy;
    } catch (error) {
      console.error('Error while finding payment policy by ID:', error);
      return null;
    }
  }  
}
