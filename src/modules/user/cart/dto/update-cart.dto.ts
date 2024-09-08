import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class UpdateCartDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantity: number;
}
