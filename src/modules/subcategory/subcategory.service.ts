import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { Subcategory } from '../../schema/subcategory.schema';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SubcategoryService {
  constructor(
    @InjectModel(Subcategory.name) private subcategoryModel: Model<Subcategory>,
  ) {}

  async findAll(category: string = ''): Promise<Subcategory[]> {
    if (category == '') {
      return this.subcategoryModel.find().exec();
    } else {
      return await this.subcategoryModel.find({ category: category }).exec();
    }
  }

  async findOne(id: string): Promise<Subcategory> {
    const subcategory = await this.subcategoryModel.findById(id).exec();
    if (!subcategory) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return subcategory;
  }

  async createOne(
    createSubcategoryDto: CreateSubcategoryDto,
  ): Promise<Subcategory> {
    const newSubcategory = new this.subcategoryModel(createSubcategoryDto);
    return newSubcategory.save();
  }

  async updateOne(
    id: string,
    updateSubcategoryDto: UpdateSubcategoryDto,
  ): Promise<Subcategory> {
    const subcategory = await this.subcategoryModel
      .findByIdAndUpdate(id, updateSubcategoryDto, { new: true })
      .exec();
    if (!subcategory) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return subcategory;
  }

  async deleteOne(id: string): Promise<void> {
    await this.subcategoryModel.findByIdAndDelete(id).exec();
  }
}
