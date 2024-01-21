import { ConflictException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import ErrorsTypes from 'src/errors/errors.enum';
import PrismaErrorCodes from 'src/errors/prismaErrorCodes.enum';
import { GlobalException } from 'src/exceptions/global.exception';
import { translateMessage } from 'src/helpers/translateMessage.helper';
import MessagesTypes from 'src/messages/messages.enum';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WishlistService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService
  ) {}

  async getAllFromWishlist(userId: string) {
    try {
      const accommadationsFromWishlist = await this.prismaService.wishlist.findMany({
        where: { userId },
        select: {
          id: true,
          createdAt: true,
          accommodation: {
            select: {
              id: true,
              thumbnailUrl: true,
              squareMeters: true,
              numberOfRooms: true,
              allowedNumberOfPeople: true,
              price: true,
              address: {
                select: {
                  street: true,
                  city: true,
                  country: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      const accommodationsWithWishlist = accommadationsFromWishlist.map((accom) => {
        return {
          ...accom,
          isInWishlist: true,
        };
      });
      return {
        success: true,
        data: accommodationsWithWishlist,
      };
    } catch (error) {
      throw new GlobalException(ErrorsTypes.WISHLIST_FAILED_TO_GET_LIST, error.message);
    }
  }

  async addToWishlist(accommodationId: string, userId: string) {
    try {
      const accommodation = await this.prismaService.accommodation.findFirst({
        where: { id: accommodationId },
      });

      if (!accommodation) {
        throw new NotFoundException(ErrorsTypes.NOT_FOUND_ACCOMMODATION);
      }

      const foundAccommodation = await this.prismaService.wishlist.findFirst({
        where: {
          userId,
          accommodationId,
        },
      });

      if (foundAccommodation) {
        throw new ConflictException(ErrorsTypes.CONFLICT_ALREADY_ADDED_TO_WISHLIST);
      }

      await this.prismaService.wishlist.create({
        data: {
          userId,
          accommodationId,
        },
      });

      return {
        success: true,
        message: translateMessage(this.i18n, MessagesTypes.WISHLIST_ADD_SUCCESS),
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new GlobalException(ErrorsTypes.WISHLIST_FAILED_TO_ADD, error.message);
    }
  }

  async deleteFromWishlist(accommodationId: string, userId: string) {
    try {
      await this.prismaService.wishlist.delete({
        where: {
          uniqueUserAccommodation: { userId, accommodationId },
        },
      });

      return {
        success: true,
        message: translateMessage(this.i18n, MessagesTypes.WISHLIST_DELETE_SUCCESS),
      };
    } catch (error) {
      if (error.code === PrismaErrorCodes.RECORD_NOT_FOUND) {
        throw new NotFoundException(ErrorsTypes.WISHLIST_FAILED_TO_FIND);
      }

      throw new GlobalException(ErrorsTypes.WISHLIST_FAILED_TO_DELETE, error.message);
    }
  }
}
