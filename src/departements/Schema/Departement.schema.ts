import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Department extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: 0 })
  totalEmployees: number;

  @Prop({ default: 0 })
  vacantPositions: number;

  @Prop({ default: 0 })
  recruitmentNeeds: number;

  @Prop({ default: 0 })
  budgetAllocated: number;

  @Prop({ default: 0 })
  salaryExpenditure: number;

  @Prop({ default: 0 })
  trainingExpenditure: number;
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);

