import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as CookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = process.env.API_PORT || 3000;

  const config = new DocumentBuilder()
    .setTitle('Booking example')
    .setDescription('The Booking API description')
    .setVersion('1.0')
    .addTag('Booking')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.use(CookieParser());

  await app.listen(port, () => {
    console.log('listening on port ' + port);
  });
}
bootstrap();
