import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateBrandDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2, { message: 'Too short brand title' })
  @MaxLength(32, { message: 'Too long brand title' })
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly description: string;

  @IsOptional()
  @IsString()
  readonly image: string;
}
