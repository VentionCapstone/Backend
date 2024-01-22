import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AccommodationController } from './accommodation.controller';
import { AccommodationService } from './accommodation.service';

@Module({
  imports: [PrismaModule, JwtModule.register({}), HttpModule],
  controllers: [AccommodationController],
  providers: [AccommodationService],
})
export class AccommodationModule {}
