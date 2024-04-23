import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateApplicationDto {
    @IsNotEmpty()
  jobId: string;

    @IsOptional()
    @IsString()
    candidateName?: string;
  
    @IsOptional()
    @IsString()
    email: string;
  
    @IsOptional()
    @IsArray()
    cv?: string;
  
    
  }