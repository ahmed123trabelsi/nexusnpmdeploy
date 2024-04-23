import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { User } from 'src/auth/Shemas/User.shema';

@Schema()
export class Payroll extends Document {
 
// @Prop()
// User:User;

  @Prop({ required: true })
  month: number; // Mois pour lequel la paie est calculée

  @Prop({ required: true })
  year: number; // Année pour laquelle la paie est calculée

  @Prop({ required: true })
  basicSalary: number; // Salaire de base

 

  @Prop({ default: 0 })
  deductions: number; // Déductions (impôts, assurances, etc.)

  
  @Prop()
  netSalary: number; // Salaire net (total des gains - déductions)

  @Prop({ type: Types.ObjectId, ref: 'User' })
   user: User;

  
  
}

export const PayrollSchema = SchemaFactory.createForClass(Payroll);
