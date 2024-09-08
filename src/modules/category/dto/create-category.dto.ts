import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: 'Too short name' })
  @MaxLength(32, { message: 'Too logn name' })
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly description: string;

  @IsNotEmpty()
  @IsString()
  readonly image: string;
}
