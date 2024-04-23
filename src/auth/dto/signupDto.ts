import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from "class-validator";
import { Role } from "../Shemas/Roles.Shema";

export class signupDto{
  @IsNotEmpty()
  @IsString()
  firstName:string;
  
  @IsNotEmpty()
  @IsString()
  lastName:string;

  @IsNotEmpty()
  @IsEmail({},{message:"please enter a valid email"})
  email:string;
  
  @IsNotEmpty()
  @IsString()
  etablissement : string

  @IsNotEmpty()
  @IsString()
  EmailSecondaire : string

  @IsNotEmpty()
  @IsString()
  TelSecondaire : string

  @IsNotEmpty()
  @IsString()
  dateEntree : string ;

  @IsNotEmpty()
  @IsString()
  fonction : string

  @IsNotEmpty()
  @IsString()
  Tel : string ;

  @IsNotEmpty()
  @IsString()
  Matricule : string ;

  @IsNotEmpty()
  @IsString()
  @MinLength(6,{ message:"password should have at least 6 characters"})
  password:string;

  @IsNotEmpty()
  @IsString()
  roleName: Role; 
  
  @IsNotEmpty()
  @IsNumber()
  soldeConges : number ;

  @IsNotEmpty()
  @IsNumber()
  soldeMaladie : number ;
/*   @IsOptional()
  idAdmin:string; */

}