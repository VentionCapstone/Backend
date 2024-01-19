import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
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
  @ApiResponse({
    status: 200,
    type: WishlistResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiBearerAuth()
  @Get()
  getAllFromWishlist(@CurrentUser('id') userId: string) {
    return this.wishlistService.getAllFromWishlist(userId);
  }

  @ApiOperation({ summary: 'Add to wishlist' })
  @ApiResponse({
    status: 200,
    type: WishlisResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @ApiUnauthorizedResponse({
    status: 401,
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
  @ApiResponse({
    status: 200,
    type: WishlisResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiBearerAuth()
  @Delete(':wishlistId')
  deleteFromWishlist(@Param('wishlistId') wishlistId: string, @CurrentUser('id') userId: string) {
    return this.wishlistService.deleteFromWishlist(wishlistId, userId);
  }
}
