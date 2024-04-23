import { Document, Types } from 'mongoose';

import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateDepartmentDto {
    @IsNotEmpty()
    @IsString()
    name: string;
    @IsNotEmpty()
    @IsString()
    iduser:string;
  
    @IsNotEmpty()
    @IsString()
    description: string;
  
    @IsNumber()
    @IsPositive({ message: 'BudgetAllocated must be a positive number' })
    budgetAllocated: number;}



