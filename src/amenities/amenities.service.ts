import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import ErrorsTypes from 'src/errors/errors.enum';
import PrismaErrorCodes from 'src/errors/prismaErrorCodes.enum';
import { GlobalException } from 'src/exceptions/global.exception';
import { PrismaService } from 'src/prisma/prisma.service';
import { AmenitiesRequestDto } from './dto';

@Injectable()
export class AmenitiesService {
  constructor(private prisma: PrismaService) {}

  async getAmenitiesList() {
    try {
      const columns: Array<{ column_name: string }> = await this.prisma
        .$queryRaw`SELECT column_name FROM information_schema.columns WHERE table_name = 'Amenity';`;
      const excludedColumns = ['accommodationId', 'id'];

      const amenitiesList: string[] = [];

      for (const column of columns) {
        if (!excludedColumns.includes(column.column_name)) {
          amenitiesList.push(column.column_name);
        }
      }

      if (!columns) throw new NotFoundException(ErrorsTypes.NOT_FOUND_AMENITIES_LIST);

      return amenitiesList;
    } catch (error) {
      throw new GlobalException(ErrorsTypes.AMENITIES_FAILED_TO_GET_LIST, error.message);
    }
  }

  async addAmenities(id: string, dto: AmenitiesRequestDto, userId: string) {
    try {
      const addedAmenities = await this.prisma.amenity.create({
        data: { ...dto, accommodation: { connect: { id, ownerId: userId } } },
      });
      return addedAmenities;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCodes.UNIQUE_CONSTRAINT_FAILED)
          throw new ConflictException(ErrorsTypes.CONFLICT_AMENITIES_ALREADY_EXIST);
        if (error.code === PrismaErrorCodes.FOREIGN_KEY_CONSTRAINT_FAILED)
          throw new NotFoundException(ErrorsTypes.NOT_FOUND_AMENITIES_FOR_THIS_ID);
        if (error.code === PrismaErrorCodes.RECORD_NOT_FOUND)
          throw new NotFoundException(ErrorsTypes.NOT_FOUND_AMENITIES_FOR_THIS_ID_OWNERID);
      }
      throw new GlobalException(ErrorsTypes.AMENITIES_FAILED_TO_ADD, error.message);
    }
  }

  async updateAmenities(id: string, dto: AmenitiesRequestDto, userId: string) {
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
      return updatedAmenities;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCodes.RECORD_NOT_FOUND) {
          throw new NotFoundException(ErrorsTypes.NOT_FOUND_AMENITIES_FOR_THIS_ID_OWNERID);
        }
      }
      throw new GlobalException(ErrorsTypes.AMENITIES_FAILED_TO_UPDATE, error.message);
    }
  }
}
