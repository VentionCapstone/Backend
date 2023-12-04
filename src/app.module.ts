import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccommodationModule } from './accommodation/accommodation.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AmenitiesModule } from './amenities/amenities.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    AmenitiesModule,
    AccommodationModule,
    AmenitiesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
