import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { Category, CategorySchema } from '../../schema/category.schema';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { ProductModule } from '../product/product.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
    AuthModule,
    UserModule,
    forwardRef(() => ProductModule),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [MongooseModule],
})
export class CategoryModule {}
