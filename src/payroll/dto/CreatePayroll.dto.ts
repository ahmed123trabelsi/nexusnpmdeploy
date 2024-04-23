import { IsNumber, IsNotEmpty, IsMongoId } from 'class-validator';
import { User } from 'src/auth/Shemas/User.shema';
import { PaymentP } from 'src/payment-policy/Schema/PaymentPolicyschema';

export class CreatePayrollDto {
  
  @IsNumber({}, { message: 'Month must be a number' })
  @IsNotEmpty({ message: 'Month is required' })
  month: number;

  @IsNumber({}, { message: 'Year must be a number' })
  @IsNotEmpty({ message: 'Year is required' })
  year: number;

  @IsNumber({}, { message: 'Basic salary must be a number' })
  @IsNotEmpty({ message: 'Basic salary is required' })
  basicSalary: number;

  @IsNumber({}, { message: 'Deductions must be a number' })
  @IsNotEmpty({ message: 'Deductions are required' })
  deductions: number;

  @IsNumber({}, { message: 'Net salary must be a number' })
  netSalary: number;
  
  @IsMongoId({ message: 'Invalid user ID' })
  userId: string; // Ajoutez un champ pour l'ID de l'utilisateur

  // user: User;
 // paymentPolicy: PaymentP[];
}
export class EmployeeSalaryDto {
  _id: number;
  netSalary: number;
  user: UserDto;
}

export class UserDto {
  firstName: string;
  lastName: string;
  email: string;
  Matricule: string;
  poste: PosteDto;
}

export class PosteDto {
  PostName: string}
