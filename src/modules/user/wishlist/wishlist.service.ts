import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/schema/product.schema';
import { User, UserDocument } from 'src/schema/user.schema';

@Injectable()
export class WishlistService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async addProductToWishlist(
    userId: string,
    productId: string,
  ): Promise<UserDocument> {
    return this.userModel
      .findByIdAndUpdate(
        userId,
        { $addToSet: { wishlist: productId } },
        { new: true },
      )
      .populate({
        path: 'wishlist',
        model: Product.name,
      })
      .exec();
  }

  async removeProductFromWishlist(
    userId: string,
    productId: string,
  ): Promise<UserDocument> {
    return this.userModel
      .findByIdAndUpdate(
        userId,
        { $pull: { wishlist: productId } },
        { new: true },
      )
      .populate({
        path: 'wishlist',
        model: Product.name,
      })
      .exec();
  }

  async getUserWishlist(userId: string): Promise<UserDocument> {
    return this.userModel
      .findById(userId)
      .populate({
        path: 'wishlist',
        model: Product.name,
      })
      .exec();
  }
}
