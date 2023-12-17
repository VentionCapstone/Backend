import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GlobalException } from 'src/exceptions/global.exception';
import ErrorsTypes from 'src/errors/errors.enum';
import PrismaErrorCodes from 'src/errors/prismaErrorCodes.enum';
import { OrderAndFilter } from './dto/orderAndFilter.dto';

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

    if (!existingAccommodation) throw new NotFoundException('Can not find updating accommodation');

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
    let deletedAccommodation;
    try {
      deletedAccommodation = await this.prisma.accommodation.delete({
        where: {
          id,
          ownerId,
        },
        include: {
          address: true,
        },
      });
    } catch (error) {
      if (error.code === PrismaErrorCodes.RECORD_NOT_FOUND)
        throw new NotFoundException('Cannot find deleting accommodation');
      throw new GlobalException(ErrorsTypes.ACCOMMODATION_FAILED_TO_DELETE, error.message);
    }

    try {
      await this.prisma.address.delete({
        where: { id: deletedAccommodation.addressId },
      });
    } catch (error) {
      if (error.code === PrismaErrorCodes.RECORD_NOT_FOUND)
        throw new NotFoundException('Cannot find deleting accommodation address');
      throw new GlobalException(ErrorsTypes.ACCOMMODATION_ADDRESS_FAILED_TO_DELETE, error.message);
    }
    return;
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
    if (!accommodation) throw new NotFoundException('Can not find accommodation');
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

    if (!existingAccommodation) throw new NotFoundException('Can not find updating accommodation');

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
          availability: true,
        },
        // include: {
        //   address: true,
        // },
      };

      if (options.orderBy) {
        findManyOptions.orderBy = {
          [options.orderBy]: options.sortOrder,
        };
      }

      findManyOptions.where = {
        price: {
          gte: options.minPrice,
          lte: options.maxPrice ?? parseInt(process.env.ACCOMMODATION_MAX_PRICE || '0', 10),
        },
        numberOfRooms: {
          gte: options.minRooms,
          lte: options.maxRooms ?? parseInt(process.env.ACCOMMODATION_MAX_ROOMS || '0', 10),
        },
        allowedNumberOfPeople: {
          gte: options.minPeople,
          lte: options.maxPeople ?? parseInt(process.env.ACCOMMODATION_MAX_PEOPLE || '0', 10),
        },
      };

      if (options.page && options.limit) {
        findManyOptions.skip = (options.page - 1) * options.limit;
        findManyOptions.take = options.limit;
      }
      const {
        _min: { price: minPrice },
        _max: { price: maxPrice },
      } = await this.prisma.accommodation.aggregate({
        _min: { price: true },
        _max: { price: true },
      });

      const [accommodations, totalCount] = await Promise.all([
        this.prisma.accommodation.findMany(findManyOptions),
        this.prisma.accommodation.count(),
      ]);
      return { priceRange: { minPrice, maxPrice }, totalCount, data: accommodations };
    } catch (error) {
      throw new GlobalException(ErrorsTypes.ACCOMMODATIONS_LIST_FAILED_TO_GET, error.message);
    }
  }
}
