import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from '../../../schema/cart.schema';
import { Product } from 'src/schema/product.schema';
import { AddToCart } from './dto/add-to-cart.dto';
import { ObjectId } from 'mongodb';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ApiError } from 'src/utils/api-error';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
  ) {}

  private calcTotalCartPrice(cart: CartDocument): number {
    let totalPrice = 0;
    cart.cartItems.forEach((item) => {
      totalPrice += item.quantity * item.price;
    });
    cart.totalCartPrice = totalPrice;
    return totalPrice;
  }

  async addProductToCart(
    userId: string,
    addToCart: AddToCart,
  ): Promise<CartDocument> {
    const { productId, color, size } = addToCart;
    const product = await this.productModel.findById(productId);
    if (!product) throw new ApiError('Product not found', 404);

    let cart = await this.cartModel.findOne({ user: userId });
    if (!cart) {
      cart = await this.cartModel.create({
        user: userId,
        cartItems: [{ product: productId, price: product.price, color, size }],
      });
    } else {
      const productIndex = cart.cartItems.findIndex(
        (item) => item.product.toString() === productId,
      );
      if (productIndex > -1) {
        cart.cartItems[productIndex].quantity += 1;
      } else {
        cart.cartItems.push({
          _id: new ObjectId(),
          product: new ObjectId(productId),
          price: product.price - (product.price * product.discount) / 100,
          quantity: 1,
          color: color,
          size: size,
        });
      }
    }

    this.calcTotalCartPrice(cart);
    return cart.save();
  }

  async getLoggedUserCart(userId: string): Promise<CartDocument> {
    const cart = await this.cartModel
      .findOne({ user: userId })
      .populate('cartItems.product');
    if (!cart)
      throw new ApiError(`There is no cart for this user id : ${userId}`, 404);
    return cart;
  }

  async removeSpecificCartItem(
    userId: string,
    itemId: string,
  ): Promise<CartDocument> {
    const cart = await this.cartModel.findOneAndUpdate(
      { user: userId },
      { $pull: { cartItems: { _id: itemId } } },
      { new: true },
    );
    if (!cart) throw new ApiError('Cart not found for user', 404);
    this.calcTotalCartPrice(cart);
    return cart.save();
  }

  async updateCartItemQuantity(
    userId: string,
    itemId: string,
    updateCartDto: UpdateCartDto,
  ): Promise<CartDocument> {
    const { quantity } = updateCartDto;
    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) throw new ApiError('Cart not found for user', 404);

    const itemIndex = cart.cartItems.findIndex(
      (item) => item._id.toString() === itemId,
    );
    if (itemIndex === -1) throw new ApiError('Cart item not found', 404);

    cart.cartItems[itemIndex].quantity = quantity;
    this.calcTotalCartPrice(cart);
    return cart.save();
  }

  async clearCart(userId: string): Promise<void> {
    await this.cartModel.findOneAndDelete({ user: userId });
  }
}
