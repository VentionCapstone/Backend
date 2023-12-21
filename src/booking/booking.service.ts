import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { Dayjs } from 'dayjs';
import { I18nService } from 'nestjs-i18n';
import ErrorsTypes from 'src/errors/errors.enum';
import { GlobalException } from 'src/exceptions/global.exception';
import { translateErrorMessage } from 'src/helpers/translateErrorMessage.helper';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookingService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService
  ) {}

  async getAccommodationAvailableDates(accommodationId: string) {
    try {
      const accommodation = await this.prismaService.accommodation.findUnique({
        where: { id: accommodationId },
        select: {
          availableFrom: true,
          availableTo: true,
          booking: {
            select: {
              startDate: true,
              endDate: true,
            },
            orderBy: {
              startDate: 'asc',
            },
          },
        },
      });

      if (!accommodation)
        throw new NotFoundException(
          await translateErrorMessage(this.i18n, 'errors.NOT_FOUND_ACCOMODATION')
        );

      let availableFrom = dayjs(accommodation.availableFrom);
      const availableTo = dayjs(accommodation.availableTo);
      const nextAvailableDate = dayjs().add(1, 'day').startOf('day');

      const notAvailableRes = {
        id: accommodationId,
        availableDates: null,
      };

      if (nextAvailableDate.isAfter(availableTo)) return notAvailableRes;

      if (availableFrom < nextAvailableDate) availableFrom = nextAvailableDate;
      const availableDates = this.getDateRanges(availableFrom, availableTo, accommodation.booking);

      if (availableDates.length === 0) return notAvailableRes;

      return {
        id: accommodationId,
        availableDates,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new GlobalException(ErrorsTypes.BOOKING_FAILED_TO_GET_AVAILABLE_DATES, error.message);
    }
  }

  private getDateRanges(
    startDate: Dayjs,
    endDate: Dayjs,
    bookedDates: { startDate: Date; endDate: Date }[]
  ) {
    const ranges = [];
    let range = [];
    let start = startDate;
    let end = endDate;

    for (const date of bookedDates) {
      if (start.isBefore(dayjs(date.startDate))) {
        end = dayjs(date.startDate);
        range = [start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD')];
        ranges.push(range);
      }
      start = dayjs(date.endDate);
    }

    if (start.isBefore(endDate)) {
      range = [start.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD')];
      ranges.push(range);
    }

    return ranges;
  }
}
