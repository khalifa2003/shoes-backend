import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateAddressDto } from './dto/create-address.dto';

@Controller('address')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.User, Role.Admin, Role.Manager)
@UseGuards(JwtAuthGuard)
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  async addAddress(@Req() req, @Body() createAddressDto: CreateAddressDto) {
    const updatedUser = await this.addressService.addAddress(
      req.user._id,
      createAddressDto,
    );
    return {
      status: 'success',
      message: 'Address Added Successfully',
      user: updatedUser.addresses,
    };
  }

  @Delete(':addressId')
  async removeAddress(@Req() req, @Param('addressId') addressId: string) {
    const updatedUser = await this.addressService.removeAddress(
      req.user._id,
      addressId,
    );
    return {
      status: 'success',
      message: 'Address removed successfully',
      user: updatedUser.addresses,
    };
  }

  @Get()
  async getLoggedUserAddresses(@Req() req) {
    const addresses = await this.addressService.getLoggedUserAddresses(
      req.user._id,
    );
    return {
      status: 'success',
      message: 'Addresses Fetched Successfully.',
      data: addresses,
    };
  }
}
