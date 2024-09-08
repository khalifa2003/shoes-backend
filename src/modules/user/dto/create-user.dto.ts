import { IsString, IsEmail, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  fname: string;

  @IsString()
  @IsNotEmpty()
  lname: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  role?: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
