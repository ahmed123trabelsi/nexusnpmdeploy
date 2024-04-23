import { IsOptional, IsString, IsNumber, IsPositive } from "class-validator";

export class UpdateDepartmentDto {
    @IsOptional()
    @IsString()
    name?: string;
  
    @IsOptional()
    @IsString()
    description?: string;
  
    @IsOptional()
    @IsNumber()
    @IsPositive()
    budgetAllocated?: number;
  }