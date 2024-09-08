import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Subcategory,
  SubcategorySchema,
} from '../../schema/subcategory.schema';
import { SubcategoryController } from './subcategory.controller';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { SubcategoryService } from './subcategory.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subcategory.name, schema: SubcategorySchema },
    ]),
    AuthModule,
    UserModule,
  ],
  controllers: [SubcategoryController],
  providers: [SubcategoryService],
  exports: [MongooseModule],
})
export class SubcategoryModule {}
