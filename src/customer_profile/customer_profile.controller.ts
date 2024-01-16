import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CustomerProfileService } from './customer_profile.service';
import { UserGuard } from '../common/guards/user.guard';

@UseGuards(UserGuard)
@Controller('customer-profile')
export class CustomerProfileController {
  constructor(private readonly customerProfileService: CustomerProfileService) {}

  @Post('reviews/:id')
  getReviewsOnAccommodation(@Param('id') accoommodationId: string) {
    return this.customerProfileService.getReviewsOnAccommodation(accoommodationId);
  }

  @Get('rating/:id')
  getAverageRating(@Param('id') userId: string) {
    return this.customerProfileService.getAverageRating(userId);
  }

  @Get('basic-informations/:id')
  getBasicInformations(@Param('id') userId: string) {
    return this.customerProfileService.getBasicInformations(userId);
  }
}
