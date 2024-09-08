import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { User } from 'src/schema/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    return createdUser;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async updatePassword(_id: string, changePasswordDto: ChangePasswordDto) {
    const { currentPassword, password, passwordConfirm } = changePasswordDto;

    // 1) Verify user exists
    const user = await this.userModel.findById(_id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 2) Verify current password
    const isCorrectPassword = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isCorrectPassword) {
      throw new BadRequestException('Incorrect current password');
    }

    // 3) Verify password confirmation
    if (password !== passwordConfirm) {
      throw new BadRequestException('Password confirmation does not match');
    }

    // 4) Hash the new password and update the user
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.passwordChangedAt = new Date();

    await user.save();
    return { message: 'Password updated successfully' };
  }

  async updateLoggedUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
      { new: true },
    );
    return updatedUser;
  }

  async deactivateUser(id: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, { active: false });
  }

  async updateRole(id: string): Promise<User> {
    return this.userModel.findByIdAndUpdate(
      id,
      { roles: ['manager'] },
      { new: true },
    );
  }
}
