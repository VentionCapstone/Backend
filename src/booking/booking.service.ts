import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Status } from '@prisma/client';
import * as dayjs from 'dayjs';
import { Dayjs } from 'dayjs';
import * as isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import * as utc from 'dayjs/plugin/utc';
import { PaginationDto } from 'src/accommodation/dto/pagination.dto';
import { STANDARD_CHECKIN_HOUR, STANDARD_CHECKOUT_HOUR } from 'src/common/constants/booking';
import { DEFAULT_DATE_FORMAT } from 'src/common/constants/date';
import { AuthUser } from 'src/common/types/AuthUser.type';
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
          available: true,
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
                in: [Status.ACTIVE, Status.PENDING, Status.UPCOMING],
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

      const notAvailableRes = {
        accommodationId,
        available: false,
        availableDates: null,
      };

      if (!accommodation.available) return notAvailableRes;

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
        available: true,
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
          available: true,
          availableFrom: true,
          availableTo: true,
          booking: {
            select: {
              startDate: true,
              endDate: true,
            },
            where: {
              status: {
                in: [Status.ACTIVE, Status.PENDING, Status.UPCOMING],
              },
              endDate: {
                gt: dayjs().toISOString(),
              },
            },
          },
        },
      });

      if (!accommodation) throw new NotFoundException(ErrorsTypes.NOT_FOUND_ACCOMMODATION);
      if (!accommodation.available)
        throw new BadRequestException(ErrorsTypes.BAD_REQUEST_BOOKING_NOT_AVAILABLE);

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
        accommodationId,
        startDate: booking.startDate,
        endDate: booking.endDate,
        status: booking.status,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new GlobalException(ErrorsTypes.BOOKING_FAILED_TO_BOOK, error.message);
    }
  }

  async getUserBookings(user: AuthUser, options: PaginationDto & { status?: Status }) {
    const { page, limit, status } = options;
    try {
      const [bookings, totalCount] = await this.prismaService.$transaction([
        this.prismaService.booking.findMany({
          where: {
            userId: user.id,
            status: status,
          },
          include: {
            accommodation: {
              select: {
                title: true,
                thumbnailUrl: true,
                previewImgUrl: true,
                timezoneOffset: true,
                price: true,
              },
            },
          },
          skip: (page! - 1) * limit!,
          take: limit,
        }),
        this.prismaService.booking.count({
          where: {
            userId: user.id,
            status: status,
          },
        }),
      ]);

      return {
        success: true,
        data: bookings,
        totalCount: totalCount,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new GlobalException(ErrorsTypes.BOOKING_FAILED_TO_GET_USER_BOOKINGS, error.message);
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
        range = [rangeStart.format(DEFAULT_DATE_FORMAT), rangeEnd.format(DEFAULT_DATE_FORMAT)];
        ranges.push(range);
      }
      rangeStart = bookingEnd;
    }

    if (rangeStart.isBefore(availableTo)) {
      range = [rangeStart.format(DEFAULT_DATE_FORMAT), availableTo.format(DEFAULT_DATE_FORMAT)];
      ranges.push(range);
    }

    return ranges;
  }

  private getTimeInZone(date: Date, offset: number) {
    return dayjs(date).utcOffset(-offset).add(offset, 'minutes');
  }

  @Cron(CronExpression.EVERY_HOUR)
  async checkBookingEnd() {
    await this.prismaService.$executeRaw`
      WITH completed AS (
        SELECT bk.id
        FROM "Booking" bk
        JOIN "Accommodation" a ON a.id = bk."accommodationId"
        WHERE bk.status = ${Status.ACTIVE}::"Status"
        AND bk."endDate" + INTERVAL '1 HOURS' * ${STANDARD_CHECKOUT_HOUR} <= NOW() AT TIME ZONE 'UTC' - INTERVAL '1 minute' * a."timezoneOffset"
      )
      UPDATE "Booking" b
      SET status = ${Status.COMPLETED}::"Status"
      FROM completed c
      WHERE b.id = c.id;`;
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async inactivateUnpaidBookings() {
    await this.prismaService.booking.updateMany({
      where: {
        status: Status.PENDING,
        createdAt: {
          lte: dayjs().subtract(1, 'hour').toISOString(),
        },
        payment: {
          status: {
            not: Status.COMPLETED,
          },
        },
      },
      data: {
        status: Status.INACTIVE,
      },
    });
  }

  @Cron(CronExpression.EVERY_HOUR)
  async activateUpcomingBookings() {
    await this.prismaService.$executeRaw`
      WITH upcoming AS (
        SELECT b.id,
        FROM "Booking" b
        JOIN "Accommodation" a ON a.id = b."accommodationId" 
        JOIN "Payment" p ON p.id = b."paymentId"
        WHERE p.status = ${Status.COMPLETED}::"Status" AND b.status = ${Status.UPCOMING}::"Status" AND
          b."startDate" + INTERVAL '1 HOUR'  * ${STANDARD_CHECKIN_HOUR} <= NOW() AT TIME ZONE 'UTC' - INTERVAL '1 minute' * a."timezoneOffset"
      )
      UPDATE "Booking" b
      SET status = ${Status.ACTIVE}::"Status"
      FROM upcoming u
      WHERE b.id = u.id;`;
  }
}
