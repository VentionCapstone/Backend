import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import ErrorsTypes from '../errors/errors.enum';

@Injectable()
export class CustomerProfileService {
  constructor(private prismaService: PrismaService) {}

  async getReviewsOnAccommodation(accommodationId: string) {
    const accommodation = await this.prismaService.accommodation.findFirst({
      where: { id: accommodationId },
    });
    if (!accommodation) throw new NotFoundException(ErrorsTypes.NOT_FOUND_ACCOMMODATION);
    return this.prismaService.review.findMany({ where: { accommodationId } });
  }

  async getAverageRating(userId: string): Promise<number> {
    const userReviews = await this.prismaService.review.findMany({ where: { userId } });
    if (!userReviews.length) {
      throw new NotFoundException(ErrorsTypes.NOT_FOUND_REVIEW_FOR_GET_RATING);
    }
    const totalRating = userReviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / userReviews.length;
  }
}
