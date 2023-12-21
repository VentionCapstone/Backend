import { Body, Controller, Param, Post, Query, UseGuards } from '@nestjs/common';
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

@ApiTags('reviews')
@UseGuards(UserGuard)
@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @ApiOperation({ summary: 'Add review' })
  @ApiResponse({
    status: 201,
    description: 'Added review',
    type: 'string',
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
  async createAccommodation(
    @Body() body: CreateReviewDto,
    @CurrentUser('id') userId: string,
    @Query('bookingId') bookingId: string,
    @Param('accommodationId') accommodationId: string
  ) {
    const createReview = {
      userId,
      accommodationId,
      ...body,
    };
    const createdReview = await this.reviewsService.createReview(createReview, bookingId);
    return { success: true, data: createdReview };
  }
}
