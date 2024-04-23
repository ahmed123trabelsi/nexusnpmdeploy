import { IsNumber, IsDate, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { LeaveType } from '../../conges/Schema/Leaves.schema'; // Assurez-vous d'importer l'énumération LeaveType

export class CreatePaymentPDto {
  @IsNumber()
  @IsNotEmpty()
  taxRate: number;

  @IsNumber()
  @IsNotEmpty()
  socialSecurityRate: number;

  @IsNumber()
  @IsNotEmpty()
  otherDeductions: number;

  
   @IsNotEmpty()
  paymentDay?: number;

  @IsNotEmpty()
  allowedDays: Map<LeaveType, number>;
  
  @IsNotEmpty()
  exessDayPay?:number;
}
