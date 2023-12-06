import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GlobalException } from 'src/exceptions/global.exception';
import ErrorsTypes from 'src/errors/errors.enum';

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
      throw new GlobalException(ErrorsTypes.ACCOMMODATION_FAILED_TO_CREATE);
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
    } catch (err) {
      throw new GlobalException(ErrorsTypes.ACCOMMODATION_FAILED_TO_GET_FOR_UPDATING);
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
      throw new GlobalException(ErrorsTypes.ACCOMMODATION_FAILED_TO_UPDATE);
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
      if (error.code === 'P2025') throw new NotFoundException('Cannot find deleting accommodation');
      throw new GlobalException(ErrorsTypes.ACCOMMODATION_FAILED_TO_DELETE);
    }

    try {
      await this.prisma.address.delete({
        where: { id: deletedAccommodation.addressId },
      });
    } catch (error) {
      if (error.code === 'P2025')
        throw new NotFoundException('Cannot find deleting accommodation address');
      throw new GlobalException(ErrorsTypes.ACCOMMODATION_ADDRESS_FAILED_TO_DELETE);
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
      throw new GlobalException(ErrorsTypes.ACCOMMODATION_FAILED_TO_GET);
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
    } catch (err) {
      throw new GlobalException(ErrorsTypes.ACCOMMODATION_FAILED_TO_GET_FOR_UPDATING);
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
      throw new GlobalException(ErrorsTypes.ACCOMMODATION_FAILED_TO_UPDATE);
    }
  }
}
