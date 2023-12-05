import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as CookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = process.env.API_PORT || 3000;

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(CookieParser());
  app.enableCors({
    origin: process.env.ALLOWED_ORIGIN,
  });

  if (process.env.MODE !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Booking example')
      .setDescription('The Booking API description')
      .setVersion('1.0')
      .addBearerAuth()
      .addCookieAuth('refresh_token')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  await app.listen(port, () => {
    console.log('listening on port ' + port);
  });
}
bootstrap();
