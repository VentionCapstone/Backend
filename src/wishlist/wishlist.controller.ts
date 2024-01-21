import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserGuard } from 'src/common/guards/user.guard';
import { WishlisResponse, WishlistResponseDto } from './dto/wishlist-response.dto';
import { WishlistService } from './wishlist.service';

@UseGuards(UserGuard)
@ApiTags('wishlist')
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @ApiOperation({ summary: 'Get all from wishlist' })
  @ApiOkResponse({
    type: WishlistResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiBearerAuth()
  @Get()
  getAllFromWishlist(@CurrentUser('id') userId: string) {
    return this.wishlistService.getAllFromWishlist(userId);
  }

  @ApiOperation({ summary: 'Add to wishlist' })
  @ApiOkResponse({
    type: WishlisResponse,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiBearerAuth()
  @Post(':accommodationId')
  addToWishlist(
    @Param('accommodationId') accommodationId: string,
    @CurrentUser('id') userId: string
  ) {
    return this.wishlistService.addToWishlist(accommodationId, userId);
  }

  @ApiOperation({ summary: 'Delete from wishlist' })
  @ApiOkResponse({
    type: WishlisResponse,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiBearerAuth()
  @Delete(':accommodationId')
  deleteFromWishlist(
    @Param('accommodationId') accommodationId: string,
    @CurrentUser('id') userId: string
  ) {
    return this.wishlistService.deleteFromWishlist(accommodationId, userId);
  }
}
