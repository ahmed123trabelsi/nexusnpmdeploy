import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';


export enum LeaveType {
    SickLeave = 'Sick Leave',
     PaidLeave = 'paid leave',
    Unpaidleave = 'Unpaid leave',
    Bereavement = 'Bereavement',
    PersonalReasons = 'Personal Reasons',
    Maternity = 'Maternity',
    Paternity = 'Paternity',
    RTT = 'RTT',
    Other = 'Other',
  

}
@Schema()
export class PaymentP extends Document {
  

  @Prop({ required: true })
  taxRate: number;

  @Prop({ required: true })
  socialSecurityRate: number;

  @Prop({ required: true })
  otherDeductions: number;


 
 @Prop({ required:true})
 paymentDay?: number;
 @Prop({ type: Map, of: Number })
  allowedDays: Map<LeaveType, number>;
 
 @Prop({required:true})
 exessDayPay?:number;

}

export const PaymentPSchema = SchemaFactory.createForClass(PaymentP);
PaymentPSchema.index({ type: 1 }, { unique: true });