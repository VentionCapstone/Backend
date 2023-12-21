import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import ErrorsTypes from 'src/errors/errors.enum';
import { GlobalException } from 'src/exceptions/global.exception';
import { PrismaService } from 'src/prisma/prisma.service';
import * as dayjs from 'dayjs';
import UpdateReviewDto from './dto/update-user.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import PrismaErrorCodes from 'src/errors/prismaErrorCodes.enum';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}
  getReviewQuery = {
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
  };

  async createReview(createReviewBody: any, bookingId: string) {
    try {
      const bookking = await this.prisma.booking.findUnique({
        where: {
          id: bookingId,
          userId: createReviewBody.userId,
          accommodationId: createReviewBody.accommodationId,
          accommodation: {
            ownerId: {
              not: createReviewBody.userId,
            },
          },
        },
      });

      if (!bookking) {
        throw new NotFoundException('Bookking not found');
      }

      const currentDate = dayjs();
      const bookingEndDate = dayjs(bookking?.endDate);

      if (!currentDate.isAfter(bookingEndDate, 'day')) {
        throw new BadRequestException('You can add review only after the end of booking');
      }

      const newReview = await this.prisma.review.create({
        data: createReviewBody,
        ...this.getReviewQuery,
      });

      return newReview;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      if (error.code === PrismaErrorCodes.UNIQUE_CONSTRAINT_FAILED) {
        throw new ConflictException('You already have a review on this booking of accommodation');
      }

      throw new GlobalException(ErrorsTypes.ACCOMMODATION_FAILED_TO_CREATE, error.message);
    }
  }

  async updateReview(updateReviewBody: UpdateReviewDto, reviewId: string, userId: string) {
    let existingReview;
    try {
      existingReview = await this.prisma.review.findUnique({
        where: { id: reviewId, userId },
      });
    } catch (error) {
      throw new GlobalException(
        ErrorsTypes.ACCOMMODATION_FAILED_TO_GET_FOR_UPDATING,
        error.message
      );
    }

    if (!existingReview) throw new NotFoundException('Can not find updating review');

    try {
      const newAccommodation = await this.prisma.review.update({
        where: { id: reviewId },
        data: updateReviewBody,
        ...this.getReviewQuery,
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
        ...this.getReviewQuery,
      });
    } catch (error) {
      throw new GlobalException(ErrorsTypes.ACCOMMODATION_FAILED_TO_GET, error.message);
    }
    if (!review) throw new NotFoundException('Can not find review');
    return review;
  }

  async deleteReview(reviewId: string, userId: string) {
    try {
      await this.prisma.review.delete({
        where: { id: reviewId, userId },
      });
      return {};
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCodes.RECORD_NOT_FOUND) {
          throw new NotFoundException('Can not find review');
        }
      }
      throw new GlobalException(ErrorsTypes.AMENITIES_FAILED_TO_DELETE, error.message);
    }
  }
}
