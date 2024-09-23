import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CartDocument = HydratedDocument<Cart>;

@Schema({ timestamps: true })
export class Cart {
  @Prop([
    {
      _id: { type: Types.ObjectId, auto: true },
      product: { type: Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 },
      color: { type: String },
      price: { type: Number },
    },
  ])
  cartItems: {
    _id: Types.ObjectId;
    product: Types.ObjectId;
    quantity: number;
    color: string;
    price: number;
    size: string;
  }[];

  @Prop()
  totalCartPrice: number;

  @Prop()
  totalPriceAfterDiscount?: number;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;
}

export const CartSchema = SchemaFactory.createForClass(Cart);

CartSchema.virtual('populatedCartItems', {
  ref: 'Product',
  localField: 'cartItems.product',
  foreignField: '_id',
  justOne: false,
});
