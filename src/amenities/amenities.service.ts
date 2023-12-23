import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { I18nService } from 'nestjs-i18n';
import ErrorsTypes from 'src/errors/errors.enum';
import PrismaErrorCodes from 'src/errors/prismaErrorCodes.enum';
import { GlobalException } from 'src/exceptions/global.exception';
import { translateMessage } from 'src/helpers/translateMessage.helper';
import MessagesTypes from 'src/messages/messages.enum';
import { PrismaService } from 'src/prisma/prisma.service';
import { AmenitiesDto } from './dto';

@Injectable()
export class AmenitiesService {
  constructor(
    private prisma: PrismaService,
    private readonly i18n: I18nService
  ) {}

  async getAmenitiesList() {
    try {
      const columns: Array<{ column_name: string }> = await this.prisma
        .$queryRaw`SELECT column_name FROM information_schema.columns WHERE table_name = 'Amenity';`;
      const excludedColumns = ['accommodationId', 'id'];
      const list = columns
        .filter((column) => !excludedColumns.includes(column.column_name))
        .map((column) => column.column_name);

      if (!columns) throw new NotFoundException(ErrorsTypes.NOT_FOUND_AMENITIES_LIST);

      return {
        success: true,
        data: list,
      };
    } catch (error) {
      throw new GlobalException(ErrorsTypes.AMENITIES_LIST_FAILED_TO_GET, error.message);
    }
  }

  async getAmenities(id: string) {
    try {
      const amenities = await this.prisma.amenity.findUnique({
        where: {
          accommodationId: id,
        },
      });
      if (!amenities) throw new NotFoundException(ErrorsTypes.NOT_FOUND_AMENITIES_FOR_THIS_ID);
      return { success: true, data: amenities };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new GlobalException(ErrorsTypes.AMENITIES_FAILED_TO_GET, error.message);
    }
  }

  async addAmenities(id: string, dto: AmenitiesDto, userId: string) {
    try {
      const newAmenities = await this.prisma.amenity.create({
        data: { ...dto, accommodation: { connect: { id, ownerId: userId } } },
      });
      return {
        message: translateMessage(this.i18n, MessagesTypes.AMENITY_ADD_SUCCESS),
        data: newAmenities,
      };
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
      return {
        message: translateMessage(this.i18n, MessagesTypes.AMENITY_UPDATE_SUCCESS),
        data: updatedAmenities,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCodes.RECORD_NOT_FOUND) {
          throw new NotFoundException(ErrorsTypes.NOT_FOUND_AMENITIES_FOR_THIS_ID_OWNERID);
        }
      }
      throw new GlobalException(ErrorsTypes.AMENITIES_FAILED_TO_UPDATE, error.message);
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
      return {
        message: translateMessage(this.i18n, MessagesTypes.AMENITY_DELETE_SUCCESS),
        data: deletedAmenities,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCodes.RECORD_NOT_FOUND) {
          throw new NotFoundException(ErrorsTypes.NOT_FOUND_AMENITIES_FOR_THIS_ID_OWNERID);
        }
      }
      throw new GlobalException(ErrorsTypes.AMENITIES_FAILED_TO_DELETE, error.message);
    }
  }
}
