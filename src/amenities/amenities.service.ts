import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AmenitiesDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { GlobalException } from 'src/exceptions/global.exception';
import ErrorsTypes from 'src/errors/errors.enum';
import PrismaErrorCodes from 'src/errors/prismaErrorCodes.enum';

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
      throw new GlobalException(ErrorsTypes.AMENITIES_LIST_FAILED_TO_GET);
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
      if (error instanceof NotFoundException) throw error;
      throw new GlobalException(ErrorsTypes.AMENITIES_FAILED_TO_GET);
    }
  }

  async addAmenities(id: string, dto: AmenitiesDto, userId: string) {
    try {
      const newAmenities = await this.prisma.amenity.create({
        data: { ...dto, accommodation: { connect: { id, ownerId: userId } } },
      });
      return { message: 'Success adding amenities', data: newAmenities };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCodes.UNIQUE_CONSTRAINT_FAILED) {
          throw new ConflictException('Amenities for this accomodation already exist');
        }
        if (error.code === PrismaErrorCodes.FOREIGN_KEY_CONSTRAINT_FAILED) {
          throw new NotFoundException('No amenities found for this accomodation id');
        }
        if (error.code === PrismaErrorCodes.RECORD_NOT_FOUND) {
          throw new NotFoundException(
            'No record with given accommodation id and owner id is found'
          );
        }
      }
      throw new GlobalException(ErrorsTypes.AMENITIES_FAILED_TO_ADD);
    }
  }

  async updateAmenities(id: string, dto: AmenitiesDto, userId: string) {
    try {
      const updatedAmenities = await this.prisma.amenity.update({
        where: {
          accommodationId: id,
          accommodation: {
            ownerId: userId,
          },
        },
        data: { ...dto },
      });
      return { message: 'Success updating amenities', data: updatedAmenities };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCodes.RECORD_NOT_FOUND) {
          throw new NotFoundException(
            'No record with given accommodation id and owner id is found'
          );
        }
      }
      throw new GlobalException(ErrorsTypes.AMENITIES_FAILED_TO_UPDATE);
    }
  }

  async deleteAmenities(id: string, userId: string) {
    try {
      const deletedAmenities = await this.prisma.amenity.delete({
        where: {
          accommodationId: id,
          accommodation: {
            ownerId: userId,
          },
        },
      });
      return { message: 'Success deleting amenities', data: deletedAmenities };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCodes.RECORD_NOT_FOUND) {
          throw new NotFoundException(
            'No record with given accommodation id and owner id is found'
          );
        }
      }
      throw new GlobalException(ErrorsTypes.AMENITIES_FAILED_TO_DELETE);
    }
  }
}
