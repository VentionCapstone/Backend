import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccommodationModule } from './accommodation/accommodation.module';
@Module({
  imports: [AccommodationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
