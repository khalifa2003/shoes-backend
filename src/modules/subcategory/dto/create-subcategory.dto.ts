import { IsMongoId, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { Types } from 'mongoose';

export class CreateSubcategoryDto {
  @IsNotEmpty()
  @MinLength(3, { message: 'Too short name' })
  @MaxLength(32, { message: 'Too long name' })
  readonly name: string;

  @IsNotEmpty()
  @IsMongoId()
  readonly category: Types.ObjectId;
}
