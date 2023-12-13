import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as CookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './filters/global.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = process.env.API_PORT || 3000;

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(CookieParser());
  app.enableCors({
    origin: process.env.ANY_ORIGIN === 'true' ? true : process.env.FRONTEND_URL,
    credentials: true,
  });

  if (process.env.MODE !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Booking example')
      .setDescription('The Booking API description')
      .setVersion('1.0')
      .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      })
      .addCookieAuth('refresh_token')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  app.useGlobalFilters(new GlobalExceptionFilter(app.get(Logger)));

  await app.listen(port, () => {
    console.log('listening on port ' + port);
  });
}
bootstrap();
