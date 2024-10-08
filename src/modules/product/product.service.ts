import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '../../schema/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiError } from 'src/utils/api-error';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async findAll(queryParams: any): Promise<Product[]> {
    const query: any = {};

    if (queryParams) {
      const keys = Object.keys(queryParams);
      const values: any = Object.values(queryParams);

      for (let i = 0; i < keys.length; i++) {
        if (values[i] == '') {
          continue;
        } else if (keys[i] === 'min' || keys[i] === 'max') {
          query[keys[i]] = +values[i];
        } else if (
          keys[i] === 'category' ||
          keys[i] === 'brand' ||
          keys[i] === 'subcategory'
        ) {
          if (values[i].includes(',')) {
            query[keys[i]] = { $in: values[i].split(',') };
          } else {
            query[keys[i]] = values[i];
          }
        } else {
          query[keys[i]] = new RegExp(values[i], 'i');
        }
      }
    }

    let documents = await this.productModel.find(query).exec();

    if (queryParams.min && queryParams.max) {
      documents = documents.filter(
        (product) =>
          product.price >= queryParams.min && product.price <= queryParams.max,
      );
    }

    return documents;
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new ApiError(`Product with ID "${id}" not found`, 404);
    }
    return product;
  }

  async createOne(createProductDto: CreateProductDto): Promise<Product> {
    const totalQuantity = createProductDto.variants.reduce((acc, variant) => {
      const variantQuantity = variant.variants.reduce(
        (sum, variantSize) => sum + variantSize.quantity,
        0,
      );
      return acc + variantQuantity;
    }, 0);
    const images: string[] = createProductDto.variants.map(
      (variant) => variant.images[0],
    );
    console.log(totalQuantity);
    console.log(images);

    const newProduct = new this.productModel({
      ...createProductDto,
      quantity: totalQuantity,
      images,
    });
    return newProduct.save();
  }

  async updateOne(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .exec();
    if (!product) {
      throw new ApiError(`Product with ID "${id}" not found`, 404);
    }
    return product;
  }

  async deleteOne(id: string): Promise<void> {
    const product = await this.productModel.findByIdAndDelete(id).exec();
    if (!product) {
      throw new ApiError(`Product with ID "${id}" not found`, 404);
    }
  }

  async findBy(data): Promise<Product[]> {
    return this.productModel.find(data).exec();
  }
}
