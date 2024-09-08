import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CreateReviewDto } from './dto/create-review.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  getAllReviews(@Query('productId') productId: string) {
    return this.reviewService.getAllReviews(productId);
  }

  @Get(':id')
  getReviewById(@Param('id') id: string) {
    return this.reviewService.getReviewById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin, Role.Manager)
  createReview(@Body() createReviewDto: CreateReviewDto, @Req() req) {
    createReviewDto.user = req.user._id;
    return this.reviewService.createReview(createReviewDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin, Role.Manager)
  updateReview(
    @Param('id') id: string,
    @Body() updateReviewDto: CreateReviewDto,
  ) {
    return this.reviewService.updateReview(id, updateReviewDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin, Role.Manager)
  deleteReview(@Param('id') id: string) {
    return this.reviewService.deleteReview(id);
  }
}
