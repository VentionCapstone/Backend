import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AmenitiesDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AmenitiesService {
  constructor(private prisma: PrismaService) {}

  async getAmenities(id: string) {
    try {
      const amenities = await this.prisma.amenity.findUnique({
        where: {
          accommodationId: id,
        },
      });
      if (!amenities) {
        throw new NotFoundException('Incorrect apartment id');
      }
      return { message: 'Success getting amenities', amenities };
    } catch (error) {
      throw error;
    }
  }

  async addAmenities(id: string, dto: AmenitiesDto) {
    try {
      const newAmenities = await this.prisma.amenity.create({
        data: { ...dto, accommodationId: id },
      });
      return { message: 'Success adding amenities', newAmenities };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new InternalServerErrorException('Amenities for this accomodation already exist');
        }
        if (error.code === 'P2003') {
          throw new NotFoundException('Incorrect apartment id');
        }
      }
      throw error;
    }
  }

  async updateAmenities(id: string, dto: AmenitiesDto) {
    try {
      const updatedAmenities = await this.prisma.amenity.update({
        where: {
          accommodationId: id,
        },
        data: { ...dto },
      });
      return { message: 'Success updating amenities', updatedAmenities };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new InternalServerErrorException('Record to update not found.');
        }
      }
      throw error;
    }
  }

  async deleteAmenities(id: string) {
    try {
      const findAmenities = await this.prisma.amenity.findUnique({
        where: {
          accommodationId: id,
        },
      });
      if (!findAmenities) {
        throw new NotFoundException('Incorrect apartment id');
      } else {
        const deletedAmenities = await this.prisma.amenity.delete({
          where: {
            accommodationId: id,
          },
        });
        return { message: 'Success deleting amenities', deletedAmenities };
      }
    } catch (error) {
      throw error;
    }
  }
}
