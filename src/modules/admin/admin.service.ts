import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from '../../schema/orders.schema';
import { Product } from '../../schema/product.schema';
import { Review } from 'src/schema/review.schema';
import { User } from 'src/schema/user.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Review.name) private reviewModel: Model<Review>,
  ) {}

  // Method to get orders count and new orders
  async getOrdersStats() {
    const ordersCount = await this.orderModel.countDocuments();
    const newOrdersCount = await this.orderModel.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // last 24 hours
    });
    return { ordersCount, newOrdersCount };
  }

  // Method to get revenue stats
  async getRevenueStats() {
    const revenue = await this.orderModel.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: '$totalOrderPrice' } } },
    ]);
    return revenue[0]?.totalRevenue || 0;
  }

  // Method to get customers count and new customers
  async getCustomersStats() {
    const customersCount = await this.userModel.countDocuments();
    const newCustomersCount = await this.userModel.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, // last 7 days
    });
    return { customersCount, newCustomersCount };
  }

  // Method to get unread comments and responded comments
  async getCommentsStats() {
    const unreadCommentsCount = await this.reviewModel.countDocuments();
    const respondedCommentsCount = await this.reviewModel.countDocuments();
    return { unreadCommentsCount, respondedCommentsCount };
  }

  // Method to get recent sales
  async getRecentSales() {
    return this.orderModel
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('cartItems.product');
  }

  // Method to get best selling products
  async getBestSellingProducts() {
    return this.productModel.aggregate([
      {
        $group: {
          _id: '$category',
          title: { $first: '$title' },
          totalSales: { $sum: '$sold' },
        },
      },
      { $sort: { totalSales: -1 } },
      { $limit: 5 },
    ]);
  }

  // Method to get notifications
  async getNotifications() {
    return this.reviewModel.find().sort({ createdAt: -1 }).limit(5);
  }

  // Method to get sales overview data (for the chart)
  async getSalesOverview() {
    return this.orderModel.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d %H:%M', date: '$updatedAt' },
          },
          totalSales: { $sum: '$totalOrderPrice' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }
}
