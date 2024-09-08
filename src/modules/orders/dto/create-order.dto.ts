import { IsNotEmpty, IsObject } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsObject()
  shippingAddress: {
    details: string;
    phone: string;
    city: string;
    postalCode: string;
  };
}
