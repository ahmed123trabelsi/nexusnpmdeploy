
import { IsBoolean, IsNotEmpty,IsOptional,IsString, ValidateNested } from "class-validator";

export class CreatePostDto{

    @IsNotEmpty()
    BasicSalary:number;
    @IsNotEmpty()
    PostName:string;
    @IsNotEmpty()
    Workshour:number;
@IsOptional()
@ValidateNested()
Users: [CreateUserPostDto];
}
export class CreateUserPostDto{
    @IsNotEmpty()
    @IsString()
    name:string;
    @IsOptional()
    @IsString()
    email: string;
    @IsOptional()
    @IsString()
    password: string;
    // @IsOptional()
    // @IsString()
    // isActive: boolean;
    // @IsOptional()
    // @IsString()
    // role: string;
//     @IsOptional()
//     @ValidateNested()
//    tasks?: CreateTasksDto; 
    @IsNotEmpty()
    PostId:string;



}