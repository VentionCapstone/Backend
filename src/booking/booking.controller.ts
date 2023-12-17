import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  refs,
} from '@nestjs/swagger';
import { UserGuard } from 'src/common/guards/user.guard';
import { BookingService } from './booking.service';
import { DatesAvailableResDto, DatesNotAvailableResDto } from './dto';

@Controller('booking')
@UseGuards(UserGuard)
@ApiTags('BOOKING')
@ApiBearerAuth()
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get('/availability/:id')
  @ApiOperation({ summary: 'GET ACCOMODATION AVAILABILITY' })
  @ApiExtraModels(DatesAvailableResDto, DatesNotAvailableResDto)
  @ApiOkResponse({
    description: 'Returns dates in YYYY-MM-DD format, if not available returns message',
    schema: {
      oneOf: refs(DatesAvailableResDto, DatesNotAvailableResDto),
    },
  })
  async getAccomodationAvaibility(@Param('id') id: string) {
    const data = await this.bookingService.getAccomodationAvaibility(id);
    return {
      success: true,
      data,
    };
  }
}
