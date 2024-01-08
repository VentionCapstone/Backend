import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { Status } from '@prisma/client';
import * as dayjs from 'dayjs';
import { Dayjs } from 'dayjs';
import * as isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import * as utc from 'dayjs/plugin/utc';
import ErrorsTypes from 'src/errors/errors.enum';
import { GlobalException } from 'src/exceptions/global.exception';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookingReqDto } from './dto';

dayjs.extend(utc);
dayjs.extend(isSameOrBefore);

@Injectable()
export class BookingService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAccommodationAvailableDates(accommodationId: string) {
    try {
      const accommodation = await this.prismaService.accommodation.findUnique({
        where: { id: accommodationId },
        select: {
          timezoneOffset: true,
          availableFrom: true,
          availableTo: true,
          booking: {
            select: {
              startDate: true,
              endDate: true,
            },
            where: {
              status: {
                in: [Status.ACTIVE, Status.PENDING],
              },
              endDate: {
                gt: dayjs().toISOString(),
              },
            },
            orderBy: {
              startDate: 'asc',
            },
          },
        },
      });

      if (!accommodation) throw new NotFoundException(ErrorsTypes.NOT_FOUND_ACCOMMODATION);

      let availableFrom = this.getTimeInZone(
        accommodation.availableFrom,
        accommodation.timezoneOffset
      );
      const availableTo = this.getTimeInZone(
        accommodation.availableTo,
        accommodation.timezoneOffset
      );
      const tomorrow = dayjs()
        .utcOffset(-accommodation.timezoneOffset)
        .add(1, 'day')
        .startOf('day');

      const notAvailableRes = {
        id: accommodationId,
        availableDates: null,
      };

      if (tomorrow.isAfter(availableTo)) return notAvailableRes;

      if (availableFrom < tomorrow) availableFrom = tomorrow;
      const availableDates = this.getDateRanges(
        availableFrom,
        availableTo,
        accommodation.timezoneOffset,
        accommodation.booking
      );

      if (availableDates.length === 0) return notAvailableRes;

      return {
        accommodationId,
        availableDates,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new GlobalException(ErrorsTypes.BOOKING_FAILED_TO_GET_AVAILABLE_DATES, error.message);
    }
  }

  async bookAccommodation(userId: string, body: BookingReqDto) {
    const { accommodationId, startDate, endDate } = body;

    try {
      const accommodation = await this.prismaService.accommodation.findUnique({
        where: { id: accommodationId },
        select: {
          timezoneOffset: true,
          availableFrom: true,
          availableTo: true,
          booking: {
            select: {
              startDate: true,
              endDate: true,
            },
            where: {
              status: {
                in: [Status.ACTIVE, Status.PENDING],
              },
              endDate: {
                gt: dayjs().toISOString(),
              },
            },
          },
        },
      });

      if (!accommodation) throw new NotFoundException(ErrorsTypes.NOT_FOUND_ACCOMMODATION);

      const bookingStart = this.getTimeInZone(startDate, accommodation.timezoneOffset);
      const bookingEnd = this.getTimeInZone(endDate, accommodation.timezoneOffset);
      if (
        !bookingStart.isBefore(bookingEnd, 'day') ||
        !bookingStart.isAfter(dayjs().utcOffset(-accommodation.timezoneOffset).endOf('day'))
      )
        throw new BadRequestException(ErrorsTypes.BAD_REQUEST_BOOKING_INVALID_DATES);

      let availableFrom = this.getTimeInZone(
        accommodation.availableFrom,
        accommodation.timezoneOffset
      );
      const availableTo = this.getTimeInZone(
        accommodation.availableTo,
        accommodation.timezoneOffset
      );
      const tomorrow = dayjs()
        .utcOffset(-accommodation.timezoneOffset)
        .add(1, 'day')
        .startOf('day');

      if (availableFrom < tomorrow) availableFrom = tomorrow;

      if (bookingStart.isBefore(availableFrom) || bookingEnd.isAfter(availableTo))
        throw new BadRequestException(ErrorsTypes.BAD_REQUEST_BOOKING_INVALID_DATES);

      const alreadyBooked = accommodation.booking.some(
        ({ startDate, endDate }) =>
          this.getTimeInZone(startDate, accommodation.timezoneOffset).isBefore(bookingEnd) &&
          this.getTimeInZone(endDate, accommodation.timezoneOffset).isAfter(bookingStart)
      );

      if (alreadyBooked)
        throw new BadRequestException(ErrorsTypes.BAD_REQUEST_BOOKING_ALREADY_BOOKED);

      const booking = await this.prismaService.booking.create({
        data: {
          startDate: startDate,
          endDate: endDate,
          status: Status.PENDING,
          accommodation: {
            connect: {
              id: accommodationId,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });

      return {
        id: booking.id,
        startDate: booking.startDate,
        endDate: booking.endDate,
        status: booking.status,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new GlobalException(ErrorsTypes.BOOKING_FAILED_TO_BOOK, error.message);
    }
  }

  private getDateRanges(
    availableFrom: Dayjs,
    availableTo: Dayjs,
    offset: number,
    bookedDates: { startDate: Date; endDate: Date }[]
  ) {
    const ranges = [];
    let range = [];
    let rangeStart = availableFrom;

    for (const booking of bookedDates) {
      const bookingStart = this.getTimeInZone(booking.startDate, offset);
      const bookingEnd = this.getTimeInZone(booking.endDate, offset);

      if (rangeStart.isBefore(bookingStart) && bookingStart.isSameOrBefore(availableTo)) {
        const rangeEnd = bookingStart < availableTo ? bookingStart : availableTo;
        range = [rangeStart.format('YYYY-MM-DD'), rangeEnd.format('YYYY-MM-DD')];
        ranges.push(range);
      }
      rangeStart = bookingEnd;
    }

    if (rangeStart.isBefore(availableTo)) {
      range = [rangeStart.format('YYYY-MM-DD'), availableTo.format('YYYY-MM-DD')];
      ranges.push(range);
    }

    return ranges;
  }

  private getTimeInZone(date: Date, offset: number) {
    return dayjs(date).utcOffset(-offset).add(offset, 'minutes');
  }
}
