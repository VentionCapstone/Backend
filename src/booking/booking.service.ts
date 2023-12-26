import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { Status } from '@prisma/client';
import * as dayjs from 'dayjs';
import { Dayjs } from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import ErrorsTypes from 'src/errors/errors.enum';
import { GlobalException } from 'src/exceptions/global.exception';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookingReqDto } from './dto';

dayjs.extend(utc);

@Injectable()
export class BookingService {
  constructor(private readonly prismaService: PrismaService) {}

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

      if (!accommodation) throw new NotFoundException(ErrorsTypes.NOT_FOUND_ACCOMMODATION);

      let availableFrom = dayjs(accommodation.availableFrom);
      const availableTo = dayjs(accommodation.availableTo);
      const tomorrow = dayjs().utcOffset(0).add(1, 'day').startOf('day');

      const notAvailableRes = {
        id: accommodationId,
        availableDates: null,
      };

      if (tomorrow.isAfter(availableTo)) return notAvailableRes;

      if (availableFrom < tomorrow) availableFrom = tomorrow;
      const availableDates = this.getDateRanges(availableFrom, availableTo, accommodation.booking);

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
      const bookingStart = dayjs(startDate);
      const bookingEnd = dayjs(endDate);

      if (
        !bookingStart.isBefore(bookingEnd, 'day') ||
        !bookingStart.isAfter(dayjs().utcOffset(0).endOf('day'))
      )
        throw new BadRequestException(ErrorsTypes.BAD_REQUEST_BOOKING_INVALID_DATES);

      const tomorrow = dayjs().utcOffset(0).add(1, 'day').startOf('day');

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
            where: {
              status: {
                in: [Status.ACTIVE, Status.PENDING],
              },
              endDate: {
                gt: tomorrow.toISOString(),
              },
            },
          },
        },
      });

      if (!accommodation) throw new NotFoundException(ErrorsTypes.NOT_FOUND_ACCOMMODATION);

      let availableFrom = dayjs(accommodation.availableFrom);
      const availableTo = dayjs(accommodation.availableTo);

      if (availableFrom < tomorrow) availableFrom = tomorrow;

      if (bookingStart.isBefore(availableFrom) || bookingEnd.isAfter(availableTo))
        throw new BadRequestException(ErrorsTypes.BAD_REQUEST_BOOKING_INVALID_DATES);

      const alreadyBooked = accommodation.booking.some(
        ({ startDate, endDate }) =>
          dayjs(startDate).isBefore(bookingEnd) && dayjs(endDate).isAfter(bookingStart)
      );

      if (alreadyBooked)
        throw new BadRequestException(ErrorsTypes.BAD_REQUEST_BOOKING_ALREADY_BOOKED);

      const booking = await this.prismaService.booking.create({
        data: {
          startDate: bookingStart.toISOString(),
          endDate: bookingEnd.toISOString(),
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
