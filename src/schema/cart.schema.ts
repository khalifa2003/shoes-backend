import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CartDocument = HydratedDocument<Cart>;

@Schema({ timestamps: true })
export class Cart {
  @Prop([
    {
      _id: { type: Types.ObjectId, auto: true },
      product: { type: Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, default: 1 },
      color: { type: String },
      price: { type: Number, required: true },
      size: { type: String },
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

  @Prop({ type: Number })
  totalCartPrice: number;

  @Prop({ type: Number })
  totalPriceAfterDiscount?: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;
}

export const CartSchema = SchemaFactory.createForClass(Cart);

CartSchema.virtual('populatedCartItems', {
  ref: 'Product',
  localField: 'cartItems.product',
  foreignField: '_id',
  justOne: false,
});

CartSchema.pre('save', function (next) {
  if (this.cartItems && this.cartItems.length > 0) {
    this.totalCartPrice = this.cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );
  } else {
    this.totalCartPrice = 0;
  }
  next();
});
