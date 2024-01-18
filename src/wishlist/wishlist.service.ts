import { Injectable } from '@nestjs/common';
import ErrorsTypes from 'src/errors/errors.enum';
import { GlobalException } from 'src/exceptions/global.exception';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllFromWishlist(userId: string) {
    try {
      const accommadationsFromWishlist = await this.prismaService.wishlist.findMany({
        where: { userId },
      });

      return {
        success: true,
        data: accommadationsFromWishlist,
      };
    } catch (error) {
      throw new GlobalException(ErrorsTypes.USER_FAILED_TO_GET_LIST, error.message);
    }
  }

  async addAccommodationToWishlist(createWishlistDto: CreateWishlistDto, userId: string) {
    try {
      console.log(createWishlistDto);
      await this.prismaService.wishlist.create({
        data: {
          userId,
          accommodationId: createWishlistDto.accommodationId,
        },
      });
    } catch (error) {
      throw new GlobalException(ErrorsTypes.USER_FAILED_TO_GET_LIST, error.message);
    }
  }

  // removeAccommodationFromWishlist(id: number) {
  //   return `This action removes a #${id} wishlist`;
  // }
}
