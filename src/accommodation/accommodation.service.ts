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
          Address: true,
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
          Address: true,
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
          Address: true,
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
          Address: true,
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
          Address: true,
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
  async getAllAccommodations(options: OrderAndFilter) {
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

      // findManyOptions.where.price = {
      //   gte: options.minPrice,
      //   lte: options.maxPrice ?? parseInt(process.env.ACCOMMODATION_MAX_PRICE || '0', 10),
      // };

      // findManyOptions.where.numberOfRooms = {
      //   gte: options.minRooms,
      //   lte: options.maxRooms ?? parseInt(process.env.ACCOMMODATION_MAX_ROOMS || '0', 10),
      // };

      // findManyOptions.where.allowedNumberOfPeople = {
      //   gte: options.minPeople,
      //   lte: options.maxPeople ?? parseInt(process.env.ACCOMMODATION_MAX_PEOPLE || '0', 10),
      // };

      if (options.page && options.limit) {
        findManyOptions.skip = (options.page - 1) * options.limit;
        findManyOptions.take = options.limit;
      }

      const accommodations = await this.prisma.accommodation.findMany(findManyOptions);
      if (!accommodations) throw new NotFoundException('There is no accommodations yet');

      return accommodations;
    } catch (error) {
      throw new GlobalException(ErrorsTypes.ACCOMMODATIONS_LIST_FAILED_TO_GET);
    }
  }
}
