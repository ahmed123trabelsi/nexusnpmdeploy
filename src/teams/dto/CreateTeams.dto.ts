import { IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { signupDto } from 'src/auth/dto/signupDto';
import { CreateUserDto } from "src/project/dto/CreateProject.dto";
export class CreateTeamsDto{
    

  @IsOptional()
   @IsString()
   TeamsName?:string;

   @IsOptional()
   @ValidateNested()
  Employees: string[]; 
    }