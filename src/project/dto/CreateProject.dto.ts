import { Exclude, Type } from "class-transformer";
import { IsBoolean, IsDate, IsDateString, IsEnum, IsNotEmpty,IsOptional,IsString, Matches, ValidateNested } from "class-validator";
import { CreatePerformanceDto } from "src/performance/dto/CreatePerformance.dto";

import { ProjectPriority, ProjectType, TaskPriority, TypeStatutProjet, TypeStatutTache } from "../schema/Project.schema";

export class CreateTasksDto{

    
@IsNotEmpty()

@IsString()
NomTask:string;
@IsOptional()
@IsString()
description?:string;
@IsOptional()
@IsDate()
@Type(() => Date)
startDate?:Date;
@IsOptional()
@IsDate()
@Type(() => Date)
FinishDate?:Date
/* @IsDate()
@Type(() => Date)
statusChangedDate?:Date */
@IsOptional()
@IsEnum(TypeStatutTache)
statut?:TypeStatutTache;
@IsOptional()
projectId:string;
@IsOptional()
@IsEnum(TaskPriority)
 priority?:TaskPriority;
 @IsOptional()
 employeeAffected:string;
 @IsOptional()
 @ValidateNested()
performances: [CreatePerformanceDto]; 

  }
  export class CreateUserDto{
    

    @IsNotEmpty()
   @IsString()
   name:string;
   @IsOptional()
   @IsString()
   email: string;
   @IsOptional()
   @IsString()
   password: string;
   @IsOptional()
   @IsString()
   isActive: boolean;
   @IsOptional()
   @IsString()
   role: string;
   @IsOptional()
   @ValidateNested()
  tasks: [CreateTasksDto]; 
  @IsOptional()
  TeamId:string;
  @IsOptional()
  @ValidateNested()
 projects: [CreateProjectDto]; 
    }
export class CreateProjectDto{
    

 @IsNotEmpty()
@IsString()
NomProject:string;
@IsOptional()
@IsString()
description?:string;
@IsOptional()

@Matches(/^\d{2}-\d{2}-\d{4}$/, {
  message: 'startDate must be in the format DD-MM-YYYY'
})
StartDate?:string;
@IsOptional()

@Matches(/^\d{2}-\d{2}-\d{4}$/, {
  message: 'FinishDate must be in the format DD-MM-YYYY'
})
FinishDate?:string;
@IsOptional()
@IsEnum(TypeStatutProjet)
 statut?:TypeStatutProjet=TypeStatutProjet.New
 @IsOptional()
 @IsString()
 projectUrl?: string;
 @IsOptional()
 @ValidateNested()
tasks: [CreateTasksDto]; 
@IsOptional()
@IsString()
 NomChefProjet?:string
 @IsOptional()
@IsEnum(ProjectPriority)
priority?:ProjectPriority;
@IsOptional()
progress?:number
@IsOptional()
@IsEnum(ProjectType)
type?:ProjectType
@IsOptional()
UserProjectsId:string;
}
