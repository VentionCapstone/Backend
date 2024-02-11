import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AxiosError } from 'axios';
import { Cache } from 'cache-manager';
import * as dayjs from 'dayjs';
import { catchError, firstValueFrom } from 'rxjs';
import { Currency } from 'src/enums/currency.enum';
import { SortOrder } from 'src/enums/sortOrder.enum';
import ErrorsTypes from 'src/errors/errors.enum';
import { GlobalException } from 'src/exceptions/global.exception';
import { normalizeCityName } from 'src/helpers/normalizeCityName.helper';
import { normalizeCountryName } from 'src/helpers/normalizeCountryName.helper';
import { PrismaService } from 'src/prisma/prisma.service';
import AccommodationBookingsDto from './dto/get-accommodation-bookings.dto';
import { OrderAndFilterReviewDto, reviewOrderBy } from './dto/get-review.dto';
import { GetUserAccommodationsDto } from './dto/get-user-accommodations.dto';
import { OrderAndFilterDto, OrderBy } from './dto/orderAndFilter.dto';
interface UploadImageType {
  mimetype: string;
  base64Image: string;
}

interface UploadImageResponse {
  message: string;
  data: {
    imageUrl: string;
    thumbnailUrl: string;
  };
}

const {
  ACCOMMODATION_MAX_PRICE,
  ACCOMMODATION_MAX_PEOPLE,
  ACCOMMODATION_MAX_ROOMS,
  CACHING_PAGES_LIMIT,
} = process.env;
const AccommodationMaxPrice = parseInt(ACCOMMODATION_MAX_PRICE!);
const AccommodationMaxPeople = parseInt(ACCOMMODATION_MAX_PEOPLE!);
const AccommodationMaxRooms = parseInt(ACCOMMODATION_MAX_ROOMS!);
const CachingPagesLimit = parseInt(CACHING_PAGES_LIMIT!);

@Injectable()
export class AccommodationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async createAccommodation(createAccommodationBody: any) {
    try {
      const newAccommodation = await this.prisma.accommodation.create({
        include: {
          address: true,
        },
        data: createAccommodationBody,
      });

      return newAccommodation;
    } catch (error) {
      throw new GlobalException(ErrorsTypes.ACCOMMODATION_FAILED_TO_CREATE, error.message);
    }
  }

  async updateAccommodation(
    id: string,
    updateAccommodationBody: any,
    ownerId: string
  ): Promise<any> {
    let existingAccommodation;
    try {
      existingAccommodation = await this.prisma.accommodation.findUnique({
        where: { id, ownerId },
        include: {
          address: true,
        },
      });
    } catch (error) {
      throw new GlobalException(
        ErrorsTypes.ACCOMMODATION_FAILED_TO_GET_FOR_UPDATING,
        error.message
      );
    }

    if (!existingAccommodation)
      throw new NotFoundException(ErrorsTypes.NOT_FOUND_ACCOMMODATION_FOR_UPDATING);

    try {
      const updatedAccommodation = await this.prisma.accommodation.update({
        where: { id },
        include: {
          address: true,
        },
        data: updateAccommodationBody,
      });
      return updatedAccommodation;
    } catch (error) {
      throw new GlobalException(ErrorsTypes.ACCOMMODATION_FAILED_TO_UPDATE, error.message);
    }
  }

  async deleteAccommodation(id: string, ownerId: string) {
    let deletingAccommodation;
    try {
      deletingAccommodation = await this.prisma.accommodation.findUnique({
        select: {
          id: true,
        },
        where: {
          id,
          ownerId,
          isDeleted: false,
        },
      });
    } catch (error) {
      throw new GlobalException(ErrorsTypes.ACCOMMODATION_FAILED_GET_DELETING, error.message);
    }

    if (!deletingAccommodation)
      throw new NotFoundException(ErrorsTypes.NOT_FOUND_ACCOMMODATION_FOR_DELETING);

    try {
      const bookedDates = await this.prisma.booking.findMany({
        select: {
          startDate: true,
          endDate: true,
        },
        where: { accommodationId: id },
      });

      const currentDate = dayjs();

      for (const booking of bookedDates) {
        const endDate = dayjs(booking.endDate);

        if (!currentDate.isAfter(endDate, 'day'))
          throw new BadRequestException(ErrorsTypes.BAD_REQUEST_ACCOMMODATION_HAS_BOOKINGS);
      }

      await this.prisma.accommodation.update({
        where: { id },
        data: {
          isDeleted: true,
        },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new GlobalException(ErrorsTypes.ACCOMMODATION_FAILED_TO_DELETE, error.message);
    }
    return;
  }

  async restoreAccommodation(id: string, ownerId: string) {
    let restoringAccommodation;
    try {
      restoringAccommodation = await this.prisma.accommodation.findUnique({
        select: {
          id: true,
        },
        where: {
          id,
          ownerId,
          isDeleted: true,
        },
      });
    } catch (error) {
      throw new GlobalException(ErrorsTypes.ACCOMMODATION_FAILED_TO_GET_RESTORING, error.message);
    }

    if (!restoringAccommodation) {
      throw new NotFoundException(ErrorsTypes.NOT_FOUND_ACCOMMODATION_FOR_RESTORING);
    }
    try {
      return await this.prisma.accommodation.update({
        where: { id },
        data: {
          isDeleted: false,
        },
        include: {
          address: true,
        },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new GlobalException(ErrorsTypes.ACCOMMODATION_FAILED_TO_RESTORE, error.message);
    }
  }

  async getOneAccommodation(id: string) {
    try {
      const accommodation = await this.prisma.accommodation.findUnique({
        where: { id },
        include: {
          address: true,
          media: true,
          amenities: true,
        },
      });

      if (!accommodation) throw new NotFoundException(ErrorsTypes.NOT_FOUND_ACCOMMODATION);

      const owner = await this.prisma.user.findUnique({
        where: { id: accommodation.ownerId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          isVerified: true,
          profile: {
            select: {
              language: true,
              country: true,
              imageUrl: true,
            },
          },
        },
      });

      return { ...accommodation, owner, amenities: accommodation.amenities[0] };
    } catch (error) {
      throw new GlobalException(ErrorsTypes.ACCOMMODATION_FAILED_TO_GET, error.message);
    }
  }

  async getAllMedia(id: string) {
    try {
      const allMedia = await this.prisma.media.findMany({
        where: { accommodationId: id },
      });

      return allMedia;
    } catch (error) {
      throw new GlobalException(ErrorsTypes.ACCOMMODATION_FAILED_TO_GET_IMAGES, error.message);
    }
  }

  async uploadImageToS3(file: Express.Multer.File): Promise<UploadImageResponse> {
    const requestBody: UploadImageType = {
      mimetype: file.mimetype,
      base64Image: file.buffer.toString('base64url'),
    };

    const { data } = await firstValueFrom(
      this.httpService
        .post(process.env.FILE_UPLOAD_URL!, requestBody, {
          timeout: 20000,
        })
        .pipe(
          catchError((error: AxiosError) => {
            throw new GlobalException(
              ErrorsTypes.ACCOMMODATION_FAILED_TO_STORE_IMAGES_TO_STORAGE,
              error.message
            );
          })
        )
    );
    return data;
  }

  async addFileToAccommodation(
    accommodationId: string,
    images: Express.Multer.File[],
    ownerId: string
  ): Promise<any> {
    let existingAccommodation;
    try {
      existingAccommodation = await this.prisma.accommodation.findUnique({
        where: { id: accommodationId, ownerId },
      });
    } catch (error) {
      throw new GlobalException(
        ErrorsTypes.ACCOMMODATION_FAILED_TO_GET_FOR_UPDATING,
        error.message
      );
    }

    if (!existingAccommodation)
      throw new NotFoundException(ErrorsTypes.NOT_FOUND_ACCOMMODATION_FOR_UPDATING);

    try {
      const uploadedImagesResponse = await Promise.all(
        images.map((image) => {
          return this.uploadImageToS3(image);
        })
      );

      const imagesToCreate = uploadedImagesResponse.map((image) => ({
        imageUrl: image.data.imageUrl,
        thumbnailUrl: image.data.thumbnailUrl,
        accommodationId,
      }));

      await this.prisma.media.createMany({
        data: imagesToCreate,
      });

      const [firstImage] = imagesToCreate;

      const updatedAccommodation = await this.prisma.accommodation.update({
        where: { id: accommodationId },
        data: {
          previewImgUrl: firstImage.imageUrl,
          thumbnailUrl: firstImage.thumbnailUrl,
        },
      });

      return updatedAccommodation;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new GlobalException(ErrorsTypes.ACCOMMODATION_FAILED_TO_UPDATE, error.message);
    }
  }

  async updateAccommodationFiles(
    accommodationId: string,
    ownerId: string,
    images: Express.Multer.File[] = [],
    deletedImages: string[] = []
  ) {
    let existingAccommodation;
    try {
      existingAccommodation = await this.prisma.accommodation.findUnique({
        include: { media: true },
        where: { id: accommodationId, ownerId },
      });
    } catch (error) {
      throw new GlobalException(
        ErrorsTypes.ACCOMMODATION_FAILED_TO_GET_FOR_UPDATING,
        error.message
      );
    }

    if (!existingAccommodation)
      throw new NotFoundException(ErrorsTypes.NOT_FOUND_ACCOMMODATION_FOR_UPDATING);

    if (existingAccommodation.media.length - deletedImages.length + images.length < 5)
      throw new BadRequestException(ErrorsTypes.BAD_REQUEST_NOT_ENOUGH_IMAGES_TO_UPDATE);

    try {
      const uploadedImagesResponse = await Promise.all(
        images.map((image) => {
          return this.uploadImageToS3(image);
        })
      );
      const imagesToCreate = uploadedImagesResponse.map((image) => ({
        imageUrl: image.data.imageUrl,
        thumbnailUrl: image.data.thumbnailUrl,
        accommodationId,
      }));

      const createdImages = await this.prisma.$transaction(
        imagesToCreate.map((image) => {
          return this.prisma.media.create({
            data: image,
          });
        })
      );

      let currentImages = existingAccommodation.media;
      currentImages.push(...createdImages);

      if (deletedImages.length > 0) {
        await this.prisma.media.deleteMany({
          where: {
            id: {
              in: deletedImages,
            },
          },
        });

        currentImages = currentImages.filter((image) => !deletedImages.includes(image.id));
        await this.prisma.accommodation.update({
          where: { id: accommodationId },
          data: {
            previewImgUrl: currentImages[0].imageUrl,
            thumbnailUrl: currentImages[0].thumbnailUrl,
          },
        });
      }

      return currentImages;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new GlobalException(ErrorsTypes.ACCOMMODATION_FAILED_TO_UPDATE, error.message);
    }
  }

  async getUserAccommodations(ownerId: string, options: GetUserAccommodationsDto) {
    try {
      const { page, limit, includeDeleted } = options;
      const findAccommodationsQueryObj: any = {
        where: { ownerId },
        include: {
          address: true,
        },
      };

      if (page && limit) {
        findAccommodationsQueryObj.skip = (+page - 1) * +limit;
        findAccommodationsQueryObj.take = +limit;
      }

      if (includeDeleted === true) {
        findAccommodationsQueryObj.where = { ...findAccommodationsQueryObj.where, isDeleted: true };
      }

      if (includeDeleted === false) {
        findAccommodationsQueryObj.where = {
          ...findAccommodationsQueryObj.where,
          isDeleted: false,
        };
      }
      const countAccommodationsQuery = this.prisma.accommodation.count({
        where: { ownerId },
      });

      const findAccommodationsQuery = this.prisma.accommodation.findMany(
        findAccommodationsQueryObj
      );

      const [accommodations, totalCount] = await Promise.all([
        findAccommodationsQuery,
        countAccommodationsQuery,
      ]);

      return {
        totalCount,
        data: accommodations,
      };
    } catch (error) {
      throw new GlobalException(ErrorsTypes.ACCOMMODATION_FAILED_TO_GET_LIST, error.message);
    }
  }

  async getAllAccommodations(options: OrderAndFilterDto, userId?: string) {
    try {
      const { page, limit } = options;
      const key = `accommodations?page=${page}&limit=${limit}`;
      const dataFromCache = await this.cacheManager.get(key);

      if (dataFromCache) {
        return dataFromCache;
      }

      const findManyOptions = this.generateFindAllQueryObj(options);

      this.updateQueryWithSearchOptions(findManyOptions, options);

      const findAccommodationsQuery = this.prisma.accommodation.findMany(findManyOptions);
      const countAccommodationsQuery = this.prisma.accommodation.count({
        where: findManyOptions.where,
      });
      const curPriceStatsQuery = this.prisma.accommodation.aggregate({
        _min: { price: true },
        _max: { price: true },
        where: findManyOptions.where,
      });
      const totalPriceStatsQuery = this.prisma.accommodation.aggregate({
        _min: { price: true },
        _max: { price: true },
        where: {
          available: true,
          isDeleted: false,
        },
      });

      const [accommodations, totalCount, curPriceStats, totalPriceStats] = await Promise.all([
        findAccommodationsQuery,
        countAccommodationsQuery,
        curPriceStatsQuery,
        totalPriceStatsQuery,
      ]);

      const accommodationsWithWishlist = await Promise.all(
        accommodations.map(async (accommodation) => {
          let isInWishlist;
          if (userId) {
            isInWishlist = await this.prisma.wishlist.findFirst({
              where: {
                userId: userId,
                accommodationId: accommodation.id,
              },
            });
          }
          return {
            ...accommodation,
            isInWishlist: !!isInWishlist,
          };
        })
      );

      const {
        _min: { price: curMinPrice },
        _max: { price: curMaxPrice },
      } = curPriceStats;

      const {
        _min: { price: totalMinPrice },
        _max: { price: totalMaxPrice },
      } = totalPriceStats;

      const isDefaultOptions = this.isDefaultOptions(options);
      const resultObj = {
        priceRange: { curMinPrice, curMaxPrice, totalMinPrice, totalMaxPrice },
        totalCount,
        data: accommodationsWithWishlist,
      };

      if (isDefaultOptions) {
        await this.cacheManager.set(key, resultObj);
      }

      return resultObj;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new GlobalException(ErrorsTypes.ACCOMMODATION_FAILED_TO_GET_LIST, error.message);
    }
  }

  private updateQueryWithSearchOptions(findManyOptions: any, options: OrderAndFilterDto) {
    const { location, checkInDate, checkOutDate } = options;

    if (location) {
      const addressConditions = this.makeAddressConditions(location);
      findManyOptions.where = {
        ...findManyOptions.where,
        address: addressConditions,
      };
    }

    if (!checkInDate && !checkOutDate) return;

    if (!checkInDate || !checkOutDate || this.isInvalidDateRange(checkInDate, checkOutDate)) {
      throw new BadRequestException(ErrorsTypes.BAD_REQUEST_INVALID_DATE_RANGE);
    }

    findManyOptions.where = {
      ...findManyOptions.where,
      AND: [{ availableFrom: { lte: checkInDate } }, { availableTo: { gte: checkOutDate } }],
    };
  }

  private isInvalidDateRange(checkIn: Date | undefined, checkOut: Date | undefined) {
    return (
      dayjs(checkOut).isSameOrBefore(dayjs(checkIn), 'day') ||
      dayjs(checkIn).isBefore(dayjs(), 'day') ||
      dayjs(checkOut).isSameOrBefore(dayjs(), 'day')
    );
  }

  private makeAddressConditions(location: string) {
    const addressConditions: any = {};
    const { country, city, street } = this.parseAddress(location);

    if (!city && !street) {
      const createArray = <T>(...items: T[]) => items;
      addressConditions.OR = createArray(
        { country: { startsWith: normalizeCountryName(location), mode: 'insensitive' } },
        { city: { startsWith: normalizeCityName(location), mode: 'insensitive' } },
        { street: { startsWith: location, mode: 'insensitive' } }
      );
      return addressConditions;
    }

    const addAddressCondition = (addressCondition: string, addressQuery: string | undefined) => {
      if (!addressQuery) return;
      if (addressCondition === 'street' && addressQuery.split(' ').length > 1) {
        addressQuery = addressQuery.split(' ')[0];
      }
      addressConditions[addressCondition] = {
        startsWith: addressQuery,
        mode: 'insensitive',
      };
    };

    addAddressCondition('country', normalizeCountryName(country));
    addAddressCondition('city', normalizeCityName(city));
    addAddressCondition('street', street);

    return addressConditions;
  }

  private parseAddress(addressString: string) {
    const addressComponents = addressString.split(',').map((component) => component.trim());

    const [country, city, street] = addressComponents.reverse();
    return { country, city, street };
  }

  private generateFindAllQueryObj(options: OrderAndFilterDto) {
    const {
      minPrice,
      maxPrice,
      minRooms,
      maxRooms,
      minPeople,
      maxPeople,
      page,
      limit,
      orderByPeople,
      orderByPrice,
      orderByRoom,
    } = options;
    const findManyOptions: any = {
      select: {
        id: true,
        title: true,
        thumbnailUrl: true,
        previewImgUrl: true,
        squareMeters: true,
        numberOfRooms: true,
        allowedNumberOfPeople: true,
        price: true,
        address: {
          select: {
            street: true,
            city: true,
            country: true,
            latitude: true,
            longitude: true,
          },
        },
      },

      where: {
        available: true,
        isDeleted: false,
        price: {
          gte: minPrice,
          lte: maxPrice,
        },
        numberOfRooms: {
          gte: minRooms,
          lte: maxRooms,
        },
        allowedNumberOfPeople: {
          gte: minPeople,
          lte: maxPeople,
        },
      },

      skip: (page! - 1) * limit!,
      take: limit,
    };

    const orderingBy = this.generateOderingArray<Record<OrderBy, string>>([
      [orderByPeople, OrderBy.NUMBER_OF_PEOPLE],
      [orderByPrice, OrderBy.PRICE],
      [orderByRoom, OrderBy.NUMBER_OF_ROOMS],
    ]);

    findManyOptions.orderBy = orderingBy;

    return findManyOptions;
  }

  async getAccommodationReviews(accommodationId: string, options: OrderAndFilterReviewDto) {
    try {
      const { orderByDate, orderByRate, page, limit } = options;

      const findAllReviewsQueryObj: any = {
        where: { accommodationId },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profile: {
                select: {
                  country: true,
                  imageUrl: true,
                },
              },
            },
          },
        },
      };

      if (page && limit) {
        findAllReviewsQueryObj.skip = (+page - 1) * +limit;
        findAllReviewsQueryObj.take = +limit;
      }

      const orderingBy = this.generateOderingArray<Record<reviewOrderBy, string>>([
        [orderByDate, reviewOrderBy.CREATEDAT_DATE],
        [orderByRate, reviewOrderBy.RATE],
      ]);

      findAllReviewsQueryObj.orderBy = orderingBy;

      const findAllReviewsQuery = this.prisma.review.findMany(findAllReviewsQueryObj);

      const countAccommodationReviewsQuery = this.prisma.review.count({
        where: { accommodationId },
      });

      const reviewsCountQuery = this.prisma.review.groupBy({
        by: ['rating'],
        where: { accommodationId },
        _count: true,
      });

      const averageRateQuery = this.prisma.review.aggregate({
        where: { accommodationId },
        _avg: {
          rating: true,
        },
      });

      const [reviews, ratingCounts, averageRating, totalCount] = await Promise.all([
        findAllReviewsQuery,
        reviewsCountQuery,
        averageRateQuery,
        countAccommodationReviewsQuery,
      ]);

      const {
        _avg: { rating: averageRate },
      } = averageRating;

      const countByRating = this.getCountByRating(ratingCounts);

      return { data: reviews, countByRating, averageRate, totalCount };
    } catch (error) {
      throw new GlobalException(ErrorsTypes.ACCOMMODATION_FAILED_TO_GET, error.message);
    }
  }

  async getAllAccommodationsForMap(options: any, res: any) {
    try {
      const { bbox } = options;
      const [latitude1, longitude1, latitude2, longitude2] = bbox.split(',');

      const findManyOptions = this.generateFindAllQueryObj(options);

      this.updateQueryWithSearchOptions(findManyOptions, options);

      if (!findManyOptions.where?.address) {
        findManyOptions.where.address = {};
      }

      findManyOptions.where.address = {
        ...findManyOptions.where.address,
        latitude: {
          gte: +latitude1,
          lte: +latitude2,
        },
        longitude: {
          gte: +longitude1,
          lte: +longitude2,
        },
      };

      const accommodations = await this.prisma.accommodation.findMany({
        select: {
          id: true,
          title: true,
          price: true,
          thumbnailUrl: true,
          address: {
            select: {
              latitude: true,
              longitude: true,
              country: true,
              city: true,
            },
          },
        },
        where: findManyOptions.where,
      });

      const features = [];

      if (!accommodations.length) {
        return res.jsonp({
          type: 'FeatureCollection',
          features: [],
        });
      }

      for (const item of accommodations) {
        const num = Intl.NumberFormat('en', {
          style: 'currency',
          currency: Currency.USD,
          maximumFractionDigits: 0,
        }).format(item.price);

        const newObj = {
          type: 'Feature',
          id: item.id,
          geometry: { type: 'Point', coordinates: [item.address.latitude, item.address.longitude] },
          properties: {
            iconCaption: num,
            accommodationId: item.id,
            thumbnailUrl: item.thumbnailUrl,
            balloonAccommTitle: item.title,
            balloonAdress: `${item.address.country}, ${item.address.city}`,
          },
        };
        features.push(newObj);
      }

      return res.jsonp({
        type: 'FeatureCollection',
        features,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new GlobalException(ErrorsTypes.ACCOMMODATION_FAILED_TO_GET_LIST, error.message);
    }
  }

  async getAllBookings(accommodationId: string, userId: string, options: AccommodationBookingsDto) {
    try {
      const { currentMonth, nextMonth } = options;

      const accommodation = await this.prisma.accommodation.findUnique({
        include: { booking: true },
        where: {
          id: accommodationId,
          ownerId: userId,
        },
      });

      if (!accommodation) throw new NotFoundException(ErrorsTypes.NOT_FOUND_ACCOMMODATION);

      type BookingWhereInput = {
        accommodationId: string;
        OR?: ({ startDate: { gte: string } } | { endDate: { gte: string } })[];
      };

      const findBookingQuery = {
        select: {
          id: true,
          userId: true,
          startDate: true,
          endDate: true,
          status: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
              profile: {
                select: {
                  imageUrl: true,
                },
              },
            },
          },
          payment: {
            select: {
              totalAmount: true,
            },
          },
        },

        where: {
          accommodationId: accommodation.id,
        } as BookingWhereInput,
      };

      if (currentMonth && nextMonth) {
        currentMonth.setDate(1);
        currentMonth.setUTCHours(0, 0, 0, 0);

        nextMonth.setDate(1);
        nextMonth.setUTCHours(0, 0, 0, 0);

        findBookingQuery.where = {
          accommodationId: accommodation.id,
          OR: [
            {
              startDate: {
                gte: currentMonth.toISOString(),
              },
            },
            {
              endDate: {
                gte: currentMonth.toISOString(),
              },
            },
          ],
        };
      }

      const data = await this.prisma.booking.findMany({
        ...findBookingQuery,
        orderBy: { startDate: 'asc' },
      });
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new GlobalException(ErrorsTypes.ACCOMMODATION_FAILED_TO_GET, error.message);
    }
  }

  private getCountByRating(ratingCounts: { rating: number; _count: number }[]) {
    const countByRating: Record<number, number> = {};

    for (const ratingCount of ratingCounts) {
      const rating = ratingCount.rating;
      const count = ratingCount._count;

      countByRating[rating] = count;
    }

    return countByRating;
  }

  private generateOderingArray<T>(array: [value: SortOrder | undefined, columnName: keyof T][]) {
    const orderingObjsArray = [];

    for (const order of array) {
      if (order[0]) {
        const orderingObj = { [order[1]]: order[0] };
        orderingObjsArray.push(orderingObj);
      }
    }

    return orderingObjsArray;
  }

  private isDefaultOptions(options: OrderAndFilterDto): boolean {
    const {
      limit = CachingPagesLimit,
      minPrice = 0,
      maxPrice = AccommodationMaxPrice,
      minRooms = 0,
      maxRooms = AccommodationMaxRooms,
      minPeople = 0,
      maxPeople = AccommodationMaxPeople,
    } = options;
    return (
      limit === CachingPagesLimit &&
      minPrice === 0 &&
      maxPrice === AccommodationMaxPrice &&
      minRooms === 0 &&
      maxRooms === AccommodationMaxRooms &&
      minPeople === 0 &&
      maxPeople === AccommodationMaxPeople
    );
  }
}
