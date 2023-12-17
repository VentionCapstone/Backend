import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { Dayjs } from 'dayjs';
import ErrorsTypes from 'src/errors/errors.enum';
import { GlobalException } from 'src/exceptions/global.exception';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookingService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAccommodationAvaibility(accommodationId: string) {
    try {
      const accommodation = await this.prismaService.accommodation.findUnique({
        where: { id: accommodationId },
        select: {
          availableFrom: true,
          availableTo: true,
          availability: true,
          booking: {
            select: {
              startDate: true,
              endDate: true,
            },
          },
        },
      });

      if (!accommodation) throw new NotFoundException('Accommodation not found');

      let availableFrom = dayjs(accommodation.availableFrom);
      const availableTo = dayjs(accommodation.availableTo);
      const nextAvailableDate = dayjs().add(1, 'day').startOf('day');

      const notAvailableRes = {
        id: accommodationId,
        available: false,
        message: 'Accommodation not available',
      };

      if (accommodation.availability === false || nextAvailableDate.isAfter(availableTo))
        return notAvailableRes;

      if (availableFrom < nextAvailableDate) availableFrom = nextAvailableDate;
      const allDates = this.getAllDatesBetween(availableFrom, availableTo);

      const bookedDates: string[] = [];

      for (const booking of accommodation.booking) {
        const startDate = dayjs(booking.startDate);
        const endDate = dayjs(booking.endDate);

        const dates = this.getAllDatesBetween(startDate, endDate);

        bookedDates.push(...dates);
      }

      const availableDates = allDates.filter((date) => !bookedDates.includes(date));

      if (availableDates.length === 0) return notAvailableRes;

      return {
        id: accommodationId,
        available: true,
        availableDates,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new GlobalException(ErrorsTypes.BOOKIG_FAILED_TO_GET_AVAILABILITY, error.message);
    }
  }

  private getAllDatesBetween(startDate: Dayjs, endDate: Dayjs) {
    const allDates: string[] = [];
    let currentDate = startDate;

    while (currentDate <= endDate) {
      allDates.push(currentDate.format('YYYY-MM-DD'));
      currentDate = currentDate.add(1, 'day');
    }

    return allDates;
  }
}
