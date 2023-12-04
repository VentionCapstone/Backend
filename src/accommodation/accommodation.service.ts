import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotOwnerException } from 'src/exceptions/not-owner.exception';

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
      throw new HttpException('Failed to create accommodation.', HttpStatus.INTERNAL_SERVER_ERROR);
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
        where: { id },
        include: {
          address: true,
        },
      });
    } catch (error) {
      throw new HttpException(
        'Failed to get updating accommodation',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    if (!existingAccommodation) {
      throw new NotFoundException(`Accommodation with id ${id} not found`);
    }

    if (ownerId !== existingAccommodation.ownerId) throw new NotOwnerException();

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
      throw new HttpException('Failed to update accommodation.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteAccommodation(id: string, ownerId: string) {
    let deletedAccommodation;

    try {
      deletedAccommodation = await this.prisma.accommodation.delete({
        where: { id },
        include: {
          address: true,
        },
      });
    } catch (error) {
      throw new HttpException('Failed to delete accommodation.', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (!deletedAccommodation) {
      throw new NotFoundException(`Accommodation with id ${id} not found`);
    }

    if (ownerId !== deletedAccommodation.ownerId) throw new NotOwnerException();

    try {
      const deletedAddress = await this.prisma.address.delete({
        where: { id: deletedAccommodation.address.id },
      });

      if (!deletedAddress) {
        throw new NotFoundException(`Can't delete Accommodation Address`);
      }

      return deletedAccommodation;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException('Failed to delete accommodation.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async getOneAccommodation(id: string) {
    try {
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
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException('Failed to get accommodation.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async addFileToAccommodation(id: string, file: any, ownerId: string): Promise<any> {
    let existingAccommodation;
    try {
      existingAccommodation = await this.prisma.accommodation.findUnique({
        where: { id },
      });
    } catch (error) {
      throw new HttpException(
        'Failed to get updating accommodation',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    if (!existingAccommodation) {
      throw new NotFoundException(`Accommodation with id ${id} not found`);
    }

    if (ownerId !== existingAccommodation.ownerId) throw new NotOwnerException();

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
      throw new HttpException(
        'Failed to add image file to accommodation.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
