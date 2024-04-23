import { IsArray, IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateJobDto {
    @IsOptional()
    @IsString()
    title?: string;
  
    @IsOptional()
    @IsString()
    description?: string;
  
    @IsOptional()
    @IsArray()
    requiredSkills?: string[];
  
    @IsOptional()
    @IsString()
    location?: string;
  
    @IsOptional()
    @IsString()
    contractType?: string;
  
    @IsOptional()
    @IsNumber()
    salary?: number;
  
    @IsOptional()
    @IsDate()
    applicationDeadline?: Date;
  
    @IsOptional()
    @IsString()
    status?: string;
  
    @IsOptional()
    @IsDate()
    publicationDate?: Date;
  
    @IsOptional()
    @IsString()
    recruitingManager?: string;
  }