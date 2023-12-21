import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserGuard } from 'src/common/guards/user.guard';
import { BookingService } from './booking.service';
import { AvailableDatesResDto, BookingReqDto, BookingResDto } from './dto';

@Controller('booking')
@UseGuards(UserGuard)
@ApiTags('booking')
@ApiBearerAuth()
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get('/available-dates/:id')
  @ApiOperation({ summary: 'Get accommodation availability' })
  @ApiOkResponse({
    description: 'Returns dates in YYYY-MM-DD format, if not available returns message',
    type: AvailableDatesResDto,
  })
  @ApiUnauthorizedResponse({ description: 'User not authorized' })
  async getAccommodationAvailableDates(@Param('id') id: string) {
    const data = await this.bookingService.getAccommodationAvailableDates(id);
    return {
      success: true,
      data,
    };
  }

  @Post('/book')
  @ApiOperation({ summary: 'Book accommodation' })
  @ApiOkResponse({ description: 'Returns booking object', type: BookingResDto })
  @ApiNotFoundResponse({ description: 'Accommodation not found' })
  @ApiBadRequestResponse({ description: 'Accommodation not available for this dates' })
  @ApiUnauthorizedResponse({ description: 'User not authorized' })
  async bookAccommodation(@Body() body: BookingReqDto, @CurrentUser('id') userId: string) {
    const data = await this.bookingService.bookAccommodation(userId, body);
    return {
      success: true,
      data,
    };
  }
}
