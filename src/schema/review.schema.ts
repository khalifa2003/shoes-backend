import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: String })
  title: string;

  @Prop({
    type: Number,
    min: [1, 'Min ratings value is 1.0'],
    max: [5, 'Max ratings value is 5.0'],
    required: [true, 'Review ratings required'],
  })
  ratings: number;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to user'],
  })
  user: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Product',
    required: [true, 'Review must belong to product'],
  })
  product: Types.ObjectId;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

ReviewSchema.pre(/^find/, function (next) {
  const query = this as mongoose.Query<any, any>;
  query.populate({
    path: 'user',
    select: ['fname', 'lname'],
  });
  next();
});

