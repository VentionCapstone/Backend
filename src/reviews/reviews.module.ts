import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';

@Module({
  imports: [PrismaModule, JwtModule.register({})],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
