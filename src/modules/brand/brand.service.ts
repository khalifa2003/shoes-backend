import { Injectable } from '@nestjs/common';
import { Brand } from '../../schema/brand.schema';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiError } from 'src/utils/api-error';

@Injectable()
export class BrandService {
  constructor(@InjectModel(Brand.name) private brandModel: Model<Brand>) {}

  async findAll(): Promise<Brand[]> {
    return this.brandModel.find().exec();
  }

  async findOne(id: string): Promise<Brand> {
    const brand = this.brandModel.findById(id).exec();
    if (!brand) {
      throw new ApiError(`Product with ID "${id}" not found`, 404);
    }
    return brand;
  }

  async createOne(createBrandDto: CreateBrandDto): Promise<Brand> {
    const newBrand = new this.brandModel(createBrandDto);
    return newBrand.save();
  }

  async updateOne(
    id: string,
    updateBrandDto: UpdateBrandDto,
  ): Promise<UpdateBrandDto> {
    const brand = await this.brandModel
      .findByIdAndUpdate(id, updateBrandDto, { new: true })
      .exec();
    if (!brand) {
      throw new ApiError(`Product with ID "${id}" not found`, 404);
    }
    return brand;
  }

  async deleteOne(id: string) {
    const brand = await this.brandModel.findByIdAndDelete(id).exec();
    if (!document) {
      throw new ApiError(`No document for this id ${id}`, 404);
    }
    return brand;
  }
}
