import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/common/enums/role.enum';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AddToCart } from './dto/add-to-cart.dto';

@Controller('cart')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin, Role.Manager, Role.User)
export class CartController {
  constructor(private cartService: CartService) {}

  @Post()
  @HttpCode(201)
  async addProductToCart(@Req() req, @Body() addToCart: AddToCart) {
    const cart = await this.cartService.addProductToCart(
      req.user._id,
      addToCart,
    );
    return {
      status: 'success',
      message: 'Product added to cart successfully',
      numOfCartItems: cart.cartItems.length,
      data: cart,
    };
  }

  @Get('')
  async getLoggedUserCart(@Req() req) {
    const cart = await this.cartService.getLoggedUserCart(req.user._id);
    return {
      status: 'success',
      numOfCartItems: cart.cartItems.length,
      data: cart,
    };
  }

  @Delete(':itemId') async removeSpecificCartItem(
    @Req() req,
    @Param('itemId') itemId: string,
  ) {
    const cart = await this.cartService.removeSpecificCartItem(
      req.user._id,
      itemId,
    );
    return {
      status: 'success',
      numOfCartItems: cart.cartItems.length,
      data: cart,
    };
  }

  @Delete('')
  @HttpCode(204)
  async clearCart(@Req() req) {
    await this.cartService.clearCart(req.user._id);
    return { status: 'success', message: 'Cart cleared successfully' };
  }

  @Put('/:id')
  async updateCartItemQuantity(
    @Req() req,
    @Param('id') id: string,
    @Body() updateCartDto: UpdateCartDto,
  ) {
    const cart = await this.cartService.updateCartItemQuantity(
      req.user._id,
      id,
      updateCartDto,
    );
    return {
      status: 'success',
      numOfCartItems: cart.cartItems.length,
      data: cart,
    };
  }
}
