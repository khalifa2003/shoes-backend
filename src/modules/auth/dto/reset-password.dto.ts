import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  resetCode: string;

  @IsNotEmpty()
  newPassword: string;
}
