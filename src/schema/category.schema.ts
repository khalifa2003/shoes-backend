import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true })
export class Category {
  @Prop({
    type: String,
    unique: true,
    required: true,
    minlength: [3, 'Too short name'],
    maxlength: [32, 'Too short name'],
  })
  name: string;

  @Prop({ required: true })
  image: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

// const setImageURL = (doc) => {
//   if (doc.image) {
//     const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
//     doc.image = imageUrl;
//   }
// };
// // findOne, findAll and update
// CategorySchema.post('init', (doc) => {
//   setImageURL(doc);
// });

// // create
// CategorySchema.post('save', (doc) => {
//   setImageURL(doc);
// });
