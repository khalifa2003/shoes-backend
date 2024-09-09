import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schema/user.schema';
import { CreateAddressDto } from './dto/create-address.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async addAddress(userId: string, address: CreateAddressDto) {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { addresses: address } },
      { new: true },
    );
  }

  async removeAddress(userId: string, addressId: string) {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $pull: { addresses: { _id: addressId } } },
      { new: true },
    );
  }

  async getLoggedUserAddresses(userId: string) {
    const address = await this.userModel
      .findById(userId)
      .populate('addresses')
      .exec();
    return address;
  }
}
