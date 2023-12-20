import { Injectable, NotFoundException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import ErrorsTypes from 'src/errors/errors.enum';
import PrismaErrorCodes from 'src/errors/prismaErrorCodes.enum';
import { GlobalException } from 'src/exceptions/global.exception';
import { translateErrorMessage } from 'src/helpers/translateErrorMessage.helper';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AccommodationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService
  ) {}

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

    if (!existingAccommodation)
      throw new NotFoundException(
        await translateErrorMessage(this.i18n, 'errors.NOT_FOUND_ACCOMODATION_FOR_UPDATING')
      );

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
    let deletedAccommodation;
    try {
      deletedAccommodation = await this.prisma.accommodation.delete({
        where: {
          id,
          ownerId,
        },
        include: {
          address: true,
        },
      });
    } catch (error) {
      if (error.code === PrismaErrorCodes.RECORD_NOT_FOUND)
        throw new NotFoundException(
          await translateErrorMessage(this.i18n, 'errors.NOT_FOUND_ACCOMODATION_FOR_DELETING')
        );
      throw new GlobalException(ErrorsTypes.ACCOMMODATION_FAILED_TO_DELETE, error.message);
    }

    try {
      await this.prisma.address.delete({
        where: { id: deletedAccommodation.addressId },
      });
    } catch (error) {
      if (error.code === PrismaErrorCodes.RECORD_NOT_FOUND)
        throw new NotFoundException(
          await translateErrorMessage(this.i18n, 'errors.NOT_FOUND_ADDRESS_FOR_DELETING')
        );
      throw new GlobalException(ErrorsTypes.ACCOMMODATION_ADDRESS_FAILED_TO_DELETE, error.message);
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
    if (!accommodation)
      throw new NotFoundException(
        await translateErrorMessage(this.i18n, 'errors.NOT_FOUND_ACCOMODATION')
      );
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

    if (!existingAccommodation)
      throw new NotFoundException(
        await translateErrorMessage(this.i18n, 'errors.NOT_FOUND_ACCOMODATION_FOR_UPDATING')
      );

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
