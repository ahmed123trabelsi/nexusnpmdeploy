import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class loginDto{
   @IsNotEmpty()
   @IsEmail({},{message:"please enter a valid email"})
   readonly email:string;
   @IsNotEmpty()
   @IsString()
   @MinLength(6,{ message:"password should have at least 6 characters"})
   readonly password:string;
}