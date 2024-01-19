import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserGuard } from 'src/common/guards/user.guard';
import { WishlistService } from './wishlist.service';

@Controller('wishlist')
@UseGuards(UserGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  getAllFromWishlist(@CurrentUser('id') userId: string) {
    return this.wishlistService.getAllFromWishlist(userId);
  }

  @Post(':accommodationId')
  addToWishlist(
    @Param('accommodationId') accommodationId: string,
    @CurrentUser('id') userId: string
  ) {
    return this.wishlistService.addToWishlist(accommodationId, userId);
  }

  @Delete(':wishlistId')
  deleteFromWishlist(@Param('wishlistId') wishlistId: string, @CurrentUser('id') userId: string) {
    return this.wishlistService.deleteFromWishlist(wishlistId, userId);
  }
}
