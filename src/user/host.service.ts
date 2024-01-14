import { Injectable, NotFoundException } from '@nestjs/common';
import { SortOrder } from 'src/enums/sortOrder.enum';
import ErrorsTypes from 'src/errors/errors.enum';
import { GlobalException } from 'src/exceptions/global.exception';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HostService {
  constructor(private readonly prismaService: PrismaService) {}

  PAGE_SIZE = 10;

  async getHostUserProfile(id: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id, isDeleted: false },
        include: {
          profile: true,
          accommodations: {
            where: { isDeleted: false },
            select: {
              id: true,
              title: true,
              previewImgUrl: true,
            },
          },
        },
      });

      if (!user || !user.profile) throw new NotFoundException(ErrorsTypes.NOT_FOUND_HOST_PROFILE);

      if (user.accommodations.length === 0)
        throw new NotFoundException(ErrorsTypes.BAD_REQUEST_NOT_A_HOST_PROFILE);

      const [reviews, reviewsCount, ratingAverages] = await this.prismaService.$transaction([
        this.prismaService.review.findMany({
          where: { accommodation: { ownerId: id } },
          select: {
            id: true,
            accommodationId: true,
            feedback: true,
            rating: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profile: {
                  select: {
                    imageUrl: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: SortOrder.DESC },
          take: this.PAGE_SIZE,
        }),
        this.prismaService.review.count({
          where: { accommodation: { ownerId: id } },
        }),
        this.prismaService.review.groupBy({
          by: ['accommodationId'],
          _avg: { rating: true },
          where: { accommodation: { ownerId: id } },
          orderBy: { _avg: { rating: SortOrder.DESC } },
        }),
      ]);

      let ratingCount = 0;
      const overallRating =
        ratingAverages.reduce((acc, cur) => {
          if (!cur._avg || !cur._avg.rating) return acc;

          ratingCount++;

          return acc + cur._avg.rating;
        }, 0) / ratingCount;

      const accommodations = user.accommodations.map((accommodation) => ({
        ...accommodation,
        rating: ratingAverages
          .find((rating) => rating.accommodationId === accommodation.id)
          ?._avg?.rating?.toFixed(1),
      }));

      return {
        success: true,
        data: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isVerified: user.isVerified,
          isEmailVerified: user.isEmailVerified,
          language: user.profile.language,
          country: user.profile.country,
          description: user.profile.description,
          imageUrl: user.profile.imageUrl,
          joinedAt: user.createdAt,
          rating: overallRating.toFixed(1),
          accommodations: accommodations,
          reviews: {
            count: reviewsCount,
            page: 1,
            list: reviews,
          },
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new GlobalException(ErrorsTypes.HOST_PROFILE_FAILED_TO_GET, error.message);
    }
  }

  async getHostComments(id: string, page: number) {
    try {
      const reviews = await this.prismaService.review.findMany({
        where: { accommodation: { ownerId: id } },
        select: {
          id: true,
          accommodationId: true,
          feedback: true,
          rating: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profile: {
                select: {
                  imageUrl: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: SortOrder.DESC },
        take: this.PAGE_SIZE,
        skip: this.PAGE_SIZE * (page - 1),
      });

      return {
        success: true,
        data: {
          page,
          list: reviews,
        },
      };
    } catch (error) {
      throw new GlobalException(ErrorsTypes.REVIEWS_FAILED_TO_GET_LIST, error.message);
    }
  }
}
