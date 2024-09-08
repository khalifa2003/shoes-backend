import {
  PipeTransform,
  Injectable,
  ForbiddenException,
  ArgumentMetadata,
} from '@nestjs/common';
import { ProductService } from 'src/modules/product/product.service';

@Injectable()
export class ValidateCategoryDelecationPipe implements PipeTransform {
  constructor(private productService: ProductService) {}

  async transform(value, metadata: ArgumentMetadata) {
    let products = await this.productService.findBy({ category: value.id });
    if (products.length > 0) {
      throw new ForbiddenException(
        `The delecation is forbbiden because the model exists in ${products.length} product`,
      );
    }
    return value;
  }
}
