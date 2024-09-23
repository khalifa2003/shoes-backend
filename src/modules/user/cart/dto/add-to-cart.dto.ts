import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class AddToCart {
  @IsNotEmpty()
  @IsMongoId()
  productId: string;

  @IsNotEmpty()
  color;

  @IsOptional()
  size: string;
}
