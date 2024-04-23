
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class UpdateMissionDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  title?: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  description?: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  startDate?: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  endDate?: string;
}
