import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import mongoose from 'mongoose';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Product {
  @Prop({
    type: String,
    required: true,
    trim: true,
    minlength: [3, 'Too short product title'],
  })
  title: string;

  @Prop({ type: String, required: true, lowercase: true })
  slug: string;

  @Prop({ required: true, minlength: [20, 'Too short product description'] })
  description: string;

  @Prop({ type: Number, required: [true, 'Product quantity is required'] })
  quantity: number;

  @Prop({ type: Number, default: 0 })
  sold: number;

  @Prop({
    required: true,
    trim: true,
    max: [2000000, 'Too long product price'],
  })
  price: number;

  @Prop({ type: Number, default: 0 })
  discount: number;

  @Prop({ type: [String] })
  colors: string[];

  @Prop({ type: String, required: [true, 'Product Image cover is required'] })
  imageCover: string[];

  @Prop({ required: true })
  images: string[];

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'Subcategory', required: true })
  subcategories: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'Brand' })
  brand: Types.ObjectId;

  @Prop({
    type: Number,
    min: [1, 'Rating must be above or equal 1.0'],
    max: [5, 'Rating must be below or equal 5.0'],
  })
  ratingsAverage?: number;

  @Prop({ type: Number, default: 0 })
  ratingsQuantity?: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.pre(/^find/, function (next) {
  const query = this as mongoose.Query<any, any>;
  query.populate({
    path: 'category',
    select: ['name', 'image'],
  });
  query.populate({
    path: 'brand',
    select: ['name', 'image'],
  });
  query.populate({
    path: 'subcategory',
    select: ['name'],
  });
  next();
});

ProductSchema.virtual('priceAfterDiscount').get(function () {
  if (this.discount && this.discount > 0) {
    return this.price - (this.price * this.discount) / 100;
  }
  return this.price;
});

ProductSchema.virtual('stock').get(function () {
  if (this.quantity === 0) {
    return 'OUTOFSTOCK';
  } else if (this.quantity > 0 && this.quantity <= 10) {
    return 'LOWSTOCK';
  } else {
    return 'INSTOCK';
  }
});

const setImageURL = (doc) => {
  if (doc.imageCover) {
    const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imageUrl;
  }
  if (doc.images) {
    const imagesList = [];
    doc.images.forEach((image) => {
      const imageUrl = `${process.env.BASE_URL}/products/${image}`;
      imagesList.push(imageUrl);
    });
    doc.images = imagesList;
  }
};
// findOne, findAll and update
ProductSchema.post('init', (doc) => {
  setImageURL(doc);
});

// create
ProductSchema.post('save', (doc) => {
  setImageURL(doc);
});
