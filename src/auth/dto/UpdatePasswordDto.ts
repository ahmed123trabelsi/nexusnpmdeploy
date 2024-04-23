
import { IsString, Length } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @Length(6, 20)
  oldPassword: string;

  @IsString()
  @Length(6, 20)
  newPassword: string;
}