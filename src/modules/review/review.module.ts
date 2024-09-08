import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewSchema } from '../../schema/review.schema';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { ProductSchema } from '../../schema/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Review', schema: ReviewSchema }]),
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
    forwardRef(() => AuthModule),
    AuthModule,
    UserModule,
  ],
  providers: [ReviewService],
  controllers: [ReviewController],
})
export class ReviewModule {}
