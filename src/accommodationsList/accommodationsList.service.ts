import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderAndFilter } from './dto/orderAndFilter.dto';
import { GlobalException } from 'src/exceptions/global.exception';
import ErrorsTypes from 'src/errors/errors.enum';

@Injectable()
export class AccommodationsListService {
  constructor(private readonly prisma: PrismaService) {}

  async getAccommodationsList(options: OrderAndFilter) {
    try {
      const findManyOptions: any = {
        where: {
          availability: true,
        },
        include: {
          Address: true,
        },
      };

      if (options.orderBy) {
        findManyOptions.orderBy = {
          [options.orderBy]: options.sortOrder,
        };
      }

      if (options.minPrice) {
        findManyOptions.where.price = {
          ...findManyOptions.where.price,
          gte: options.minPrice,
          lte: options.maxPrice,
        };
      }

      if (options.minRooms) {
        findManyOptions.where.numberOfRooms = {
          ...findManyOptions.where.numberOfRooms,
          gte: options.minRooms,
          lte: options.maxRooms,
        };
      }

      if (options.minPeople) {
        findManyOptions.where.allowedNumberOfPeople = {
          ...findManyOptions.where.allowedNumberOfPeople,
          gte: options.minPeople,
          lte: options.maxPeople,
        };
      }

      console.log(
        'file: accommodationsList.service.ts:68 ~ AccommodationsListService ~ getAccommodationsList ~ findManyOptions:',
        findManyOptions
      );

      console.log('###########', Number.POSITIVE_INFINITY);
      console.log('###########', Infinity);

      const accommodations = await this.prisma.accommodation.findMany(findManyOptions);
      if (!accommodations) throw new NotFoundException('There is no accommodations yet');
      return accommodations;
    } catch (error) {
      throw new GlobalException(ErrorsTypes.ACCOMMODATION_FAILED_TO_GET);
    }
  }
}
