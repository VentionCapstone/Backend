import { ConfigModule } from '@nestjs/config';
import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccommodationModule } from './accommodation/accommodation.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    UserModule,
    AccommodationModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}
