import { Controller, Post, Body, Req, UseGuards, Patch } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ChangeReviewDto, CreateReviewDto } from './dto/create-review.dto';
import type { IJwtUserRequest } from '../user/typings';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('reviews')
@UseGuards(JwtAuthGuard) @ApiBearerAuth()
@ApiResponse({ status: 401, description: 'Unauthorized' })
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('create')
  @ApiOperation({  summary: 'Posting a product review' }) @ApiResponse({ status: 201, description: 'The review has been succeefully published' })
  create(@Req() req: IJwtUserRequest, @Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(req.user.userId, createReviewDto);
  }

  @Patch('change')
  @ApiOperation({  summary: 'Editing a product review' }) @ApiResponse({ status: 200, description: 'Review successfully updated' })
  change(@Req() req: IJwtUserRequest, @Body() changeReviewDto: ChangeReviewDto) {
    return this.reviewsService.change(req.user.userId, changeReviewDto);
  }
}
