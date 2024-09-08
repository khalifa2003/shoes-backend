import { Module } from '@nestjs/common';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { UserModule } from '../user.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Address, AddressSchema } from '../../../schema/address.schema';
import { User, UserSchema } from 'src/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Address.name, schema: AddressSchema }]),
    UserModule,
    AuthModule,
  ],
  controllers: [AddressController],
  providers: [AddressService],
  exports: [AddressService],
})
export class AddressModule {}
