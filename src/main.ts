import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = process.env.API_PORT || 3000;

  if (process.env.MODE !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Airbnb clone')
      .setDescription('The cats API description')
      .setVersion('1.0')
      .addTag('airbnb')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(port);
}
bootstrap();
