import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  ratings: number;

  user?: string;

  @IsNotEmpty()
  @IsString()
  product: string;
}
