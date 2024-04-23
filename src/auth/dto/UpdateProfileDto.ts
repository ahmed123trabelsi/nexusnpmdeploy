// update-profile.dto.ts
import { IsString, IsEmail, IsOptional } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  firstName: string;
  
  @IsOptional()
  @IsString()
  lastName: string;
  
  @IsOptional()
  @IsEmail()
  email: string;
  
  @IsOptional()
  @IsString()
  location : string ;
  
  @IsOptional()
  @IsString()
  EmailSecondaire : string
  
  @IsOptional()
  @IsString()
  TelSecondaire : string
  
  @IsOptional()
  @IsString()
  city : string ;
  
  @IsOptional()
  @IsString()
  Tel : string
  
  @IsOptional()
  @IsString()
  adresse : string ;
  
  @IsOptional()  
  @IsString()
  country : string ;
  
  @IsOptional()  
  @IsString()
  aboutme : string ;
  
  @IsOptional()
  @IsString()
  education : string ;
  
  @IsOptional()
  @IsString()
  experience : string ;
  
  @IsOptional()
  @IsString()
  skills : string ;
  
  @IsOptional()
  @IsString()
  datebirth : string ;
}