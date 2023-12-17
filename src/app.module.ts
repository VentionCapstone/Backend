import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AccommodationModule } from './accommodation/accommodation.module';
import { AmenitiesModule } from './amenities/amenities.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BookingModule } from './booking/booking.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    UserModule,
    AmenitiesModule,
    AccommodationModule,
    BookingModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}
