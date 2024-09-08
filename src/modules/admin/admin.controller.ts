import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Roles(Role.Admin, Role.Manager)
  @Get()
  async getDashboardData() {
    const ordersStats = await this.adminService.getOrdersStats();
    const revenueStats = await this.adminService.getRevenueStats();
    const customersStats = await this.adminService.getCustomersStats();
    const commentsStats = await this.adminService.getCommentsStats();
    const recentSales = await this.adminService.getRecentSales();
    const bestSellingProducts =
      await this.adminService.getBestSellingProducts();
    // console.log('bestSellingProducts', bestSellingProducts);
    const notifications = await this.adminService.getNotifications();
    // console.log('notifications', notifications);
    const salesOverview = await this.adminService.getSalesOverview();
    // console.log('salesOverview', salesOverview);

    return {
      ordersStats,
      revenueStats,
      customersStats,
      commentsStats,
      recentSales,
      bestSellingProducts,
      notifications,
      salesOverview,
    };
  }
}
