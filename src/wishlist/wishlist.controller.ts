import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserGuard } from 'src/common/guards/user.guard';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { WishlistService } from './wishlist.service';

@Controller('wishlist')
@UseGuards(UserGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  addToWishlist(@Body() body: CreateWishlistDto, @CurrentUser('id') userId: string) {
    console.log('fsdfdsfsdfdsfs', body);
    return this.wishlistService.addAccommodationToWishlist(body, userId);
  }

  @Get()
  getAll(@CurrentUser('id') userId: string) {
    return this.wishlistService.getAllFromWishlist(userId);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.wishlistService.remove(+id);
  // }
}
