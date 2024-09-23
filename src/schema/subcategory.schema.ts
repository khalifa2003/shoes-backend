import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Subcategory {
  @Prop({
    type: String,
    required: true,
    unique: true,
    minlength: [2, 'Too short title'],
    maxlength: [32, 'Too long title'],
  })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category: Types.ObjectId;
}

export const SubcategorySchema = SchemaFactory.createForClass(Subcategory);
SubcategorySchema.pre(/^find/, function (next) {
  const query = this as mongoose.Query<any, any>;
  query.populate({
    path: 'category',
    select: ['name', 'image'],
  });
  next();
});
