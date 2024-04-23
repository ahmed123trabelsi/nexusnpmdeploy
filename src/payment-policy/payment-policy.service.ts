import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePaymentPDto } from './dto/CreatedPaymentPolicy.dto';
import { PaymentP } from './Schema/PaymentPolicyschema';


@Injectable()
export class PaymentPolicyService {
  constructor(@InjectModel(PaymentP.name) private paymentPolicyModel: Model<PaymentP>) {}

  
  async create(createPaymentPolicyDto: CreatePaymentPDto): Promise<PaymentP> {
    
    const createdPaymentPolicy = new this.paymentPolicyModel(createPaymentPolicyDto);
    const savedPaymentPolicy = await createdPaymentPolicy.save();
  
    return savedPaymentPolicy; // Assurez-vous de retourner la valeur sauvegardée
  }
  
  async findAll(): Promise<PaymentP[]> {
    return this.paymentPolicyModel.find().exec();
  }
  
  async updatePayment(paymentId: string, updatePaymentDto: CreatePaymentPDto): Promise<PaymentP> {
    // Récupérer le paiement existant
    const existingPayment = await this.paymentPolicyModel.findById(paymentId);
    
    // Vérifier si le paiement existe
    if (!existingPayment) {
      throw new NotFoundException('Payment not found');
    }

    // Créer un nouvel objet Payment avec les propriétés mises à jour
    const updatedPayment = await this.paymentPolicyModel.findByIdAndUpdate(
      paymentId,
      updatePaymentDto,
      { new: true }
    ).exec();

    // Vérifier si le paiement a bien été mis à jour
    if (!updatedPayment) {
      throw new NotFoundException('Payment not found');
    }

    return updatedPayment;
  }

  async findById(id: string): Promise<PaymentP | null> {
    return this.paymentPolicyModel.findById(id).exec();
  }
  
  
}
