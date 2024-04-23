import { IsString, Length } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @Length(6, 20)
  newPassword: string;

  @IsString()
  pinCode: string;
}