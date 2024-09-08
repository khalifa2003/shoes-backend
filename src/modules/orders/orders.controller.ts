import {
  Controller,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
  Put,
  Get,
  Delete,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { OrderService } from './orders.service';
import { Order } from '../../schema/orders.schema';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // User
  @Roles(Role.User, Role.Admin, Role.Manager)
  @Post(':cartId')
  async createOrder(
    @Body() orderData: Partial<Order>,
    @Param('cartId') cartId: string,
    @Req() req,
  ): Promise<Order> {
    return this.orderService.createOrder(orderData, cartId, req.user);
  }

  @Roles(Role.User, Role.Admin, Role.Manager)
  @Get('/userOrders')
  async getOrdersForUser(@Req() req): Promise<Order[]> {
    return this.orderService.getLoggedUserOrders(req.user._id);
  }

  // Admin
  @Roles(Role.Admin, Role.Manager)
  @Get()
  async getAllOrders(): Promise<Order[]> {
    return this.orderService.getAllOrders();
  }

  @Roles(Role.Admin, Role.Manager)
  @Put('delivered/:orderId')
  async updateOrderToDelivered(@Param('orderId') orderId: string) {
    return this.orderService.updateOrderToDelivered(orderId);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async deleteOrder(@Param('id') id: string): Promise<Order> {
    return this.orderService.deleteOrder(id);
  }
}
