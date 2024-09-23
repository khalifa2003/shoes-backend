import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Brand {
  @Prop({
    required: true,
    minlength: [2, 'Too short brand name'],
    maxlength: [32, 'Too long brand name'],
    unique: true,
  })
  name: string;

  @Prop({ required: true })
  image: string;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);

const setImageURL = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
};

// findOne, findAll and update
BrandSchema.post('init', (doc) => {
  setImageURL(doc);
});

// create
BrandSchema.post('save', (doc) => {
  setImageURL(doc);
});
