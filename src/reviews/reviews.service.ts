import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import ErrorsTypes from 'src/errors/errors.enum';
import { GlobalException } from 'src/exceptions/global.exception';
import { PrismaService } from 'src/prisma/prisma.service';
import * as dayjs from 'dayjs';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async createReview(createReviewBody: any, bookingId: string) {
    try {
      const bookking = await this.prisma.booking.findUnique({
        where: {
          id: bookingId,
          userId: createReviewBody.userId,
          accommodationId: createReviewBody.accommodationId,
        },
      });

      const currentDate = dayjs();
      const bookingEndDate = dayjs(bookking?.endDate);

      if (!currentDate.isAfter(bookingEndDate, 'day')) {
        throw new BadRequestException('You can add review only after booking end date');
      }

      const newReview = await this.prisma.review.create({
        data: createReviewBody,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profile: {
                select: {
                  country: true,
                },
              },
            },
          },
        },
      });

      return newReview;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new GlobalException(ErrorsTypes.ACCOMMODATION_FAILED_TO_CREATE, error.message);
    }
  }

  async updateReview(updateReviewBody: any, reviewId: string, ownerId: string) {
    let existingReview;
    try {
      existingReview = await this.prisma.accommodation.findUnique({
        where: { id: reviewId, ownerId },
      });
    } catch (error) {
      throw new GlobalException(
        ErrorsTypes.ACCOMMODATION_FAILED_TO_GET_FOR_UPDATING,
        error.message
      );
    }

    if (!existingReview) throw new NotFoundException('Can not find updating accommodation');

    try {
      const newAccommodation = await this.prisma.review.update({
        where: { id: reviewId },
        data: updateReviewBody,
      });

      return newAccommodation;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new GlobalException(ErrorsTypes.ACCOMMODATION_FAILED_TO_CREATE, error.message);
    }
  }

  async getOneReview(reviewId: string) {
    let review;
    try {
      review = await this.prisma.review.findUnique({
        where: { id: reviewId },
      });
    } catch (error) {
      throw new GlobalException(ErrorsTypes.ACCOMMODATION_FAILED_TO_GET, error.message);
    }
    if (!review) throw new NotFoundException('Can not find review');
    return review;
  }
}
