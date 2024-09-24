import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Coupon {
  @Prop({
    type: String,
    required: true,
    trim: true,
    unique: true, // Ensures coupon names are unique
  })
  name: string;

  @Prop({
    type: Date,
    required: [true, 'Coupon expire time is required'],
  })
  expire: Date;

  @Prop({
    type: Number,
    required: [true, 'Coupon discount value is required'],
    min: [1, 'Discount must be at least 1%'],
    max: [100, 'Discount cannot exceed 100%'],
  })
  discount: number; // Changed from 'string' to 'number'
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
