import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GlobalException } from 'src/exceptions/global.exception';
import ErrorsTypes from 'src/errors/errors.enum';
import * as dayjs from 'dayjs';

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
    let deletingAccommodation;
    try {
      deletingAccommodation = await this.prisma.accommodation.findUnique({
        select: {
          id: true,
        },
        where: {
          id,
          ownerId,
        },
      });
    } catch (error) {
      throw new GlobalException(ErrorsTypes.ACCOMMODATION_FAILED_GET_DELITING, error.message);
    }
    if (!deletingAccommodation) throw new NotFoundException('Can not find deleting accommodation');

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

        if (!currentDate.isAfter(endDate, 'day')) {
          throw new BadRequestException('There is an available booking');
        }
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
        },
      });
    } catch (error) {
      throw new GlobalException(ErrorsTypes.ACCOMMODATION_FAILED_TO_GET_RESTORING, error.message);
    }
    if (!restoringAccommodation)
      throw new NotFoundException('Can not find restoring accommodation');

    try {
      await this.prisma.accommodation.update({
        where: { id },
        data: {
          isDeleted: false,
        },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new GlobalException(ErrorsTypes.ACCOMMODATION_FAILED_TO_RESTORE, error.message);
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

  async getListOfAccommodations(ownerId: string) {
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
}
