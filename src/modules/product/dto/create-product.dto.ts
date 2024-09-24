import { Type } from 'class-transformer';
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
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: 'Too short product title' })
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'Too short product price' })
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
  @IsNumber()
  @Min(0, { message: 'Sold items must be greater than or equal to 0' })
  sold?: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Discount must be greater than or equal to 0' })
  @Max(100, { message: 'Discount cannot exceed 100%' })
  discount?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantDto)
  variants: ProductVariantDto[];
}
export class ProductVariantDto {
  @IsNotEmpty()
  @IsString()
  color: string;

  @IsNotEmpty()
  @IsArray()
  images: string[];

  @IsNotEmpty()
  @IsArray()
  variants: { size: number; quantity: number }[];
}
