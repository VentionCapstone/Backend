import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CacheService } from './accommodation.cache.service';
import { AccommodationController } from './accommodation.controller';
import { AccommodationService } from './accommodation.service';

const { CACHE_TIMEOUT } = process.env;
const CacheTimeout = parseInt(CACHE_TIMEOUT!);

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({}),
    HttpModule,
    CacheModule.register({ ttl: CacheTimeout }),
  ],
  controllers: [AccommodationController],
  providers: [AccommodationService, CacheService],
})
export class AccommodationModule {}
