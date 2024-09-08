import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Coupon {
  @Prop({
    type: String,
    required: true,
    trim: true,
    unique: true,
  })
  name: string;

  @Prop({
    type: Date,
    required: [true, 'Coupon expire time required'],
  })
  expire: Date;

  @Prop({ type: Number, required: [true, 'Coupon discount value required'] })
  discount: string;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
