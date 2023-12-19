import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserGuard } from 'src/common/guards/user.guard';
import { BookingService } from './booking.service';
import { AvailableDatesResDto } from './dto';

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
  async getAccommodationAvailableDates(@Param('id') id: string) {
    const data = await this.bookingService.getAccommodationAvailableDates(id);
    return {
      success: true,
      data,
    };
  }
}
