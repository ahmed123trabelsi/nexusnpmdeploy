// create-mission.dto.ts

import { Type } from "class-transformer";
import { IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { CreateEntrepriseDto } from "src/entreprises/dto/entreprises.dto";

export class CreateMissionDto {
    @IsNotEmpty()
    @IsString()
     title: string;
     description: string;
    @IsNotEmpty()
    @IsString()
     startDate: string;
    @IsNotEmpty()
    @IsString()
    endDate: string;
    // @ValidateNested()
    // @Type(()=>CreateEntrepriseDto)
    //  enterprise:CreateEntrepriseDto ; 
  }
  