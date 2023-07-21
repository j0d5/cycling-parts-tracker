/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      // only decorated parameters in DTOs are delievered
      whitelist: true,
      // additional parameters will cause an error!
      forbidNonWhitelisted: true,
    })
  );

  // set up versioning
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v1',
  });

  // TODO - revisit and secure this!
  app.enableCors({
    origin: '*',
  });

  // handle swagger
  const config = new DocumentBuilder()
    .setTitle(`Full Stack CPT REST API`)
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
