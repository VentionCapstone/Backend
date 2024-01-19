import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [WishlistController],
  providers: [WishlistService, PrismaService],
})
export class WishlistModule {}
