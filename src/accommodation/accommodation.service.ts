import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

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

    if (!existingAccommodation) {
      throw new NotFoundException(`Accommodation with id ${id} not found`);
    }

    if (ownerId !== existingAccommodation.ownerId) {
      throw new Error('You not owner of this accommodation');
    }

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

    if (!deletedAccommodation) {
      throw new NotFoundException(`Accommodation with id ${id} not found`);
    }

    if (ownerId !== deletedAccommodation.ownerId) {
      throw new Error('You not owner of this accommodation');
    }

    const deletedAddress = await this.prisma.address.delete({
      where: { id: deletedAccommodation.address.id },
    });

    if (!deletedAddress) {
      throw new NotFoundException(`Can't delete Accommodation Address`);
    }

    return deletedAccommodation;
  }
  async getOneAccommodation(id: string) {
    const accommodation = await this.prisma.accommodation.findUnique({
      where: { id },
      include: {
        address: true,
      },
    });

    if (!accommodation) {
      throw new NotFoundException(`Accommodation with id ${id} not found`);
    }

    return accommodation;
  }

  async addFileToAccommodation(id: string, file: any, ownerId: string): Promise<any> {
    const existingAccommodation = await this.prisma.accommodation.findUnique({
      where: { id },
    });

    if (!existingAccommodation) {
      throw new NotFoundException(`Accommodation with id ${id} not found`);
    }

    if (ownerId !== existingAccommodation.ownerId) {
      throw new Error('You not owner of this accommodation');
    }

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
