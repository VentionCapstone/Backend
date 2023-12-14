import { Module } from '@nestjs/common';
import { AccommodationsListController } from './accommodationsList.controller';
import { AccommodationsListService } from './accommodationsList.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, JwtModule.register({})],
  controllers: [AccommodationsListController],
  providers: [AccommodationsListService],
})
export class AccommodationsListModule {}
