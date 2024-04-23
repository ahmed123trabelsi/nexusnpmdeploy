import { IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { signupDto } from 'src/auth/dto/signupDto';
import { CreateUserDto } from "src/project/dto/CreateProject.dto";
import { SatisfactionLevel } from "../schema/Performance.schema";
export class CreatePerformanceDto{
    

  @IsOptional()
   @IsString()
   score?:number;

 
  
  @IsOptional()
   @IsString()
   Objective?:string;

   @IsOptional()

  Employee: string; 
  @IsEnum(SatisfactionLevel)
  satisfactionLevel: SatisfactionLevel = SatisfactionLevel.Neutral;
    }