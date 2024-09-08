import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  HttpCode,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get()
  async getBrands() {
    return this.brandService.findAll();
  }

  @Get('/:id')
  async getBrand(@Param('id') id: string) {
    return this.brandService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Manager)
  @Post()
  @HttpCode(201)
  async createBrand(@Body() body: CreateBrandDto) {
    return this.brandService.createOne(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Manager)
  @Put('/:id')
  async updateBrand(@Param('id') id: string, @Body() body: UpdateBrandDto) {
    return this.brandService.updateOne(id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Manager)
  @Delete('/:id')
  @HttpCode(204)
  async deleteBrand(@Param('id') id: string) {
    return this.brandService.deleteOne(id);
  }
}
