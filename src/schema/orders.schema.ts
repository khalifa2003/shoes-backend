import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop([
    {
      product: { type: Types.ObjectId, ref: 'Product' },
      quantity: Number,
      color: String,
      price: Number,
    },
  ])
  cartItems: {
    product: Types.ObjectId;
    quantity: number;
    color: string;
    price: number;
  }[];

  @Prop({ type: Number, default: 0 })
  taxPrice: number;

  @Prop({
    type: {
      details: String,
      phone: String,
      city: String,
      postalCode: String,
    },
  })
  shippingAddress: {
    details: string;
    phone: string;
    city: string;
    postalCode: string;
  };

  @Prop({ type: Number, default: 0 })
  shippingPrice: number;

  @Prop({ type: Number })
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
  paidAt: Date;

  @Prop({ type: Boolean, default: false })
  isDelivered: boolean;

  @Prop({ type: Date })
  deliveredAt: Date;

  @Prop({ type: Date, default: Date.now() })
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
