import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review } from '../../schema/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { Product } from '../../schema/product.schema';
import { UpdateProductDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async getAllReviews(productId: string): Promise<Review[]> {
    return this.reviewModel.find({ product: productId }).exec();
  }

  async getReviewById(id: string): Promise<Review> {
    const review = await this.reviewModel.findById(id);
    if (!review) {
      throw new NotFoundException(`No review found with id ${id}`);
    }
    return review;
  }

  async createReview(createReviewDto: CreateReviewDto): Promise<Review> {
    const { product, user } = createReviewDto;

    // Check if a review by the same user for the same product already exists
    const existingReview = await this.reviewModel.findOne({ product, user });
    if (existingReview) {
      throw new ConflictException('You have already reviewed this product.');
    }

    const review = await this.reviewModel.create(createReviewDto);
    await this.updateProductRatings(review.product);
    return review;
  }

  async updateReview(
    id: string,
    updateReviewDto: UpdateProductDto,
  ): Promise<Review> {
    const review = await this.reviewModel.findByIdAndUpdate(
      id,
      updateReviewDto,
      { new: true },
    );
    if (!review) {
      throw new NotFoundException(`No review found with id ${id}`);
    }
    await this.updateProductRatings(review.product);
    return review;
  }

  async deleteReview(id: string): Promise<void> {
    const review = await this.reviewModel.findByIdAndDelete(id);
    if (!review) {
      throw new NotFoundException(`No review found with id ${id}`);
    }
    await this.updateProductRatings(review.product);
  }

  private async updateProductRatings(productId: Types.ObjectId): Promise<void> {
    const result = await this.reviewModel.aggregate([
      { $match: { product: productId } },
      {
        $group: {
          _id: '$product',
          avgRatings: { $avg: '$ratings' },
          ratingsQuantity: { $sum: 1 },
        },
      },
    ]);

    if (result.length > 0) {
      await this.productModel.findByIdAndUpdate(productId, {
        ratingsAverage: result[0].avgRatings,
        ratingsQuantity: result[0].ratingsQuantity,
      });
    } else {
      await this.productModel.findByIdAndUpdate(productId, {
        ratingsAverage: 0,
        ratingsQuantity: 0,
      });
    }
  }
}
