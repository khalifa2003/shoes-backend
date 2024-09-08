import { IsMongoId } from 'class-validator';

export class AddToWishlistDto {
  @IsMongoId()
  readonly productId: string;
}
