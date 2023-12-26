import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import * as dayjs from 'dayjs';
import ErrorsTypes from 'src/errors/errors.enum';
import { GlobalException } from 'src/exceptions/global.exception';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderAndFilter, OrderBy } from './dto/orderAndFilter.dto';

@Injectable()
export class AccommodationService {
  constructor(private readonly prisma: PrismaService) {}

  async createAccommodation(createAccommodationBody: any) {
    try {
      const newAccommodation = await this.prisma.accommodation.create({
        include: {
          address: true,
        },
        data: createAccommodationBody,
      });

      return newAccommodation;
    } catch (error) {
      throw new GlobalException(ErrorsTypes.ACCOMMODATION_FAILED_TO_CREATE, error.message);
    }
  }

  async updateAccommodation(
    id: string,
    updateAccommodationBody: any,
    ownerId: string
  ): Promise<any> {
    let existingAccommodation;
    try {
      existingAccommodation = await this.prisma.accommodation.findUnique({
        where: { id, ownerId },
        include: {
          address: true,
        },
      });
    } catch (error) {
      throw new GlobalException(
        ErrorsTypes.ACCOMMODATION_FAILED_TO_GET_FOR_UPDATING,
        error.message
      );
    }

    if (!existingAccommodation)
      throw new NotFoundException(ErrorsTypes.NOT_FOUND_ACCOMMODATION_FOR_UPDATING);

    try {
      const updatedAccommodation = await this.prisma.accommodation.update({
        where: { id },
        include: {
          address: true,
        },
        data: updateAccommodationBody,
      });
      return updatedAccommodation;
    } catch (error) {
      throw new GlobalException(ErrorsTypes.ACCOMMODATION_FAILED_TO_UPDATE, error.message);
    }
  }

  async deleteAccommodation(id: string, ownerId: string) {
    let deletingAccommodation;
    try {
      deletingAccommodation = await this.prisma.accommodation.findUnique({
        select: {
          id: true,
        },
        where: {
          id,
          ownerId,
          isDeleted: false,
        },
      });
    } catch (error) {
      throw new GlobalException(ErrorsTypes.ACCOMMODATION_FAILED_GET_DELETING, error.message);
    }

    if (!deletingAccommodation)
      throw new NotFoundException(ErrorsTypes.NOT_FOUND_ACCOMMODATION_FOR_DELETING);

    try {
      const bookedDates = await this.prisma.booking.findMany({
        select: {
          startDate: true,
          endDate: true,
        },
        where: { accommodationId: id },
      });

      const currentDate = dayjs();

      for (const booking of bookedDates) {
        const endDate = dayjs(booking.endDate);

        if (!currentDate.isAfter(endDate, 'day'))
          throw new BadRequestException(ErrorsTypes.BAD_REQUEST_ACCOMMODATION_HAS_BOOKINGS);
      }

      await this.prisma.accommodation.update({
        where: { id },
        data: {
          isDeleted: true,
        },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new GlobalException(ErrorsTypes.ACCOMMODATION_FAILED_TO_DELETE, error.message);
    }
    return;
  }

  async restoreAccommodation(id: string, ownerId: string) {
    let restoringAccommodation;
    try {
      restoringAccommodation = await this.prisma.accommodation.findUnique({
        select: {
          id: true,
        },
        where: {
          id,
          ownerId,
          isDeleted: true,
        },
      });
    } catch (error) {
      throw new GlobalException(ErrorsTypes.ACCOMMODATION_FAILED_TO_GET_RESTORING, error.message);
    }

    if (!restoringAccommodation) {
      throw new NotFoundException(ErrorsTypes.NOT_FOUND_ACCOMMODATION_FOR_RESTORING);
    }
    try {
      return await this.prisma.accommodation.update({
        where: { id },
        data: {
          isDeleted: false,
        },
        include: {
          address: true,
        },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new GlobalException(ErrorsTypes.ACCOMMODATION_FAILED_TO_RESTORE, error.message);
    }
  }

  async getOneAccommodation(id: string) {
    let accommodation;
    try {
      accommodation = await this.prisma.accommodation.findUnique({
        where: { id },
        include: {
          address: true,
        },
      });
    } catch (error) {
      throw new GlobalException(ErrorsTypes.ACCOMMODATION_FAILED_TO_GET, error.message);
    }
    if (!accommodation) throw new NotFoundException(ErrorsTypes.NOT_FOUND_ACCOMMODATION);
    return accommodation;
  }

  async addFileToAccommodation(id: string, file: any, ownerId: string): Promise<any> {
    let existingAccommodation;
    try {
      existingAccommodation = await this.prisma.accommodation.findUnique({
        where: { id, ownerId },
      });
    } catch (error) {
      throw new GlobalException(
        ErrorsTypes.ACCOMMODATION_FAILED_TO_GET_FOR_UPDATING,
        error.message
      );
    }

    if (!existingAccommodation)
      throw new NotFoundException(ErrorsTypes.NOT_FOUND_ACCOMMODATION_FOR_UPDATING);

    const base64Data = file.buffer.toString('base64');

    const updateAccommodationAndAdress = {
      previewImgUrl: base64Data,
      thumbnailUrl: base64Data,
    };

    try {
      const updatedAccommodation = await this.prisma.accommodation.update({
        where: { id },
        data: updateAccommodationAndAdress,
      });

      return updatedAccommodation;
    } catch (error) {
      throw new GlobalException(ErrorsTypes.ACCOMMODATION_FAILED_TO_UPDATE, error.message);
    }
  }

  async getUserAccommodations(ownerId: string) {
    let accommodation;
    try {
      accommodation = await this.prisma.accommodation.findMany({
        where: { ownerId },
        include: {
          address: true,
        },
      });
    } catch (error) {
      throw new GlobalException(ErrorsTypes.ACCOMMODATION_FAILED_TO_GET_LIST);
    }
    return accommodation;
  }

  async getAllAccommodations(options: OrderAndFilter) {
    try {
      const findManyOptions = this.generateFindAllQueryObj(options);

      const findAccommodationsQuery = this.prisma.accommodation.findMany(findManyOptions);
      const countAccommodationsQuery = this.prisma.accommodation.count({
        where: findManyOptions.where,
      });
      const curPriceStatsQuery = this.prisma.accommodation.aggregate({
        _min: { price: true },
        _max: { price: true },
        where: findManyOptions.where,
      });
      const totalPriceStatsQuery = this.prisma.accommodation.aggregate({
        _min: { price: true },
        _max: { price: true },
      });

      const [accommodations, totalCount, curPriceStats, totalPriceStats] = await Promise.all([
        findAccommodationsQuery,
        countAccommodationsQuery,
        curPriceStatsQuery,
        totalPriceStatsQuery,
      ]);

      const {
        _min: { price: curMinPrice },
        _max: { price: curMaxPrice },
      } = curPriceStats;

      const {
        _min: { price: totalMinPrice },
        _max: { price: totalMaxPrice },
      } = totalPriceStats;

      return {
        priceRange: { curMinPrice, curMaxPrice, totalMinPrice, totalMaxPrice },
        totalCount,
        data: accommodations,
      };
    } catch (error) {
      throw new GlobalException(ErrorsTypes.ACCOMMODATION_FAILED_TO_GET_LIST, error.message);
    }
  }

  private generateFindAllQueryObj(options: OrderAndFilter) {
    const findManyOptions: any = {
      select: {
        id: true,
        thumbnailUrl: true,
        squareMeters: true,
        numberOfRooms: true,
        allowedNumberOfPeople: true,
        price: true,
        address: {
          select: {
            country: true,
          },
        },
      },

      where: {
        isDeleted: false,
        price: {
          gte: options.minPrice,
          lte: options.maxPrice,
        },
        numberOfRooms: {
          gte: options.minRooms,
          lte: options.maxRooms,
        },
        allowedNumberOfPeople: {
          gte: options.minPeople,
          lte: options.maxPeople,
        },
      },

      skip: (options.page! - 1) * options.limit!,
      take: options.limit,

      orderBy: [],
    };

    if (options.orderByPeople) {
      findManyOptions.orderBy.push({
        [OrderBy.NUMBER_OF_PEOPLE]: options.orderByPeople,
      });
    }

    if (options.orderByPrice) {
      findManyOptions.orderBy.push({
        [OrderBy.PRICE]: options.orderByPrice,
      });
    }

    if (options.orderByRoom) {
      findManyOptions.orderBy.push({
        [OrderBy.NUMBER_OF_ROOMS]: options.orderByRoom,
      });
    }

    return findManyOptions;
  }

  async getAccommodationReviews(accommodationId: string) {
    try {
      const findAllReviewsQuery = this.prisma.review.findMany({
        where: { accommodationId },
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

      const reviewsCountQuery = this.prisma.review.groupBy({
        by: ['rating'],
        where: { accommodationId },
        _count: true,
      });

      const averageRateQuery = this.prisma.review.aggregate({
        where: { accommodationId },
        _avg: {
          rating: true,
        },
      });

      const [reviews, ratingCounts, averageRating] = await Promise.all([
        findAllReviewsQuery,
        reviewsCountQuery,
        averageRateQuery,
      ]);

      const {
        _avg: { rating: averageRate },
      } = averageRating;

      const countByRating = this.getCountByRating(ratingCounts);

      return { data: reviews, countByRating, averageRate };
    } catch (error) {
      throw new GlobalException(ErrorsTypes.ACCOMMODATION_FAILED_TO_GET, error.message);
    }
  }

  private getCountByRating(ratingCounts: { rating: number; _count: number }[]) {
    const countByRating: Record<number, number> = {};

    for (const ratingCount of ratingCounts) {
      const rating = ratingCount.rating;
      const count = ratingCount._count;

      countByRating[rating] = count;
    }

    return countByRating;
  }
}
