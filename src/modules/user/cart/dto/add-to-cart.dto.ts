import { IsMongoId, IsNotEmpty } from 'class-validator';

export class AddToCart {
  @IsNotEmpty()
  @IsMongoId()
  productId: string;
}
