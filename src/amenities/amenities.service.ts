import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AmenitiesDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AmenitiesService {
  constructor(private prisma: PrismaService) {}

  async getAmenitiesList() {
    try {
      const columns: Array<{ column_name: string }> = await this.prisma
        .$queryRaw`SELECT column_name FROM information_schema.columns WHERE table_name = 'Amenity';`;
      const excludedColumns = ['accommodationId', 'id'];
      const list = columns
        .filter((column) => !excludedColumns.includes(column.column_name))
        .map((column) => column.column_name);

      if (!columns) {
        throw new NotFoundException('No amenities list found');
      }

      return { message: 'Success getting amenities list', data: list };
    } catch (error) {
      throw error;
    }
  }

  async getAmenities(id: string) {
    try {
      const amenities = await this.prisma.amenity.findUnique({
        where: {
          accommodationId: id,
        },
      });
      if (!amenities) {
        throw new NotFoundException('No amenities found for this accomodation id');
      }
      return { message: 'Success getting amenities', data: amenities };
    } catch (error) {
      throw error;
    }
  }

  async addAmenities(id: string, dto: AmenitiesDto) {
    try {
      const newAmenities = await this.prisma.amenity.create({
        data: { ...dto, accommodationId: id },
      });
      return { message: 'Success adding amenities', data: newAmenities };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Amenities for this accomodation already exist');
        }
        if (error.code === 'P2003') {
          throw new NotFoundException('No amenities found for this accomodation id');
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
      return { message: 'Success updating amenities', data: updatedAmenities };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('No amenities found for this accomodation id');
        }
      }
      throw error;
    }
  }

  async deleteAmenities(id: string) {
    try {
      const deletedAmenities = await this.prisma.amenity.delete({
        where: {
          accommodationId: id,
        },
      });
      return { message: 'Success deleting amenities', data: deletedAmenities };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('No amenities found for this accomodation id');
        }
      }
      throw error;
    }
  }
}
