import {
  IsNotEmpty,
  IsOptional,
  IsMongoId,
  MinLength,
  IsString,
  IsNumber,
  IsArray,
  Max,
  Min,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: 'Too short product title' })
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(20, { message: 'Too short product description' })
  description: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  @Max(2000000, { message: 'Too long product price' })
  price: number;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  images: string[];

  @IsNotEmpty()
  @IsMongoId()
  category: Types.ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  subcategory: Types.ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  brand: Types.ObjectId;

  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'Rating must be above or equal 1.0' })
  @Max(5, { message: 'Rating must be below or equal 5.0' })
  ratingsAverage?: number;

  @IsOptional()
  @IsNumber()
  ratingsQuantity?: number;

  @IsOptional()
  specs?: {
    refreshRate: string;
    processor: string;
    graphics: string;
    storage: string;
    display: string;
    memory: string;
    os: string;
  };

  @IsOptional()
  sold?: number;
  
  @IsOptional()
  discount: number;
}
