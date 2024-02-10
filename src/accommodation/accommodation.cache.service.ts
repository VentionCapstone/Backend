import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { AccommodationService } from './accommodation.service';
import { OrderAndFilterDto } from './dto/orderAndFilter.dto';

const { CACHING_PAGES, CACHING_PAGES_LIMIT } = process.env;
const CachingPages = parseInt(CACHING_PAGES!);
const CachingPagesLimit = parseInt(CACHING_PAGES_LIMIT!);

@Injectable()
export class CacheService implements OnApplicationBootstrap {
  constructor(private accommodationService: AccommodationService) {}

  async onApplicationBootstrap() {
    await this.cacheMainPages();
  }

  async cacheMainPages() {
    for (let page = 1; page <= CachingPages; page++) {
      const options: OrderAndFilterDto = { page, limit: CachingPagesLimit };
      await this.accommodationService.getAllAccommodations(options);
    }
  }
}
