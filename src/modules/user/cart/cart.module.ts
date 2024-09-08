import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from '../../../schema/cart.schema';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Product, ProductSchema } from 'src/schema/product.schema';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UserModule } from '../user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    AuthModule,
    UserModule,
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [],
})
export class CartModule {}
