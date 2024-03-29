import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { PaginationDto } from 'src/accommodation/dto/pagination.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserGuard } from 'src/common/guards/user.guard';
import { AuthUser } from 'src/common/types/AuthUser.type';
import { LangQuery } from 'src/customDecorators/langQuery.decorator';
import { BookingService } from './booking.service';
import { AvailableDatesResDto, BookingReqDto, BookingResDto } from './dto';

@Controller('booking')
@UseGuards(UserGuard)
@ApiTags('booking')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'User not authorized' })
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get('/available-dates/:id')
  @LangQuery()
  @ApiOperation({ summary: 'Get accommodation availability' })
  @ApiOkResponse({
    description: 'Returns dates in YYYY-MM-DD format, if not available returns message',
    type: AvailableDatesResDto,
  })
  async getAccommodationAvailableDates(@Param('id') id: string) {
    const data = await this.bookingService.getAccommodationAvailableDates(id);
    return {
      success: true,
      data,
    };
  }

  @Post('/book')
  @LangQuery()
  @ApiOperation({ summary: 'Book accommodation' })
  @ApiOkResponse({ description: 'Returns booking object', type: BookingResDto })
  @ApiNotFoundResponse({ description: 'Accommodation not found' })
  @ApiBadRequestResponse({ description: 'Accommodation not available for this dates' })
  @ApiBadRequestResponse({ description: 'Already booked on some of these dates' })
  async bookAccommodation(@Body() body: BookingReqDto, @CurrentUser('id') userId: string) {
    const data = await this.bookingService.bookAccommodation(userId, body);
    return {
      success: true,
      data,
    };
  }

  @Get('/my-bookings')
  @LangQuery()
  @ApiOperation({ summary: 'Get user bookings' })
  @ApiOkResponse({
    description: 'Returns array of bookings',
    schema: {
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'array',
          items: {
            $ref: getSchemaPath(BookingResDto),
          },
        },
        totalCount: {
          type: 'number',
        },
      },
    },
  })
  async getUserBookings(@Query() options: PaginationDto, @CurrentUser() user: AuthUser) {
    return this.bookingService.getUserBookings(user, options);
  }
}
