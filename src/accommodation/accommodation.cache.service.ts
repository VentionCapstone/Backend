import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';

import { Cache } from 'cache-manager';
import { AccommodationService } from './accommodation.service'; // Import the service where retrieveAccommodations method is defined
import { OrderAndFilterDto } from './dto/orderAndFilter.dto';

@Injectable()
export class CacheService implements OnApplicationBootstrap {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private accommodationService: AccommodationService // Inject the AccommodationService
  ) {}

  async onApplicationBootstrap() {
    await this.cacheFirst20Pages();
  }

  async cacheFirst20Pages() {
    for (let page = 1; page <= 90; page++) {
      console.log(page);
      const options: OrderAndFilterDto = { page, limit: 12 };
      await this.accommodationService.getAllAccommodations(options);
    }
  }
}
