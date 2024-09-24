import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop([
    {
      product: { type: Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, min: 1 },
      color: { type: String, required: true },
      price: { type: Number, required: true },
      size: { type: String, required: true },
    },
  ])
  cartItems: {
    product: Types.ObjectId;
    quantity: number;
    color: string;
    price: number;
    size: string;
  }[];

  @Prop({ type: Number, default: 0 })
  taxPrice: number;

  @Prop({
    type: {
      alias: { type: String, required: true },
      details: { type: String, required: true },
      phone: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
  })
  shippingAddress: {
    alias: string;
    details: string;
    phone: string;
    city: string;
    postalCode: string;
  };

  @Prop({ type: Number, default: 0 })
  shippingPrice: number;

  @Prop({ type: Number, required: true })
  totalOrderPrice: number;

  @Prop({
    type: String,
    enum: ['card', 'cash'],
    default: 'cash',
  })
  paymentMethodType: string;

  @Prop({ type: Boolean, default: false })
  isPaid: boolean;

  @Prop({ type: Date })
  paidAt?: Date;

  @Prop({ type: Boolean, default: false })
  isDelivered: boolean;

  @Prop({ type: Date })
  deliveredAt?: Date;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.pre(/^find/, function (next) {
  const query = this as mongoose.Query<any, any>;
  query
    .populate({
      path: 'user',
      select: ['fname', 'lname', 'image', 'email', 'phone'],
    })
    .populate({
      path: 'cartItems.product',
      select: 'title images',
    });
  next();
});

OrderSchema.pre('save', function (next) {
  if (this.cartItems && this.cartItems.length > 0) {
    const totalCartPrice = this.cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );
    this.totalOrderPrice = totalCartPrice + this.taxPrice + this.shippingPrice;
  }
  next();
});
