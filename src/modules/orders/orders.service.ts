import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from '../../schema/orders.schema';
import { Cart } from '../../schema/cart.schema';
import { Product } from '../../schema/product.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async createOrder(
    orderData: Partial<Order>,
    cartId: string,
    user,
  ): Promise<Order> {
    const taxPrice = 0;
    const shippingPrice = 0;

    // 1) Get cart depend on cartId
    const cart = await this.cartModel.findById(cartId);
    if (!cart) {
      throw new BadRequestException(`There is no such cart with id ${cartId}`);
    }

    // 2) Get order price depend on cart price "Check if coupon apply"
    const cartPrice = cart.totalCartPrice;

    const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

    // 3) Create order with default paymentMethodType cash
    const order = await this.orderModel.create({
      user: user._id,
      cartItems: cart.cartItems,
      shippingAddress: orderData.shippingAddress,
      totalOrderPrice,
    });

    // 4) After creating order, decrement product quantity, increment product sold
    if (order) {
      const bulkOption = cart.cartItems.map((item) => ({
        updateOne: {
          filter: { _id: item.product },
          update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
        },
      }));
      await this.productModel.bulkWrite(bulkOption, {});

      // 5) Clear cart depend on cartId
      await this.cartModel.findByIdAndDelete(cartId);
    }
    return order;
  }

  async getLoggedUserOrders(userId: string): Promise<Order[]> {
    return this.orderModel.find({ user: userId }).sort({ _id: -1 }).exec();
  }

  async getAllOrders(): Promise<Order[]> {
    return this.orderModel.find().sort({ _id: -1 }).exec();
  }

  async updateOrderToDelivered(id: string): Promise<Order> {
    return this.orderModel
      .findByIdAndUpdate(
        id,
        { isDelivered: true, deliveredAt: new Date() },
        { new: true },
      )
      .exec();
  }

  async deleteOrder(id: string): Promise<Order> {
    return this.orderModel.findByIdAndDelete(id).exec();
  }
}
