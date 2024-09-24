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

  @Prop({ required: true })
  description: string;

  @Prop({ type: Number, required: [true, 'Product quantity is required'] })
  quantity: number;

  @Prop({
    type: Number,
    required: true,
    min: [0, 'Price must be positive'],
  })
  price: number;

  @Prop({ type: Number, default: 0 })
  sold: number;

  @Prop({
    type: [
      {
        color: { type: String, required: true },
        images: [{ type: String, required: true }],
        variants: [
          {
            size: { type: Number, required: true },
            quantity: { type: Number, required: true },
          },
        ],
      },
    ],
  })
  variants: {
    color: string;
    images: string[];
    variants: {
      size: number;
      quantity: number;
    }[];
  }[];

  @Prop({ type: Number, default: 0 })
  discount: number;

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

  // flexible properties about product
  @Prop({
    type: mongoose.Schema.Types.Mixed,
    default: {},
  })
  attributes: Record<string, any>;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

ProductSchema.pre(/^find/, function (next) {
  const query = this as mongoose.Query<any, any>;
  query.populate([
    { path: 'category', select: 'name image' },
    { path: 'brand', select: 'name image' },
    { path: 'subcategories', select: 'name' },
  ]);
  next();
});

ProductSchema.virtual('priceAfterDiscount').get(function () {
  if (this.discount && this.discount > 0) {
    return this.price - (this.price * this.discount) / 100;
  }
  return this.price;
});

ProductSchema.virtual('variants.variants.stock').get(function () {
  return this.variants.map((variantColor) => {
    return {
      color: variantColor.color,
      variants: variantColor.variants.map((variant) => {
        const status =
          variant.quantity === 0
            ? 'OUTOFSTOCK'
            : variant.quantity <= 10
              ? 'LOWSTOCK'
              : 'INSTOCK';
        return {
          ...variant,
          stock: status,
        };
      }),
    };
  });
});

ProductSchema.virtual('stock').get(function () {
  if (this.quantity > 10) return 'INSTOCK';
  if (this.quantity == 0) return 'OUTOFSTOCK';
  return 'LOWSTOCK';
});

// const setImageURL = (doc) => {
//   const defaultImage = `${process.env.BASE_URL}/products/default.jpg`;

//   if (!doc.imageCover) {
//     doc.imageCover = defaultImage;
//   } else {
//     const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
//     doc.imageCover = imageUrl;
//   }

//   if (doc.images && doc.images.length > 0) {
//     const imagesList = doc.images.map(
//       (image) => `${process.env.BASE_URL}/products/${image}`,
//     );
//     doc.images = imagesList;
//   } else {
//     doc.images = [defaultImage];
//   }
// };

// findOne, findAll and update
// ProductSchema.post('init', (doc) => {
//   setImageURL(doc);
// });

// create
// ProductSchema.post('save', (doc) => {
//   setImageURL(doc);
// });
