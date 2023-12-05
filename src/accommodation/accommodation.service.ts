import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GlobalException } from 'src/exceptions/global.exception';
import ErrorsTypes from 'src/errors/errors.enum';

@Injectable()
export class AccommodationService {
  constructor(private readonly prisma: PrismaService) {}

  async createAccommodation(createAccommodationBody: any) {
    const newAccommodation = await this.prisma.accommodation.create({
      include: {
        address: true,
      },
      data: createAccommodationBody,
    });

    return newAccommodation;
  }

  async updateAccommodation(
    id: string,
    updateAccommodationBody: any,
    ownerId: string
  ): Promise<any> {
    const existingAccommodation = await this.prisma.accommodation.findUnique({
      where: { id },
      include: {
        address: true,
      },
    });

    if (!existingAccommodation) throw new GlobalException(ErrorsTypes.ACCOMMODATION_NOT_FOUND);

    if (ownerId !== existingAccommodation.ownerId)
      throw new GlobalException(ErrorsTypes.ACCOMMODATION_NOT_OWNER);

    const updatedAccommodation = await this.prisma.accommodation.update({
      where: { id },
      include: {
        address: true,
      },
      data: updateAccommodationBody,
    });

    return updatedAccommodation;
  }

  async deleteAccommodation(id: string, ownerId: string) {
    const deletedAccommodation = await this.prisma.accommodation.delete({
      where: { id },
      include: {
        address: true,
      },
    });

    if (!deletedAccommodation) throw new GlobalException(ErrorsTypes.ACCOMMODATION_NOT_FOUND);

    if (ownerId !== deletedAccommodation.ownerId)
      throw new GlobalException(ErrorsTypes.ACCOMMODATION_NOT_OWNER);

    const deletedAddress = await this.prisma.address.delete({
      where: { id: deletedAccommodation.address.id },
    });

    if (!deletedAddress) throw new GlobalException(ErrorsTypes.ACCOMMODATION_CANNOT_DELETE_ADDRESS);

    return deletedAccommodation;
  }
  async getOneAccommodation(id: string) {
    const accommodation = await this.prisma.accommodation.findUnique({
      where: { id },
      include: {
        address: true,
      },
    });

    if (!accommodation) throw new GlobalException(ErrorsTypes.ACCOMMODATION_NOT_FOUND);

    return accommodation;
  }

  async addFileToAccommodation(id: string, file: any, ownerId: string): Promise<any> {
    const existingAccommodation = await this.prisma.accommodation.findUnique({
      where: { id },
    });

    if (!existingAccommodation) throw new GlobalException(ErrorsTypes.ACCOMMODATION_NOT_FOUND);

    if (ownerId !== existingAccommodation.ownerId)
      throw new GlobalException(ErrorsTypes.ACCOMMODATION_NOT_OWNER);

    const base64Data = file.buffer.toString('base64');

    const updateAccommodationAndAdress = {
      previewImgUrl: base64Data,
    };

    const updatedAccommodation = await this.prisma.accommodation.update({
      where: { id },
      data: updateAccommodationAndAdress,
    });

    return updatedAccommodation;
  }
}
