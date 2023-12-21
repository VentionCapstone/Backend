import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { UserGuard } from 'src/common/guards/user.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import CreateReviewDto from './dto/create-review.dto';
import UpdateReviewDto from './dto/update-user.dto';
import { ReviewResponseDto } from './dto/review-response.dto';

@ApiTags('reviews')
@UseGuards(UserGuard)
@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @ApiOperation({ summary: 'Add review' })
  @ApiResponse({
    status: 201,
    description: 'Added review',
    type: ReviewResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Post('/:accommodationId')
  async createReview(
    @Body() body: CreateReviewDto,
    @CurrentUser('id') userId: string,
    @Query('bookingId') bookingId: string,
    @Param('accommodationId') accommodationId: string
  ) {
    const createReview = {
      userId,
      accommodationId,
      bookingId,
      ...body,
    };
    const createdReview = await this.reviewsService.createReview(createReview, bookingId);
    return { success: true, data: createdReview };
  }

  @ApiOperation({ summary: 'Update review' })
  @ApiResponse({
    status: 200,
    description: 'Updated review',
    type: ReviewResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Put('/:reviewId')
  async updateReview(
    @Body() body: UpdateReviewDto,
    @CurrentUser('id') userId: string,
    @Param('reviewId') reviewId: string
  ) {
    const updatedReview = await this.reviewsService.updateReview(body, reviewId, userId);
    return { success: true, data: updatedReview };
  }

  @ApiOperation({ summary: 'Get review by id' })
  @ApiResponse({
    status: 200,
    description: 'Review with the provided id',
    type: ReviewResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiBearerAuth()
  @Get('/:reviewId')
  async getReview(@Param('reviewId') reviewId: string) {
    const review = await this.reviewsService.getOneReview(reviewId);
    return { success: true, data: review };
  }

  @ApiOperation({ summary: 'Delete review by id' })
  @ApiResponse({
    status: 200,
    description: 'Successfully deleted',
    schema: {
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'object',
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Delete('/:reviewId')
  async deleteReview(@Param('reviewId') reviewId: string, @CurrentUser('id') userId: string) {
    const review = await this.reviewsService.deleteReview(reviewId, userId);
    return { success: true, data: review };
  }
}
